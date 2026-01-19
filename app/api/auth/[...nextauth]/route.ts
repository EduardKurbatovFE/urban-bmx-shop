import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = process.env.UUID_NAMESPACE!;

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('Введіть email та пароль');

        const { email, password } = credentials;

        try {
          const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (findError && findError.code !== 'PGRST116') {
            console.error('⚠️ Помилка запиту користувача:', findError.message);
            throw new Error('Помилка запиту користувача');
          }

          if (!existingUser) {
            const hashed = await bcrypt.hash(password, 10);

            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                email,
                password: hashed,
                created_at: new Date().toISOString(),
                provider: 'credentials',
              })
              .select('*')
              .single();

            if (insertError) {
              throw new Error('Не вдалося створити користувача');
            }

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
            };
          }

          if (!existingUser.password) {
            throw new Error(
              'Цей користувач створений через Google — увійди через Google.'
            );
          }

          const isValid = await bcrypt.compare(password, existingUser.password);

          if (!isValid) {
            throw new Error('Невірний пароль');
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            avatar: existingUser.avatar_url,
          };
        } catch (err) {
          throw new Error('Помилка при вході або реєстрації');
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Supabase select error:', error);
        return false;
      }

      if (!data) {
        let id;
        let name;
        let lastName;

        if (account?.provider === 'google' && user.id) {
          id = uuidv5(user.id, NAMESPACE);
          name = user.name?.split(' ')[0];
          lastName = user.name?.split(' ')[1];
        }

        const { error: insertError } = await supabase.from('users').insert({
          id,
          email: user.email,
          name,
          lastName,
          image: user.image,
          provider: account?.provider || 'credentials',
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error('Failed to insert Google user:', insertError);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const { data } = await supabase
          .from('users')
          .select('id, name, lastName, email, avatar_url')
          .eq('email', user.email)
          .maybeSingle();

        if (data) {
          token.user = data;
        }
      }

      if (trigger === 'update' && session?.user && token.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

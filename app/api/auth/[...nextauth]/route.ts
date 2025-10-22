import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    // 👉 Google OAuth
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // 👉 Email + Password (Credentials)
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

        const { email, password, name } = credentials;

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
      try {
        if (!user?.email) return false;

        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();

        if (!data) {
          console.log('🪄 Створюємо користувача через callback...');
          await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider || 'credentials',
            created_at: new Date().toISOString(),
          });
        }

        return true;
      } catch (err) {
        console.error('🔥 signIn callback error:', err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },

    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

import { supabase } from '@/lib/supabase';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('Missing credentials');

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error('Invalid email or password');
        }

        if (!data.user.email_confirmed_at) {
          throw new Error('Email not confirmed');
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || null,
          image: data.user.user_metadata?.avatar_url || null,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user?.email) return true;

        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!data) {
          const { error: insertError } = await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            created_at: new Date().toISOString(),
            provider: account?.provider || 'credentials',
          });

          if (insertError)
            console.error('❌ Insert user error:', insertError.message);
          else console.log('✅ User created in Supabase');
        }

        return true;
      } catch (err) {
        console.error('🔥 signIn callback error:', err);
        return true;
      }
    },
  },
});

export { handler as GET, handler as POST };

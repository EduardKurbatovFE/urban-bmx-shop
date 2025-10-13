import { supabase } from '@/lib/supabase';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      console.log('🔐 [signIn] Логін користувача:', user);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('⚠️ Помилка при перевірці існування:', error.message);
          // Але не блокуємо логін
        }

        if (!data) {
          console.log('📦 Додаємо користувача...');
          const { error: insertError } = await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            created_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error(
              '❌ Помилка вставки користувача:',
              insertError.message
            );
            // Але не повертаємо false, бо це не критично
          } else {
            console.log('✅ Користувача додано в Supabase!');
          }
        } else {
          console.log('ℹ️ Користувач вже існує:', data.id);
        }

        return true; // Дозволити логін у будь-якому випадку
      } catch (err) {
        console.error('🔥 Фатальна помилка в signIn callback:', err);
        return true; // Дозволити логін навіть якщо щось пішло не так
      }
    },
  },
});

export { handler as GET, handler as POST };

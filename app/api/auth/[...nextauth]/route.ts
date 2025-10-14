import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

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
      },
      async authorize(
        credentials: { email: string; password: string } | undefined
      ) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          // Перевіряємо, чи існує користувач в базі
          const { data: existingUser, error: findUserError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (findUserError && findUserError.code !== 'PGRST116') {
            console.error(
              '⚠️ Помилка при перевірці існування користувача:',
              findUserError.message
            );
            return null;
          }

          if (!existingUser) {
            // Якщо користувач не знайдений, повертаємо помилку
            console.error('❌ Користувач не знайдений');
            return null;
            // throw new Error('Користувач не знайдений');
          }

          // Якщо користувач існує, перевіряємо пароль
          const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (!isPasswordCorrect) {
            console.error('❌ Невірний пароль');
            throw new Error('Невірний пароль');
          }

          // Якщо все гаразд, повертаємо користувача з необхідними полями
          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
          };
        } catch (error) {
          console.error('🔥 Помилка при авторизації або реєстрації:', error);
          throw new Error('Помилка при авторизації124554');
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt', // Використовуємо JWT для зберігання сесії
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('🔐 [signIn] Логін користувача:', user);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user?.email)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('⚠️ Помилка при перевірці існування:', error.message);
        }

        if (!data) {
          console.log('📦 Додаємо користувача...');
          const { error: insertError } = await supabase.from('users').insert({
            email: user?.email,
            name: user?.name,
            image: user?.image,
            created_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error(
              '❌ Помилка вставки користувача:',
              insertError.message
            );
          } else {
            console.log('✅ Користувача додано в Supabase!');
          }
        } else {
          console.log('ℹ️ Користувач вже існує:', data.id);
        }

        return true; // Дозволяємо авторизацію в будь-якому випадку
      } catch (err) {
        console.error('🔥 Фатальна помилка в signIn callback:', err);
        return true; // Дозволяємо авторизацію навіть якщо щось пішло не так
      }
    },
  },
});

export { handler as GET, handler as POST };

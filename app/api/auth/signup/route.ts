// /api/auth/signup.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const redirectUrl = `http://localhost:3000/api/auth/callback?email=${encodeURIComponent(email)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('❌ SignUp error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
        created_at: new Date().toISOString(),
        provider: 'credentials',
      });
    }

    return NextResponse.json({
      message: 'Користувача створено. Перевірте пошту для підтвердження email.',
    });
  } catch (e) {
    console.error('🔥 Fatal signup error:', e);
    return NextResponse.json(
      { error: 'Непередбачувана помилка' },
      { status: 500 }
    );
  }
}

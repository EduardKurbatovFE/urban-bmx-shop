import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single<User>();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error('❌ Error fetching user:', err.message);

    return NextResponse.json(
      { error: 'Failed to fetch user', details: err.message },
      { status: 500 }
    );
  }
}

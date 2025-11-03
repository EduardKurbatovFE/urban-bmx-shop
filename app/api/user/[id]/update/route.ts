import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const { field, value }: { field: keyof User; value: string | number } = body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error occurred';

    console.error('❌ Error updating user:', message);

    return NextResponse.json(
      { error: 'Failed to update user', details: message },
      { status: 500 }
    );
  }
}

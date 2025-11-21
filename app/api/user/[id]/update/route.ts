import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';
import { revalidateTag } from 'next/cache';
import { CashTags } from '@/lib/constants/cashTags';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const { field, value }: { field: keyof User; value: string | number } = body;

  try {
    const { data, error, status } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', id)
      .select('*');

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to update user',
          details: {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          },
        },
        { status: 500 }
      );
    }
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found or no permission to update',
          details: 'Check RLS policies or ID formatting',
        },
        { status: 404 }
      );
    }
    revalidateTag(CashTags.User);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('❌ Unexpected error updating user:', err);
    return NextResponse.json(
      { error: 'Failed to update user', details: err },
      { status: 500 }
    );
  }
}

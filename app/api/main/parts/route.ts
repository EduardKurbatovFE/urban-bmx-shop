import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(__: Request) {
  try {
    const { data: parts, error } = await supabase
      .from('parts')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json(parts, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';

    console.error('❌ Error fetching parts:', message);

    return NextResponse.json(
      { error: 'Failed to fetch parts', details: message },
      { status: 500 }
    );
  }
}

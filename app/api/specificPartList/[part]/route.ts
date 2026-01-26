import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  __: Request,
  { params }: { params: Promise<{ part: string }> }
) {
  const { part } = await params;

  console.log(`Fetching data for part: ${part}`);

  try {
    const { data: parts, error } = await supabase.from(part).select('*');

    if (error) throw error;

    return NextResponse.json(parts, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';

    console.error(`❌ Error fetching ${part}:`, message);

    return NextResponse.json(
      { error: `Failed to fetch ${part}`, details: message },
      { status: 500 }
    );
  }
}

import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default async function Home() {
  const { data, error } = await supabase.from('parts').select('*');

  console.log(data);

  return (
    <div className="font-sans items-center justify-items-center min-h-[calc(100vh-160px)] gap-16">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
    </div>
  );
}

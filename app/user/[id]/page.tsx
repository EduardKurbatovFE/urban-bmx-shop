import { supabase } from '@/lib/supabase';
import UserTabs from '../components/UserTabs';
import { useSession } from 'next-auth/react';
import { User } from '@/types/common';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single<User>();

  if (!user) {
    return <p>Упс! Щось пішло не так...</p>;
  }

  return (
    <div className="flex justify-center py-6">
      <div className="w-1/2">
        <UserTabs user={user} />
      </div>
    </div>
  );
};

export default UserPage;

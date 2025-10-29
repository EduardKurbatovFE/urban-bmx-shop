import { supabase } from '@/lib/supabase';
import UserTabs from '../components/UserTabs';
import { useSession } from 'next-auth/react';
import { User } from '@/types/common';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

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
      <div className="w-4/12">
        <UserTabs user={user} />
      </div>
    </div>
  );
};

export default UserPage;

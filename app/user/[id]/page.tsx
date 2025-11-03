import { getBaseUrl } from '@/lib/getBaseUrl';
import UserTabs from '../components/UserTabs';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const baseURL = await getBaseUrl();

  const res = await fetch(`${baseURL}/api/user/${id}`, {
    cache: 'force-cache',
  });

  const user = await res.json();

  if (!res.ok) {
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

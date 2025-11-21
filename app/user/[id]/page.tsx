import { getBaseUrl } from '@/lib/getBaseUrl';
import UserTabs from '../components/UserTabs';
import { CashTags } from '@/lib/constants/cashTags';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const baseURL = await getBaseUrl();
  const { id } = await params;

  const res = await fetch(`${baseURL}/api/user/${id}`, {
    next: { tags: [CashTags.User] },
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

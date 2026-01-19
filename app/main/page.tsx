import ErrorText from '@/components/Error';
import { CashTags } from '@/lib/constants/cashTags';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { Part } from '@/types/common';

const MainPage = async () => {
  const baseURL = await getBaseUrl();

  const res = await fetch(`${baseURL}/api/main/parts`, {
    next: { tags: [CashTags.Parts] },
  });

  const parts: Part[] = await res.json();

  if (!res.ok) {
    return <ErrorText />;
  }

  return (
    <div className=" flex justify-center py-8">
      <div className="w-10/12 border-container rounded-lg"></div>
    </div>
  );
};

export default MainPage;

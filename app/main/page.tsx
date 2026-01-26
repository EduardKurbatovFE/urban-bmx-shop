import ErrorText from '@/components/Error';
import { CashTags } from '@/lib/constants/cashTags';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { Part } from '@/types/common';
import PartComponent from './components/part';

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
    <div className="flex justify-center py-8">
      <div className="w-10/12">
        {parts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parts.map((part) => (
              <PartComponent key={part.logicalName} part={part} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;

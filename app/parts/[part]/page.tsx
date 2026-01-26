import ErrorText from '@/components/Error';
import { CashTags } from '@/lib/constants/cashTags';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { Product } from '@/types/common';
import ProductComponent from './components/product';

const PartsList = async ({ params }: { params: Promise<{ part: string }> }) => {
  const baseURL = await getBaseUrl();
  const { part } = await params;

  const res = await fetch(`${baseURL}/api/specificPartList/${part}`, {
    next: { tags: [CashTags.SpecificPartList] },
  });

  const partList: Product[] = await res.json();

  if (!res.ok) {
    return <ErrorText />;
  }

  return (
    <div className="flex justify-center py-8">
      <div className="w-10/12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partList.length > 0 &&
            partList.map((product: Product) => (
              <ProductComponent key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PartsList;

import { ProductProps } from './types';

const ProductComponent: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="flex flex-col items-center border-container rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
      <h2>
        {product.brand} {product.model}
      </h2>
    </div>
  );
};

export default ProductComponent;

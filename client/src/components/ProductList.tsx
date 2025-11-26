import { ProductType } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: ProductType[];
  className?: string;
}

const ProductList = ({ products, className = "" }: ProductListProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;

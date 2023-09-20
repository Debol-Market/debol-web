import { Product } from "@/utils/types";
import Link from "next/link";

type props = {
  product: Product & { id: string };
};

const ProductCard = ({ product }: props) => {


  return (
    <Link href={`/admin/products/${product.id}`}>
      <div className="min-h-[150px] hover:bg-slate-100 min-w-[180px] px-6 py-4 bg-white shadow rounded-md flex gap-3">
        <div className="">
          <h1 className="text-2xl">{product.name}</h1>
          <p className="text-slate-600" >
            {product.name} - ${product.price / 100}
          </p>
        </div>
      </div>
    </Link>);
}

export default ProductCard;
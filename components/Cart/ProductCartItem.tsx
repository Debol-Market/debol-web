import useApp from "@/services/appContext";
import { getUrl } from "@/services/storage";
import convertCurrency from "@/utils/convertCurrency";
import { Product, ProductItem } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import ContentLoader from "react-content-loader";
import { AiFillMinusCircle } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoAddCircle, IoCloseCircleOutline } from "react-icons/io5";

export default function ProductCartItem({
  productItem,
  product,
  onDel,
  onChange,
}: {
  productItem: ProductItem;
  product: Product;
  onDel: () => void;
  onChange: (qty: number) => void;
}) {
  const [isExpanded, setisExpanded] = useState(false);
  const { currencyMultiplier, currency } = useApp();
  const { data, status } = useQuery({
    queryKey: ["getProductImage", productItem.productId],
    queryFn: () => getUrl(product.image),
  });

  return (
    <div
      className={`flex flex-col px-4 ${
        isExpanded && "border-b border-neutral-300 bg-neutral-50"
      }`}
      onClick={() => setisExpanded(!isExpanded)}
    >
      <div className="flex py-4 gap-3 items-start">
        <div className="h-24 w-24 border border-neutral-300 rounded-md">
          {status == "success" ? (
            <Image
              src={data}
              alt=""
              height={96}
              width={96}
              className="h-full object-cover"
            />
          ) : (
            <ContentLoader viewBox="0 0 96 96">
              <rect x="0" y="0" rx="3" ry="3" width="96" height="96" />
            </ContentLoader>
          )}
        </div>
        <div className="grow flex flex-col h-full">
          <h3 className="text-xl">{product.name}</h3>
          <p className="font-bold text-lg">
            {convertCurrency(product?.price ?? 0, currencyMultiplier, currency)}
          </p>
          <div
            className="flex gap-2 text-neutral-800 mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="" onClick={() => onChange(productItem.qty - 1)}>
              {productItem.qty == 1 ? (
                <BiSolidTrashAlt className="h-6 w-6" />
              ) : (
                <AiFillMinusCircle className="h-6 w-6" />
              )}
            </button>
            <span>{productItem.qty}</span>
            <button onClick={() => onChange(productItem.qty + 1)}>
              <IoAddCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        <button onClick={onDel}>
          <IoCloseCircleOutline className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

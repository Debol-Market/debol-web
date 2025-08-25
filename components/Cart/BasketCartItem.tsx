import useApp from "@/services/appContext";
import { getUrl } from "@/services/storage";
import convertCurrency from "@/utils/convertCurrency";
import { Basket, BasketItem } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ContentLoader from "react-content-loader";

export default function BasketCartItem({
  basketItem,
  basket,
  onDel,
  onChange,
}: {
  basketItem: BasketItem;
  basket: Basket;
  onDel: () => void;
  onChange: (qty: number) => void;
}) {
  const [isExpanded, setisExpanded] = useState(false);
  const { currencyMultiplier, currency } = useApp();
  const { data, status } = useQuery({
    queryKey: ["getBasketImage", basketItem.basketId],
    queryFn: () => getUrl(basket.image),
  });

  const size = basket.sizes.find((s) => s.id == basketItem.sizeId);

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
        <div className=" grow">
          <h3 className="text-base">{basket.name}</h3>
          <p className="text-sm pb-1">{size?.name}</p>
          <p className="font-semibold font-mono text-accent text-sm">
            {convertCurrency(size?.price ?? 0, currencyMultiplier, currency)}
          </p>
          
          <div
            className="flex gap-2 text-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="" onClick={() => onChange(basketItem.qty - 1)}>
              {basketItem.qty == 1 ? (
                <Trash className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </button>
            <span>{basketItem.qty}</span>
            <button onClick={() => onChange(basketItem.qty + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button onClick={onDel}>
          <X className="h-4 w-4" />
        </button>
      </div>
      {isExpanded && (
        <div className="pb-3 px-2">
          {size &&
            size.items.map((item) => (
              <div className="flex gap-2 justify-between  text-sm mb-1" key={item.name}>
                <div className="w-[120px] text-sm ">{item.name}</div>
                <div className="">
                  {item.quantity}
                  {item.unit} x{" "}
                  {convertCurrency(
                    item.pricePerUnit,
                    currencyMultiplier,
                    currency,
                  )}
                </div>
                <div className="font-mono">
                  {convertCurrency(
                    item.pricePerUnit * item.quantity,
                    currencyMultiplier,
                    currency,
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FC } from "react";
import ContentLoader from "react-content-loader";

type props = {
  id: string;
  basket: Basket;
};

const BasketCard: FC<props> = ({ id, basket }) => {
  const { data, status } = useQuery({
    queryKey: ["getBasketImage", id],
    queryFn: () => getUrl(basket.image),
  });

  return (
    <Link
      href={`basket/${id}`}
      className="w-full max-w-md min-w-[240px] h-full snap-mandatory scroll-ml-3 snap-x snap-start"
    >
      <div className="border shadow-lg rounded-2xl px-4 py-5 bg-white h-full">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-square">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <ContentLoader viewBox="0 0 200 300" className="w-full aspect-[2/3]">
            <rect x="0" y="0" rx="3" ry="3" height={300} width={200} />
          </ContentLoader>
        )}
        <div className="flex flex-col py-1">
          <p className="font-medium md:text-lg max-w-[200px]">{basket.name}</p>
          {basket.description && (
            <p className="text-sm text-gray-700 truncate">
              {basket.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BasketCard;

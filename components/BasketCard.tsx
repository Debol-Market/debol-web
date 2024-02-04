import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

type props = {
  id: string;
  basket: Basket;
};

const BasketCard = ({ id, basket }: props) => {
  const { data, status } = useQuery({
    queryKey: ["getBasketImage", id],
    queryFn: () => getUrl(basket.image),
  });

  return (
    <Link
      href={`/basket/${id}`}
      className="w-full max-w-[280px] shrink-0 h-full snap-mandatory scroll-ml-3 snap-x snap-start"
    >
      <div className="border shadow-lg rounded-2xl px-4 py-5 bg-white h-full">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-square">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <Skeleton className="rounded-lg overflow-hidden w-full aspect-square" />
        )}
        <div className="flex flex-col py-1">
          <p className="font-medium md:text-lg max-w-[200px] truncate">
            {basket.name}
          </p>
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

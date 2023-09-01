import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
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
    <Link href={`basket/${id}`} className="w-full max-w-md h-full">
      <div className="border shadow-lg rounded-2xl px-4 py-5 bg-white h-full">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-[3/2]">
            <img
              src={data}
              alt=""
              className="object-cover aspect-square w-full"
            />
          </div>
        ) : (
          <ContentLoader viewBox="0 0 300 200" className="w-full aspect-[3/2]">
            <rect x="0" y="0" rx="3" ry="3" height={200} width={300} />
          </ContentLoader>
        )}
        <p className="text-lg md:text-xl mt-3 max-w-[200px]">{basket.name}</p>
      </div>
    </Link>
  );
};

export default BasketCard;

import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

type props = {
  id: string;
  basket: Basket;
};

const BasketCard: FC<props> = ({ id, basket }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    getUrl(basket.image).then(setImage);
  }, []);

  return (
    <Link
      href={`basket/${id}`}
      className="w-full min-[480px]:max-w-[300px] min-w-[200px]"
    >
      <div className="border shadow-lg rounded-2xl px-4 py-5 bg-white">
        {image ? (
          <div className="rounded-lg overflow-hidden w-full">
            <img
              src={image}
              alt=""
              className="object-cover aspect-square w-full"
            />
          </div>
        ) : (
          <ContentLoader viewBox="0 0 200 200" className="w-full h-full">
            <rect x="0" y="0" rx="3" ry="3" className="w-full h-full" />
          </ContentLoader>
        )}
        <p className="text-lg md:text-xl mt-3 max-w-[200px]">{basket.name}</p>
      </div>
    </Link>
  );
};

export default BasketCard;

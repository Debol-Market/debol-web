import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

type props = {
  basket: Basket;
};

const BasketCard: FC<props> = ({ basket }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    getUrl(basket.image).then(setImage);
  }, []);

  return (
    <div className="border shadow-lg rounded-2xl px-4 py-5 bg-white">
      {image ? (
        <div className="rounded-lg overflow-hidden">
          <Image
            src={image}
            alt=""
            height={180}
            width={200}
            className="object-cover aspect-square"
          />
        </div>
      ) : (
        <ContentLoader viewBox="0 0 200 180">
          <rect x="0" y="0" rx="3" ry="3" width="200" height="180" />
        </ContentLoader>
      )}
      <p className="text-xl mt-3 max-w-[200px]">{basket.name}</p>
    </div>
  );
};

export default BasketCard;

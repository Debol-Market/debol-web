import ContentLoader from "react-content-loader";
import BasketCard from "./BasketCard";
import { Basket } from "@/utils/types";

type props = {
  name: string;
  baskets: (Basket & { id: string })[];
};

export default function CatagoryRow({ name, baskets }: props) {
  return (
    <>
      <h2 className="text-lg">{name}</h2>
      <div className="flex gap-6 overflow-auto w-full py-4 sm:px-4 no-scrollbar">
        {baskets.map((item) => (
          <BasketCard basket={item} id={item.id} key={item.id} />
        ))}
        {baskets.map((item) => (
          <BasketCard basket={item} id={item.id} key={item.id} />
        ))}
        {baskets.map((item) => (
          <BasketCard basket={item} id={item.id} key={item.id} />
        ))}
      </div>
    </>
  );
}

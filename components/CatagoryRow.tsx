import ContentLoader from "react-content-loader";
import BasketCard from "./BasketCard";
import { Basket } from "@/utils/types";

type props = {
  name: string;
  baskets: (Basket & { id: string })[];
};

export default function CatagoryRow({ name, baskets }: props) {
  return (
    <div className="">
      <h2 className="text-lg">{name}</h2>
      <div
        className="grid gap-6 w-full p-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {baskets.map((item) => (
          <BasketCard basket={item} id={item.id} key={item.id} />
        ))}
      </div>
    </div>
  );
}

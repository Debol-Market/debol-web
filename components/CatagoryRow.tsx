import { getBasketsByCatagory } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import ContentLoader from "react-content-loader";
import BasketCard from "./BasketCard";

type props = {
  name: string;
};

export default function CatagoryRow({ name }: props) {
  const { data, status } = useQuery({
    queryKey: ["getBasketsByCatagories", name],
    queryFn: () => getBasketsByCatagory(name),
  });

  return (
    <div className="">
      <h2 className="text-lg">{name}</h2>
      <div
        className="grid gap-6 w-full p-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {status == "success"
          ? data.map((item) => (
            <BasketCard basket={item} id={item.id} key={item.id} />
          ))
          : [1, 2, 3, 4].map((item) => (
            <ContentLoader
              viewBox="0 0 200 300"
              className="w-full h-full rounded-2xl"
              key={item}
            >
              <rect x="0" y="0" rx="3" ry="3" height={300} width={200} />
            </ContentLoader>
          ))}
      </div>
    </div>
  );
}

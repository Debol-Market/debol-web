import { getBasketsByCatagory } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BasketCard from "./BasketCard";

type props = {
  name: string;
};

export default function CatagoryRow({ name }: props) {
  const { data, status } = useQuery({
    queryKey: ["getCatagories", name],
    queryFn: () => getBasketsByCatagory(name),
  });

  return (
    <div className="">
      <h2>{name}</h2>
      <div
        className="grid gap-6 w-full p-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {status == "success" ? (
          data.map((item) => (
            <BasketCard basket={item} id={item.id} key={item.id} />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

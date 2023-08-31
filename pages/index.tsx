import add4 from "@/assets/add4.png";
import BasketCard from "@/components/BasketCard";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import { getBaskets } from "@/services/database";
import { Basket } from "@/utils/types";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import "swiper/css";

const Page = () => {
  const [baskets, setBaskets] = useState<(Basket & { id: string })[]>([]);

  useEffect(() => {
    getBaskets().then(setBaskets);
  }, []);

  if (!baskets.length) return <></>;
  return (
    <>
      <Head>
        <title>Debol Market</title>
        <meta name="description" content="Show your love to your family." />
      </Head>
      <Navbar />
      <div className="flex gap-8 sm:p-8 p-5 sm:pb-8 pb-4 justify-center">
        <Carousel />
        <div className="rounded-3xl overflow-hidden hidden md:block relative min-w-[240px] -z-10">
          <Image src={add4} fill alt="" className="-z-10" />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="px-4 max-w-5xl w-full min-[480px]:mx-4">
          <h2 className="text-2xl font-semibold">Baskets</h2>
          <div
            className="grid gap-6 w-full p-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {baskets.map((item) => (
              <BasketCard basket={item} key={item.id} id={item.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

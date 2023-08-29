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
      <div className="fixed top-1/4 h-[50vh] -z-50 bg-mint w-full"></div>
      <Navbar />
      <div className="flex gap-8 sm:p-8 p-5 sm:pb-8 pb-4 justify-center">
        {/* 
        <div className="sm:rounded-3xl rounded-2xl shadow-md overflow-hidden flex grow max-w-3xl">
          <Swiper slidesPerView={1} slidesPerGroup={3} className="flex w-full">
            <SwiperSlide>
              <div className="relative sm:h-[30vh] h-[15vh] grow z-20">
                <Image src={ad1} fill alt="" className="object-cover z-30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative sm:h-[30vh] h-[15vh] grow z-20">
                <Image src={ad2} fill alt="" className="object-cover z-30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative sm:h-[30vh] h-[15vh] grow z-20">
                <Image src={ad3} fill alt="" className="object-cover z-30" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
           */}
        <Carousel />
        <div className="rounded-3xl overflow-hidden hidden md:block relative min-w-[240px]">
          <Image src={add4} fill alt="" className="object-cover -z-10" />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="px-4 max-w-5xl w-full min-[480px]:mx-4">
          <h2 className="text-2xl font-semibold">Baskets</h2>
          <div
            className="grid gap-6 w-full p-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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

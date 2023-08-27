import ad1 from "@/assets/ad1.png";
import ad2 from "@/assets/ad2.png";
import ad3 from "@/assets/ad3.png";
import add4 from "@/assets/add4.png";
import BasketCard from "@/components/BasketCard";
import Navbar from "@/components/Navbar";
import { getBaskets } from "@/services/database";
import { Basket } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const Page = () => {
  const [baskets, setBaskets] = useState<(Basket & { id: string })[]>([]);

  useEffect(() => {
    getBaskets().then(setBaskets);
  }, []);

  if (!baskets.length) return <></>;
  return (
    <>
      <div className="fixed top-1/4 h-[50vh] -z-50 bg-mint w-full"></div>
      <Navbar />
      <div className="flex gap-8 sm:p-8 pb-8">
        <div className="sm:rounded-3xl overflow-hidden flex">
          <Swiper
            slidesPerView={1}
            slidesPerGroup={3}
            autoplay={{
              delay: 1000,
            }}
            className="flex"
          >
            <SwiperSlide>
              <div className="relative h-[30vh] grow">
                <Image src={ad1} fill alt="" className="object-cover" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-[30vh] grow">
                <Image src={ad2} fill alt="" className="object-cover" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-[30vh] grow">
                <Image src={ad3} fill alt="" className="object-cover" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="rounded-3xl overflow-hidden hidden md:block relative min-w-[240px]">
          <Image src={add4} fill alt="" className="object-cover" />
        </div>
      </div>
      <div className="px-6">
        <h2 className="text-2xl font-semibold">Baskets</h2>
        <div className="flex gap-4 flex-wrap p-4">
          {baskets.map((item) => (
            <Link href={`basket/${item.id}`} key={item.id}>
              <BasketCard basket={item} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;

import ad1 from "@/assets/ad1.png";
import ad2 from "@/assets/ad2.png";
import ad3 from "@/assets/ad3.png";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const Carousel = () => {
  const container = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onPrev = useCallback(() => {
    if (index == 0) {
      container.current?.scrollBy({
        left: 3 * container.current.clientWidth,
        behavior: "smooth",
      });
      return;
    }
    container.current?.scrollBy({
      left: -1 * container.current.clientWidth,
      behavior: "smooth",
    });
  }, [index]);

  useEffect(() => {
    const interval = setTimeout(() => {
      onNext();
    }, 2000);
  }, [index]);

  const onNext = useCallback(() => {
    if (index == 2) {
      container.current?.scrollBy({
        left: -3 * container.current.clientWidth,
        behavior: "smooth",
      });
      return;
    }
    container.current?.scrollBy({
      left: container.current.clientWidth,
      behavior: "smooth",
    });
  }, [index]);

  const handleScroll = () => {
    const element = container.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const maxScrollLeft = scrollWidth - clientWidth;
      const progress = Math.round(
        ((scrollLeft / maxScrollLeft) * 100 * 2) / 100
      );
      if (progress != index) {
        setIndex(progress);
      }
    }
  };

  return (
    <div className="overflow-hidden relative h-[18vh] sm:h-[30vh] max-w-4xl w-full sm:rounded-3xl rounded-2xl">
      <div
        ref={container}
        onScroll={handleScroll}
        className="flex overflow-scroll h-full snap-mandatory snap-x no-scrollbar"
      >
        <div className="grow shrink-0 relative -z-10 h-full flex w-full snap-start">
          <Image src={ad1} fill alt="" className="-z-10 object-cover" />
        </div>
        <div className="grow shrink-0 relative -z-10 h-full flex w-full snap-start">
          <Image src={ad2} fill alt="" className="-z-10 object-cover" />
        </div>
        <div className="grow shrink-0 relative -z-10 h-full flex w-full snap-start">
          <Image src={ad3} fill alt="" className="-z-10 object-cover" />
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 -z-10">
        {[1, 2, 3].map((_, i) => (
          <div
            className={`rounded-full h-1.5 ${i == index ? "w-4" : "w-1.5"} ${index == 1 ? "bg-primary" : "bg-accent"
              }`}
            key={i}
          ></div>
        ))}
      </div>
    </div>
  );
};

// <div className='flex-1 relative h-full flex snap-start'>
//   <ContentLoader className='h-full w-full'>
//     <rect x='0' y='0' rx='12' ry='12' width='100%' height='100%' />
//   </ContentLoader>
// </div>

export default Carousel;

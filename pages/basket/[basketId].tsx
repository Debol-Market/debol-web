import Btn from "@/components/Btn";
import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { getBasket } from "@/services/database";
import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

type props = {
  basket?: Basket;
  imageUrl?: string;
  basketId?: string;
};

const Page = ({ basket, basketId, imageUrl }: props) => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const { cart, addToCart, removeFromCart, setCartItemQty } = useApp();

  if (!basketId || !basket) return <p>error</p>;

  return (
    <>
      <Navbar />
      <div className="h-[80vh] sm:p-8">
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className="md:rounded-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt=""
              className="md:h-full object-cover md:max-w-[40vw]"
            />
          </div>
          <div className="grow px-3 flex flex-col items-stretch">
            <h1 className="text-3xl font-bold ">{basket.name}</h1>
            <p className="text-xl my-4 md:max-w-md">
              {basket.description ||
                "This particular basket has everything to cater  8-10 people including Traditional beverages and bread"}
            </p>
            <div className="font-bold text-lg my-2">Basket Sizes</div>
            <div className="bg-mint rounded-xl px-3 md:max-w-sm my-4 mb-8 pb-3 flex flex-col">
              <div className="flex justify-center gap-2 mb-4">
                {basket.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSizeIndex(index)}
                    className={`rounded-full px-4 py-2 text-lg ${
                      sizeIndex === index
                        ? "bg-primary text-white"
                        : "text-black hover:bg-primary/30"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="w-1/2">
                  {basket.sizes[sizeIndex].items.map((item, index) => {
                    return (
                      <div key={index} className="flex justify-between">
                        <div>- {item.name}</div>
                        <div>
                          {item.quantity}
                          {item.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="my-auto font-bold text-2xl text-primary">
                  ${basket.sizes[sizeIndex].price / 100}
                </div>
              </div>
            </div>
            <Btn
              onClick={() =>
                addToCart(basket.sizes[sizeIndex], 1, basketId, basket)
              }
              label={"Add To Cart"}
              className="w-full md:max-w-sm mt-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const basket = await getBasket(params?.basketId as string);
  let imageUrl;
  if (basket) imageUrl = await getUrl(basket.image);

  return {
    props: { basket, basketId: basket?.id, imageUrl }, // will be passed to the page component as props
  };
}

export default Page;

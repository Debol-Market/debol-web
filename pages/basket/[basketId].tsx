import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { getBasket } from "@/services/database";
import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { FC, useState } from "react";

type props = {
  basket?: Basket;
  imageUrl?: string;
  basketId?: string;
};

const Page = ({ basket, basketId, imageUrl }: props) => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const { cart, addToCart, removeFromCart, setCartItemQty } = useApp();

  if (!basketId || !basket)
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex w-full grow items-center justify-center text-xl sm:text-2xl">
          Sorry, Basket not found
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>{basket.name} - Debol Market</title>
        <meta
          name="description"
          content={`${basket.name} - ${basket.description}`}
        />
      </Head>
      <Navbar />
      <div className="p-4 sm:p-8 mb-10">
        <div className="flex flex-col landscape:flex-row gap-6 md:gap-10 h-full ">
          <div className="rounded-2xl overflow-hidden landscape:h-[80vh] max-h-[600px] landscape:max-w-[40vw] shrink-0">
            <img
              src={imageUrl}
              alt=""
              className="object-cover h-full w-full"
            />
          </div>
          <div className="grow px-3 flex flex-col items-stretch landscape:max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold ">{basket.name}</h1>
            <p className="text-lg sm:text-xl my-4">
              {basket.description ||
                "This particular basket has everything to cater 8-10 people including Traditional beverages and bread"}
            </p>
            <div className="font-bold text-lg my-2">Basket Sizes</div>
            <div className="bg-mint rounded-xl md:max-w-md my-4 mb-8 pb-5 flex flex-col items-center">
              <div className="flex gap-2 mb-4 overflow-auto no-scrollbar px-8 shrink-0">
                {basket.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSizeIndex(index)}
                    className={`rounded-full px-4 py-2 text-lg shrink-0 ${
                      sizeIndex === index
                        ? "bg-primary text-white"
                        : "text-black hover:bg-primary/30"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              <div className="justify-between px-6 w-full">
                <div className="flex gap-3 mb-2 justify-between">
                  <div className="text-lg font-semibold text-neutral-600">
                    Price:
                  </div>
                  <div className="my-auto font-bold text-2xl text-primary">
                    ${basket.sizes[sizeIndex].price / 100}
                  </div>
                </div>

                <div className="">
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
              </div>
            </div>
            <AddToCartBtn
              onClick={() =>
                addToCart(basket.sizes[sizeIndex], 1, basketId, basket)
              }
              isInCart={
                cart.find(
                  (item) =>
                    item.basketId == basketId &&
                    item.item.id == basket.sizes[sizeIndex].id,
                ) != undefined
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

const AddToCartBtn: FC<{ onClick: VoidFunction; isInCart: boolean }> = ({
  onClick,
  isInCart,
}) => {
  if (isInCart)
    return (
      <div className="max-w-md rounded-xl text-white font-semibold disabled:opacity-75 shadow-md disabled:shadow-none text-xl px-6 py-2 flex items-center justify-center bg-primary">
        Added
      </div>
    );
  return (
    <button
      onClick={onClick}
      className={`rounded-xl text-white font-semibold disabled:opacity-75 shadow-md disabled:shadow-none text-xl px-6 py-2 flex items-center justify-center hover:brightness-110 ${
        isInCart ? "bg-primary" : "bg-gradient"
      }`}
      disabled={isInCart}
    >
      Add To Cart
    </button>
  );
};

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  let basket;
  try {
    basket = await getBasket(params?.basketId as string);
  } catch (error) {
    console.log(error);
  }
  console.log(basket, params);
  if (!basket) return { props: { basket: null, basketId: null, imageUrl: "" } };
  let imageUrl;

  if (basket) imageUrl = await getUrl(basket.image);

  return {
    props: { basket, basketId: basket?.id, imageUrl }, // will be passed to the page component as props
  };
}

export default Page;

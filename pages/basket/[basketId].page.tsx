import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { getBasket } from "@/services/database";
import { getUrl } from "@/services/storage";
import convertCurrency from "@/utils/convertCurrency";
import { Basket } from "@/utils/types";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { FC, useState } from "react";
import { Check } from "lucide-react";

type props = {
  basket?: Basket;
  imageUrl?: string;
  basketId?: string;
};

const Page = ({ basket, basketId, imageUrl }: props) => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const { basketCart, addToBasketCart, currencyMultiplier, currency } =
    useApp();

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
            <img src={imageUrl} alt="" className="object-cover h-full w-full" />
          </div>
          <div className="grow px-3 flex flex-col items-stretch landscape:max-w-md">
            <h1 className="text-3xl  font-semibold mt-6  mb-1">{basket.name}</h1>
            <p className="text-sm sm:text-sm leading-none whitespace-normal text-neutral-700 my-4 text-left">{basket.description}</p>
            <div className="font-medium text-base my-2">Basket Sizes</div>
            <div className="rounded-xl md:max-w-md my-1 mb-8 pb-5 flex flex-col items-center">
              {basket.sizes.length > 1? (
                <div className="flex gap-2 mb-4 overflow-auto no-scrollbar w-full  shrink-0">
                  {basket.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSizeIndex(index)}
                      className={`rounded-md px-4 py-1 font-medium text-sm bg-neutral-100  shrink-0 ${
                        sizeIndex === index
                          ? "text-accent border-2 spacing-3 border-accent"
                          : "text-neutral-500  hover:border-accent hover:text-accent hover:border-2  hover:transition-colors hover:ease-in hover:delay-50"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-4"></div>
              )}
              <div className="justify-between px-6 py-3 w-full bg-mint/60 border-green-100 border-2 rounded">
                
                <div className="text-sm">
                  {basket.sizes[sizeIndex].items.map((item, index) => {
                    return (
                      <div key={index} className="flex justify-between">
                        <div>{item.name}</div>
                        <div>
                          {item.quantity}
                          {item.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 my-2 justify-between">
                  <div className="text-base font-medium text-neutral-700">
                    Price:
                  </div>
                  <div className="my-auto font-bold text-xl text-accent font-mono">
                    {convertCurrency(
                      basket.sizes[sizeIndex].price,
                      currencyMultiplier,
                      currency
                    )}
                  </div>
                </div>

              </div>
            </div>
            <AddToCartBtn
              onClick={() =>
                addToBasketCart(
                  {
                    sizeId: basket.sizes[sizeIndex].id,
                    qty: 1,
                    basketId,
                  },
                  basket
                )
              }
              isInCart={
                basketCart.find(
                  (item) =>
                    item.basketId == basketId &&
                    item.sizeId == basket.sizes[sizeIndex].id
                ) != undefined
              }
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const AddToCartBtn: FC<{ onClick: VoidFunction; isInCart: boolean }> = ({
  onClick,
  isInCart,
}) => {
  if (isInCart)
    return (
      <div className="max-w-md rounded-md text-white text-sm font-medium disabled:opacity-75 shadow-md disabled:shadow-none sm:text-base px-4 py-2 flex items-center justify-center bg-orange-500 transition-transform delay-300">
       <Check className="h-4 w-4 mr-2" />
        Added to Cart!
      </div>
    );
  return (
    <button
      onClick={onClick}
      className={`rounded-md text-white font-medium  text-sm disabled:opacity-75 shadow-md disabled:shadow-none sm:text-base px-4 py-2 flex items-center justify-center hover:brightness-110 ${
        isInCart ? "bg-orange-500" : "bg-orange-500"
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
  console.log("fetching basket", params?.basketId);
  try {
    basket = await getBasket(params?.basketId as string);
  } catch (error) {
    console.log(error);
  }
  if (!basket) return { props: { basket: null, basketId: null, imageUrl: "" } };
  let imageUrl;

  if (basket) imageUrl = await getUrl(basket.image);

  return {
    props: { basket, basketId: basket?.id, imageUrl }, // will be passed to the page component as props
  };
}

export default Page;

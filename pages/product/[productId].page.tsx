import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import firebaseAdmin from "@/services/firebase-admin";
import { getUrl } from "@/services/storage";
import convertCurrency from "@/utils/convertCurrency";
import { Product } from "@/utils/types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { FC, useState } from "react";
import { Check } from "lucide-react";

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  if (!params?.productId)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const productRef = await firebaseAdmin
    .firestore()
    .collection("products")
    .doc(params?.productId as string)
    .get();

  if (!productRef.exists)
    return {
      props: {
        product: null,
      },
    };

  const product: Product = { ...(productRef.data() as any), id: productRef.id };

  const imageUrl = product.image ? await getUrl(product.image) : "";

  return {
    props: { product, imageUrl },
  };
};

const Page = ({
  product,
  imageUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const { productCart, addToProductCart, currencyMultiplier, currency } =
    useApp();

  if (!product)
    
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex w-full grow items-center justify-center text-xl sm:text-2xl">
          Sorry, Product not found
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>{product.name} - Debol Market</title>
        <meta
          name="description"
          content={`${product.name} - ${product.description}`}
        />
      </Head>
      <Navbar />
      <div className="p-4 sm:p-8 mb-10">
        <div className="flex flex-col landscape:flex-row gap-6 md:gap-10 h-full ">
          <div className="rounded-2xl overflow-hidden landscape:h-[80vh] max-h-[600px] landscape:max-w-[40vw] shrink-0">
            <img src={imageUrl} alt="" className="object-cover h-full w-full" />
          </div>
          <div className="grow px-3 flex flex-col items-stretch landscape:max-w-md">
            <h1 className="text-sm sm:text-sm leading-none whitespace-normal text-neutral-700 my-4 text-left ">{product.name}</h1>
            <p className="text-base sm:text-base my-4">{product.description}</p>
            <h3 className="text-xl font-mono font-bold">
              {convertCurrency(product.price, currencyMultiplier, currency)}
            </h3>
            <div className="mb-auto mt-4"></div>
            <AddToCartBtn
              onClick={() =>
                addToProductCart(
                  {
                    qty: 1,
                    productId: product.id,
                  },
                  product,
                )
              }
              isInCart={
                !!productCart.find((item) => item.productId == product.id)
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

export default Page;

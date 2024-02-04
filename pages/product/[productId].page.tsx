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
            <h1 className="text-2xl sm:text-3xl font-bold ">{product.name}</h1>
            <p className="text-lg sm:text-xl my-4">{product.description}</p>
            <h3 className="text-xl font-medium">
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

export default Page;

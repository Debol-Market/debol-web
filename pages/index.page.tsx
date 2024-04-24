import img from "@/assets/new_banner.png";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import firebaseAdmin from "@/services/firebase-admin";
import { getUrl } from "@/services/storage";
import { Basket, Product } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import BasketCard from "../components/BasketCard";

export const getServerSideProps = async () => {
  const basketsRef = await firebaseAdmin.database().ref("baskets").get();
  const baskets = Object.entries(basketsRef.val() ?? {}).map(
    ([basketId, basket]) => ({
      id: basketId,
      ...(basket as Basket),
    }),
  );

  const productsRef = await firebaseAdmin
    .firestore()
    .collection("products")
    .get();

  const products = productsRef.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as Product,
  );

  return {
    props: { baskets, products },
  };
};

const Page = ({
  baskets,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Debol Market</title>
        <meta name="description" content="Show your love to your family." />
      </Head>
      <Navbar />
      <div className="flex p-3 sm:p-5  pb-4 justify-center">
        <div className="overflow-hidden relative aspect-[5/2] max-w-7xl w-full sm:rounded-3xl rounded-2xl">
          <div className="flex overflow-scroll h-full snap-mandatory snap-x no-scrollbar">
            <div className="grow shrink-0 relative -z-10 h-full flex w-full snap-start">
              <Image src={img} fill alt="" className="-z-10 object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl text-gray-800 font-medium mx-6">Packages</h2>
          <div className="w-full ">
            <div className="px-4 sm:px-10 sm:gap-6 py-4 md:no-scrollbar flex gap-4 shrink-0 overflow-auto snap-mandatory snap-x  ">
              {baskets.map((item) => (
                <BasketCard basket={item} id={item.id} key={item.id} />
              ))}
            </div>
          </div>

          <h2 className="text-2xl text-gray-800 font-medium mx-6">Products</h2>
          <div className="grid grid-cols-2 min-[520px]:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-x-3  min-[480px]:gap-x-6 gap-y-6 sm:gap-y-10 py-4 px-5 sm:px-10 no-scrollbar">
            {products.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ImgSkeleton = () => (
  <Skeleton className="rounded-lg overflow-hidden w-full aspect-square" />
);

const groupBasetsByCatagory = (baskets: Basket[]) => {
  const catagories = new Map<string, Basket[]>();
  baskets.sort((a, b) => b.created_at - a.created_at);
  baskets.forEach((basket) => {
    const catagory = basket.catagory ?? "";
    if (catagories.has(catagory)) {
      catagories.get(catagory)?.push(basket);
    } else {
      catagories.set(catagory, [basket]);
    }
  });
  return catagories;
};

const ProductCard = ({ product }: { product: Product }) => {
  const { data, status } = useQuery({
    queryKey: ["getProductImage", product.id],
    queryFn: () => getUrl(product.image),
  });

  return (
    <Link href={`/product/${product.id}`} className="w-full min-w-0 h-full ">
      <div className="border shadow-lg rounded-2xl p-2 sm:px-4 sm:py-5 bg-white h-full">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-square">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <ImgSkeleton />
        )}
        <div className="flex flex-col py-1">
          <p className="font-medium md:text-lg max-w-[200px]">{product.name}</p>
          {product.description && (
            <p className="text-sm text-gray-700 truncate">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Page;

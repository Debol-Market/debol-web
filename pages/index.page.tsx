import img from "@/assets/new_banner1.png";
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
import { HomeBasketCard } from "@/components/HomeBasketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useApp from "@/services/appContext";
import convertCurrency from "@/utils/convertCurrency";

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
      <div className="overflow-hidden relative  sm:h-[480px] h-[min(480px,30vh)] p-6  w-full ">
        <div className="flex overflow-scroll h-full snap-mandatory snap-x no-scrollbar">
          <div className="grow shrink-0 relative -z-10 h-full flex w-full  snap-start">
            <Image src={img} fill alt="" className="-z-10 object-cover" />
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-12 w-full">
        <div className="max-w-screen-xl  px-4 w-full">
          <div className="mb-4 mt-6">
            <h1 className="text-xl font-semibold ">Packages</h1>
            <p className="text-muted-foreground text-sm">
              Browse our selection of curated grocery Packages
            </p>
          </div>
          <div className="grid max-[480px]:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 grid-cols-4 gap-3 shrink-0">
            {baskets.map((item) => (
              <HomeBasketCard basket={item} id={item.id} key={item.id} />
            ))}
          </div>
          <div className="mb-4 mt-6">
            <h1 className="text-xl font-semibold ">Products</h1>
          </div>
          <h1 className="text-xl font-semibold tracking-tight"></h1>
          <div className="grid max-[480px]:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 grid-cols-4 gap-3 shrink-0">
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
  <Skeleton className="rounded overflow-hidden w-full aspect-square" />
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
  const { addToProductCart, productCart, currencyMultiplier, currency } =
    useApp(); // Add productCart here
  const { data, status } = useQuery({
    queryKey: ["getProductImage", product.id],
    queryFn: () => getUrl(product.image),
  });

  const discount = 0;

  const price = product.price;

  // Check if the product is already in the cart
  const isInCart = !!productCart.find((item) => item.productId === product.id);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col relative overflow-hidden w-full rounded-lg shadow border bg-background"
    >
      {!!discount && (
        <Badge className="absolute top-2 right-2 z-10 text-accent bg-white shadow-sm ">
          {discount}% OFF
        </Badge>
      )}
      <div className="aspect-[5/4] overflow-hidden">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-[5/4]">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <Skeleton className="rounded-lg overflow-hidden w-full aspect-square" />
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm mb-6 text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex  items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-accent ">
              {convertCurrency(price, currencyMultiplier, currency)}
            </span>
          </div>
          {/* Update Button based on isInCart */}
          <Button
            className={`text-sm ${isInCart ? "bg-index cursor-default" : "bg-orange-500 hover:bg-orange-500 hover:opacity-80 disabled:opacity-75 transition-all"}`}
            onClick={(e) => {
              if (isInCart) {
                e.preventDefault(); // Prevent navigation if already in cart
                return;
              }
              e.preventDefault();
              return addToProductCart(
                {
                  qty: 1,
                  productId: product.id,
                },
                product,
              );
            }}
            size="sm"
            disabled={isInCart} // Disable button if in cart
          >
            {isInCart ? "Added" : "Add to Cart"}{" "}
            {/* Change text based on isInCart */}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default Page;

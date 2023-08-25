import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { getBasket } from "@/services/database";
import { Basket } from "@/utils/types";
import { GetServerSidePropsContext } from "next";

type props = {
  basket?: Basket;
  basketId?: string;
};

const Page = ({ basket, basketId }: props) => {
  const { cart, addToCart, removeFromCart, setCartItemQty } = useApp();

  if (!basketId || !basket) return <p>error</p>;

  return (
    <>
      <Navbar />
      {basket.name}
      {basketId}
      {basket.sizes.map((size) => (
        <div key={size.id}>
          <button onClick={() => addToCart(size, 1, basketId, basket)}>
            Add To Cart
          </button>
        </div>
      ))}
    </>
  );
};

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const basket = await getBasket(params?.basketId as string);

  return {
    props: { basket, basketId: basket?.id }, // will be passed to the page component as props
  };
}

export default Page;

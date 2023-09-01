import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const { orderId } = router.query;
 
  return (
    <>
      <Navbar />
      <div className="my-8 text-lg flex items-center justify-center">
        Your Order was a Success
      </div>
    </>
  );
};

// export async function getServerSideProps({
//     params,
//   }: GetServerSidePropsContext) {
//     // const basket = await getBasket(params?.basketId as string);

//     return {
//       props: {  }, // will be passed to the page component as props
//     };
//   }
export default Page;

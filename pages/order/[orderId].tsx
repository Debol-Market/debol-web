import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const { orderId } = router.query;

  return <div>{orderId}</div>;
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

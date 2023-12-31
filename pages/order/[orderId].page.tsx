import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { Order } from "@/utils/types";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Order & { orderCode: string }>();

  if (!user) router.push("/");

  useEffect(() => {
    if (!orderId || !user) return;
    setIsLoading(true);
    user.getIdToken().then((token) => {
      fetch(`/api/getOrder?orderId=${orderId}`, {
        headers: { authorization: `bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setIsLoading(false);
        });
    });
  }, [orderId, user]);

  return (
    <>
      <Navbar />
      <div className="my-8 text-lg flex flex-col gap-3 md:flex-row items-center justify-center">
        {isLoading || !data ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error.toString()}</div>
        ) : (
          <>
            <QRCodeCanvas value={data.orderCode as string} size={270} />
            <div className="text-center px-10">
              <div className="font-bold text-xl">
                Your Order was a Success!!!
              </div>
              <div className=""></div>
              <p>Show this Qr Code to the person delivering the order only.</p>
            </div>
          </>
        )}
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

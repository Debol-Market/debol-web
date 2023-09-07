import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useApp from "@/services/appContext";
import { Order } from "@/utils/types";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

const Page = () => {
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<(Order & { id: string })[]>([]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    user.getIdToken().then((token) => {
      fetch(`/api/get-orders`, {
        headers: { authorization: `bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.orders);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setIsLoading(false);
        });
    });
  }, [user]);

  function isEmpty() {
    const orderBool = data.map((item) => item.status !== "pending" && item.status !== "completed");
    return orderBool;
  }

  return (
    <>
      <Navbar />
      {isEmpty ? <div className="flex justify-center items-center  h-screen">
        <p className="text-primary font-semibold text-3xl  my-4 text-center">You have not made any orders</p>
      </div> :
        <div className="h-screen">
          <div className="flex flex-col gap-3 items-center ">
            <h2 className="text-2xl font-semibold text-slate-500">Pending Orders</h2>
            {!isLoading && data.length == 0 ? <p>You Have No Pending Orders</p> : data
              .filter((item) => item.status == "pending")
              .map((item) => (
                <OrderCard key={item.id} order={item} />
              ))}
          </div>
          <div className="flex flex-col gap-3 items-center">
            <h2 className="text-2xl font-semibold text-slate-500">Completed Orders</h2>
            {data
              .filter((item) => item.status == "completed")
              .map((item) => (
                <OrderCard key={item.id} order={item} />
              ))}
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

const OrderCard: FC<{ order: Order & { id: string } }> = ({ order }) => {
  return (
    <Link href={`/order/${order.id}`}>
      <div className="flex gap-6 shadow rounded bg-white overflow-hidden w-full max-w-sm px-3 py-2">
        <p className="text-lg">{order.name}</p>
        <p className="text-slate-500">{order.status}</p>
      </div>
    </Link>
  );
};

export default Page;

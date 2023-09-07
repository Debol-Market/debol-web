import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import useApp from "@/services/appContext";
import { Order } from "@/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const Page = () => {
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<(Order & { id: string })[]>([]);
  const router = useRouter();

  if (!user) router.push("/");

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
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, [user]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Spinner className="h-20 w-20 text-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-primary font-semibold text-3xl  my-4 text-center">
            {error.toString()}
          </p>
        </div>
      </>
    );
  }

  if (data.length == 0) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-primary font-semibold text-3xl  my-4 text-center">
            You have not made any orders
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <div className="flex flex-col gap-3 px-7 py-6">
          <h2 className="text-2xl font-semibold text-slate-700 flex flex-col">
            Pending Orders
          </h2>
          {!isLoading && data.length == 0 ? (
            <p>You Have No Pending Orders</p>
          ) : (
            data
              .filter((item) => item.status == "pending")
              .map((item) => <OrderCard key={item.id} order={item} />)
          )}
        </div>
        <div className="flex flex-col gap-3 px-7 py-2">
          <h2 className="text-2xl font-semibold text-slate-700">
            Completed Orders
          </h2>
          {data
            .filter((item) => item.status == "completed")
            .map((item) => (
              <OrderCard key={item.id} order={item} />
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

const OrderCard: FC<{ order: Order & { id: string } }> = ({ order }) => {
  return (
    <Link href={`/order/${order.id}`} className="max-w-xl mx-auto w-full">
      <div className="flex flex-col gap-3 shadow rounded-lg bg-slate-100 overflow-hidden w-full px-4 py-4">
        <div className="flex gap-2">
          <p className="text-lg font-bold">For:</p>
          <p className="text-lg">{order.name}</p>
          <p className="text-slate-500 ml-auto">{order.status}</p>
        </div>
        <div>
          {order.items.map((item) => (
            <div key={item.sizeId} className="flex gap-2 justify-between items-center">
              <div className="flex max-w-[160px] flex-wrap">
                <p className="">{item.basket.name}</p>
                <p className="ml-1 text-primary font-bold">
                  {item.basket.sizes.find((s) => s.id == item.sizeId)?.name}
                </p>
              </div>
              <p className="text-slate-900 text-xl font-bold">X {item.qty}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default Page;

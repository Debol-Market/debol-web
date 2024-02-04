import { rtdb } from "@/services/firebase";
import { timeStampToRelativeTime } from "@/utils/dateDiff";
import { Order } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import Link from "next/link";
import { FC, useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import OrderModal from "./OrdersTable/OrderModal";

const Page = () => {
  useAdmin();
  const [openOrderBasketModal, setOpenOrderBasketModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const { data } = useQuery({
    queryFn: async () => {
      const snap = await get(ref(rtdb, "orders/"));
      return Object.entries(snap.val())
        .map(
          ([orderId, order]) =>
            ({
              id: orderId,
              ...(order as any),
            }) as Order,
        )
        .filter((order) => order.status == "pending");
    },
  });

  return (
    <div className="h-full min-h-[100vh] bg-slate-200 md:py-2 md:px-10">
      <div className="flex p-2 items-center gap-3">
        <Link href="/admin">
          <MdOutlineArrowBack size={30} />
        </Link>
        <h1 className="text-3xl font-bold text-black m-2">Orders</h1>
      </div>
      <div className="relative overflow-auto w-full shadow-md sm:rounded-lg">
        <table className="table-auto w-full text-sm max-h-[80vh]  min-w-[720px] text-left text-gray-500 dark:text-gray-300">
          <thead className="text-2xs text-slate-600 uppercase bg-gray-400 dark:bg-gray-800/90 dark:text-gray-400">
            <tr>
              <th scope="col" className="pl-3 py-3">
                Name
              </th>
              <th scope="col" className="pl-3 py-3">
                Status
              </th>
              <th scope="col" className="pl-3 py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="">
            {data?.map((item, i) => (
              <TableRow
                key={i}
                order={item}
                setOpenModal={() => {
                  setOpenOrderBasketModal(true);
                  setSelectedIndex(i);
                }}
              />
            ))}
          </tbody>
        </table>
        {data && openOrderBasketModal && selectedIndex !== undefined && (
          <OrderModal
            order={data[selectedIndex]}
            setOpenModal={() => setOpenOrderBasketModal(false)}
            orderId={data[selectedIndex].id}
          />
        )}
      </div>
    </div>
  );
};

const TableRow: FC<{ order: Order; setOpenModal: () => void }> = ({
  order,
  setOpenModal,
}) => {
  return (
    <tr
      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={setOpenModal}
    >
      <td className="pl-3 py-2">{order.name}</td>
      <td className="pl-2 py-2">{order.status}</td>
      <td className="pl-2 py-2">{timeStampToRelativeTime(order.timestamp)}</td>
    </tr>
  );
};

export default Page;

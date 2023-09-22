import { rtdb } from "@/services/firebase";
import { timeStampToRelativeTime } from "@/utils/dateDiff";
import { Order } from "@/utils/types";
import { onValue, ref } from "firebase/database";
import { FC, useEffect, useState } from "react";
import OrderModal from "./OrderModal";

const OrdersTable = () => {
  const [openOrderBasketModal, setOpenOrderBasketModal] = useState(false);
  const [data, setData] = useState<(Order & { id: string })[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  useEffect(() => {
    const sub = onValue(ref(rtdb, "orders/"), (snap) => {
      setData(
        Object.entries(snap.val())
          .map(([orderId, order]) => ({
            id: orderId,
            ...(order as Order),
          }))
          .filter((order) => order.status == "pending")
      );
    });
    return () => sub();
  }, []);

  return (
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
          {data.map((item, i) => (
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
      {openOrderBasketModal &&
        selectedIndex !== undefined &&
        selectedIndex < data.length && (
          <OrderModal
            order={data[selectedIndex]}
            setOpenModal={() => setOpenOrderBasketModal(false)}
            orderId={data[selectedIndex].id}
          />
        )}
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

export default OrdersTable;

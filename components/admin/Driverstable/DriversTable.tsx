import { rtdb } from "@/services/firebase";
import { Driver } from "@/utils/types";
import { onValue, ref } from "firebase/database";
import { FC, useEffect, useState } from "react";
import DriverModal from "./DriverModal";

const DriversTable = () => {

  const [driver, setDriver] = useState<Driver[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [driverModal, setDriverModal] = useState(false);

  useEffect(() => {
    const sub = onValue(ref(rtdb, 'driver/'), (snap) => {
      setDriver(
        Object.entries(snap.val())
          .map(([driverId, driver]) => ({
            id: driverId,
            ...(driver as Driver),
          }))
      )
    })
    return sub();
  }, []);

  return (<div className="relative overflow-auto w-full shadow-md sm:rounded-lg">
    <table className="table-auto w-full text-sm min-w-[720px] text-left text-gray-500 dark:text-gray-300">
      <thead className="text-2xs text-slate-600 uppercase bg-gray-400 dark:bg-gray-800/90 dark:text-gray-400">
        <tr>

          <th scope="col" className="pl-3 py-3">
            Name
          </th>
          <th scope="col" className="pl-3 py-3">
            email
          </th>
          <th scope="col" className="pl-3 py-3">
            password
          </th>
          <th scope="col" className="pl-3 py-3">
            Driver info.
          </th>
        </tr>
      </thead>
      <tbody>
        {driver.map((item, i) => (
          <TableRow
            key={i}
            driver={item}
            setOpenModal={() => {
              setSelectedIndex(i);
              setDriverModal(true);
            }}
          />
        ))}
      </tbody>
    </table>
    {driverModal && (
      <DriverModal
        setOpenModal={() => setDriverModal(false)} />
    )}
  </div>);
}

const TableRow: FC<{ driver: Driver, setOpenModal: () => void }> = ({
  driver,
  setOpenModal
}) => {
  return (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="pl-3 py-2">{driver.name}</td>
      <td className="pl-2 py-2">{driver.email}</td>
      <td className="pl-2 py-2">{driver.password}</td>
      <td className="pl-2 py-2">
        <button
          className="bg-emerald-500 text-white rounded-lg shadow px-2 py-2"
          onClick={setOpenModal}
        >
          Delivery
        </button>
      </td>
    </tr>
  );
};

export default DriversTable;
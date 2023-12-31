import { rtdb } from "@/services/firebase";
import { Contacts } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import { onValue, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";

const Contacts = () => {
  useAdmin();
  const [contactData, setContactData] = useState<Contacts[]>([]);

  useEffect(() => {
    const sub = onValue(ref(rtdb, "contacts/"), (snap) => {
      setContactData(
        Object.entries(snap.val()).map(([contactId, contact]) => ({
          id: contactId,
          ...(contact as Contacts),
        })),
      );
    });
    return sub();
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 p-10">
      <Link href="/admin">
        <div className="flex justify-start">
          <MdOutlineArrowBack size={30} />
        </div>
      </Link>
      <h1 className="text-4xl font-bold text-black m-5">Contacts</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-2xs text-slate-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="flex justify-between">
              <th scope="col" className="min-w-[20%] px-6 py-3">
                Name
              </th>
              <th scope="col" className="min-w-[20%] px-6 py-3">
                Email
              </th>
              <th scope="col" className="min-w-[60%] px-6 py-3">
                Message
              </th>
            </tr>
          </thead>
          <tbody>
            {contactData !== undefined &&
              contactData.map((item, i) => (
                <tr
                  key={i}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4  py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.email}</td>
                  <td className="px-4 py-4">{item.message}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;

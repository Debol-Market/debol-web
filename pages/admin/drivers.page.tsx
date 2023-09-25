import DriversTable from "@/components/admin/Driverstable/DriversTable";
import useAdmin from "@/utils/useAdmin";
import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";

const Page = () => {
  useAdmin();

  return (
    <div className="h-full bg-slate-200 md:p-10">
      <div className="flex p-2 pt-3 mb-3 items-center gap-3">
        <Link href="/admin">
          <MdOutlineArrowBack size={30} />
        </Link>
        <h1 className="text-4xl font-bold text-black m-5">Drivers</h1>
      </div>
      <DriversTable />
    </div>
  );
};

export default Page;

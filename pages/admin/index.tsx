import Navbar from "@/components/admin/Navbar";
import useAdmin from "@/utils/useAdmin";
import Link from "next/link";

const Page = () => {
  useAdmin();

  return (
    <div className="min-h-screen">
      <Navbar name="Dashboard" />
      <div className="flex h-full">
        <div className="p-10 grow h-full flex flex-col items-center gap-5">
          <Link
            href="/admin/orders"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Orders
          </Link>
          <Link
            href="/admin/baskets"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Baskets
          </Link>
          <Link
            href="/admin/products"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Products
          </Link>
          <Link
            href="/admin/contacts"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Contacts
          </Link>
          <Link
            href="/admin/drivers"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Drivers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;

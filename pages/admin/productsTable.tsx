import ProductsTable from "@/components/admin/ProductsTable";
import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";

const Page = () => {

  return (<div className="h-full min-h-[100vh] bg-slate-200 md:py-2 md:px-10">
    <div className="flex p-2 items-center gap-3">
      <Link href="/admin/products">
        <MdOutlineArrowBack size={30} />
      </Link>
      <h1 className="text-3xl font-bold text-black m-2">Products</h1>
    </div>
    <ProductsTable />
  </div>);
}

export default Page;
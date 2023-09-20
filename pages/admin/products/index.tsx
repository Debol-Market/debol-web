import Navbar from "@/components/admin/Navbar";
import ProductOverviewCard from "@/components/admin/ProductOverviewCard/ProductOverView";
import useAdmin from "@/utils/useAdmin";

function Page() {
  useAdmin();

  return (<div className="min-h-screen">
    <Navbar name="Dashboard" />
    <div className="flex h-full">
      <div className="md:p-10 py-8 px-4 grow h-full">
        <ProductOverviewCard />
      </div>
    </div>
  </div>);
}

export default Page;
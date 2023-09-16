import BasketsOverviewCard from "@/components/admin/BasketsOverviewCard";
import Navbar from "@/components/admin/Navbar";
import useAdmin from "@/utils/useAdmin";

const Page = () => {
  useAdmin();

  return (
    <div className="min-h-screen">
      <Navbar name="Dashboard" />
      <div className="flex h-full">
        <div className="md:p-10 py-8 px-4 grow h-full">
          <BasketsOverviewCard />
        </div>
      </div>
    </div>
  );
};

export default Page;

import Navbar from "@/components/Navbar";
import { getBaskets } from "@/services/database";
import { Basket } from "@/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [baskets, setBaskets] = useState<(Basket & { id: string })[]>([]);

  useEffect(() => {
    getBaskets().then(setBaskets);
  }, []);

  if (!baskets.length) return <></>;
  return (
    <>
      <Navbar />
      <div className="">
        {baskets.map((item) => (
          <Link href={`basket/${item.id}`} key={item.id}>
            <div className="bg-slate-200 shadow rounded-lg p-4">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Page;

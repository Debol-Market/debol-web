import BasketCard from "@/components/BasketCard";
import Navbar from "@/components/Navbar";
import { getBasketsByKeyword } from "@/services/database";
import { Basket } from "@/utils/types";
import { GetServerSideProps } from "next";
import { FC } from "react";

type props = {
  keyword: string;
  baskets: (Basket & { id: string })[];
};

const Page: FC<props> = ({ baskets, keyword }) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center w-full mt-5">
        <div className="px-4 max-w-6xl w-full min-[480px]:mx-4">
          <h2 className="text-2xl font-semibold">
            Search results for: {keyword}
          </h2>
          <div className="grid sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-x-6 gap-y-10 py-4 sm:px-4 no-scrollbar">
            {baskets.length == 0 ? (
              <p>No results were found</p>
            ) : (
              baskets.map((item) => (
                <BasketCard basket={item} key={item.id} id={item.id} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const keyword = context.query.q as string | undefined;
  if (!keyword)
    return {
      props: {
        keyword,
        baskets: [],
      }, // will be passed to the page component as props
    };

  const baskets = await getBasketsByKeyword(keyword.toLowerCase().split(" "));

  return {
    props: { baskets, keyword }, // will be passed to the page component as props
  };
};

export default Page;

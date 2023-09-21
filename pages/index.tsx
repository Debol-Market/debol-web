import Carousel from "@/components/Carousel";
import CatagoryRow from "@/components/CatagoryRow";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getBaskets } from "@/services/database";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import ContentLoader from "react-content-loader";
import "swiper/css";

const Page = () => {
  const { data, status } = useQuery({
    queryKey: ["getBaskets"],
    queryFn: getBaskets,
  });

  return (
    <>
      <Head>
        <title>Debol Market</title>
        <meta name="description" content="Show your love to your family." />
      </Head>
      <Navbar />
      <div className="flex gap-8 sm:p-8 p-5 sm:pb-8 pb-4 justify-center">
        <Carousel />
      </div>
      <div className="flex justify-center w-full">
        <div className="px-4 max-w-5xl w-full min-[480px]:mx-4">
          <h2 className="text-2xl font-semibold">Baskets</h2>
          <div className="gap-6 w-full p-4">
            {status == "success" ? (
              Array.from(groupBasetsByCatagory(data ?? []).entries()).map(
                ([cat, bask]) => (
                  <CatagoryRow name={cat} baskets={bask as any} key={cat} />
                )
              )
            ) : (
              <div className="">
                <ContentLoader
                  viewBox="0 0 200 50"
                  className="h-10 rounded-2xl"
                >
                  <rect x="0" y="0" rx="3" ry="3" height={50} width={200} />
                </ContentLoader>
                <div
                  className="grid gap-6 w-full p-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  {[1, 2, 3, 4].map((item) => (
                    <ContentLoader
                      viewBox="0 0 200 300"
                      className="w-full h-full rounded-2xl"
                      key={item}
                    >
                      <rect
                        x="0"
                        y="0"
                        rx="3"
                        ry="3"
                        height={300}
                        width={200}
                      />
                    </ContentLoader>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const groupBasetsByCatagory = (baskets: Basket[]) => {
  const catagories = new Map<string, Basket[]>();
  baskets.sort((a, b) => b.created_at - a.created_at);
  baskets.forEach((basket) => {
    const catagory = basket.catagory;
    if (catagories.has(catagory)) {
      catagories.get(catagory)?.push(basket);
    } else {
      catagories.set(catagory, [basket]);
    }
  });
  return catagories;
};

export default Page;

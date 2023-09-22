import { rtdb } from "@/services/firebase";
import { Basket } from "@/utils/types";
import { onValue, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import BasketModal from "../BasketModal";
import CatagoryCreateModal from "../CatagoryCreateModal";
import BasketCard from "./BasketCard";

const BasketsOverviewCard = () => {
  const [baskets, setBaskets] = useState<(Basket & { id: string })[]>([]);
  const [openBasketModal, setOpenBasketModal] = useState(false);
  const [openCatagoryModal, setOpenCatagoryModal] = useState(false);

  useEffect(() => {
    const sub = onValue(ref(rtdb, "baskets/"), (snap) => {
      if (snap.val() && snap.exists())
        setBaskets(
          Object.entries(snap.val()).map(([basketId, basket]) => ({
            id: basketId,
            ...(basket as Basket),
          }))
        );
    });

    return () => sub();
  }, []);

  const removeBasket = (index: number) => {
    setBaskets(baskets.filter((basket, i) => i !== index));
  };

  return (
    <div className="p-3 md:p-10 shadow-lg rounded-xl bg-slate-300 flex flex-col gap-5 justify-start">
      <Link href="/admin">
        <div className="flex justify-start my-2">
          <MdOutlineArrowBack size={30} />
        </div>
      </Link>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="bg-amber-500 text-black rounded-lg shadow px-4 py-2"
          onClick={() => setOpenCatagoryModal(true)}
        >
          Add Catagory
        </button>
        <button
          className="bg-amber-500 text-black rounded-lg shadow px-4 py-2"
          onClick={() => setOpenBasketModal(true)}
        >
          Add Basket
        </button>
      </div>
      {baskets ? (
        baskets.map((basket, i) => (
          <BasketCard
            key={basket.id}
            basket={basket}
            remove={() => removeBasket(i)}
          />
        ))
      ) : (
        <div>Loading</div>
      )}
      {openBasketModal ? (
        <BasketModal
          setOpen={setOpenBasketModal}
          onClose={() => setOpenBasketModal(false)}
        />
      ) : null}
      {openCatagoryModal && (
        <CatagoryCreateModal onClose={() => setOpenCatagoryModal(false)} />
      )}
    </div>
  );
};

export default BasketsOverviewCard;

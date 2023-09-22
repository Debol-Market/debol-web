import { rtdb } from "@/services/firebase";
import { onValue, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Product } from "../../../utils/types";
import CatagoryCreateModal from "../CatagoryCreateModal";
import ProductModal from "../ProductModals/ProductModal";
import ProductCard from "./ProductCard";

const ProductOverviewCard = () => {
  const [openCatagoryModal, setOpenCatagoryModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [products, setProducts] = useState<(Product & { id: string })[]>();

  useEffect(() => {
    const sub = onValue(ref(rtdb, "products/"), (snap) => {
      if (snap.val() && snap.exists())
        setProducts(
          Object.entries(snap.val()).map(([productId, product]) => ({
            id: productId,
            ...(product as Product),
          }))
        );
    });

    return () => sub();
  }, []);

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
          onClick={() => setOpenProductModal(true)}
        >
          Add Product
        </button>
      </div>
      {products ? (
        products.map((prod, i) => <ProductCard key={i} product={prod} />)
      ) : (
        <div>Loading</div>
      )}
      {openProductModal && (
        <ProductModal
          setOpen={setOpenProductModal}
          onClose={() => setOpenProductModal(false)}
        />
      )}
      {openCatagoryModal && (
        <CatagoryCreateModal onClose={() => setOpenCatagoryModal(false)} />
      )}
    </div>
  );
};

export default ProductOverviewCard;

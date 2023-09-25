import DeleteModal from "@/components/admin/BasketModal/DeleteModal";
import AddSizeModal from "@/components/admin/basket/AddSizeModal";
import EditBasketModal from "@/components/admin/basket/EditBasketModal";
import SizeCard from "@/components/admin/basket/SizeCard";
import { deleteBasket, getBasket, updateBasket } from "@/services/database";
import { getUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineAddCircleOutline, MdOutlineArrowBack } from "react-icons/md";

const Page = () => {
  useAdmin();
  const router = useRouter();
  const [addSize, setSizeAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState<Basket>();
  const [modalOpen, setModalOpen] = useState(false);
  const { basketId } = router.query;
  const [deleteBasketModal, setdeleteBasketModal] = useState(false);
  const [image, setimage] = useState("");

  useEffect(() => {
    if (!basketId) return;
    getBasket(basketId as string).then((val) => {
      setBasket(val);
      setLoading(false);
      if (val != undefined) getUrl(val.image).then(setimage);
    });
  }, []);

  useEffect(() => {
    if (!basket || !basketId || loading) return;
    if (basket.sizes.length == 0) {
      delBasket();
    } else updateBasket(basket, basketId as string);
  }, [basket, basketId]);

  useEffect(() => {
    if (basket) getUrl(basket.image).then(setimage);
  }, [basket?.image]);

  const delBasket = () => {
    if (!basketId) return;
    deleteBasket(basketId as string).then(() => router.push("/"));
  };

  if (!basket) return <></>;

  return (
    <div className="min-h-screen bg-slate-200 p-10 ">
      <Link href="/admin/baskets">
        <div className="flex justify-start my-2">
          <MdOutlineArrowBack size={30} />
        </div>
      </Link>
      <div className="p-10 shadow-lg rounded-xl bg-white flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-10">
            <div className="border shadow-xl overflow-hidden  aspect-square max-h-[240px] rounded-2xl">
              <img src={image} alt="" className="object-cover h-full w-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{basket.name}</h1>
              <p className="text-slate-600">Description {basket.description}</p>
              <p className="text-slate-600">Catagory: {basket.catagory}</p>
            </div>
          </div>
        </div>
        <div className="">
          <button
            className="flex place-content-end justify-items-start p-2 mb-8"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <BiSolidPencil size={24} />
          </button>
          <button
            className="flex place-content-end justify-items-end p-2 mt-8"
            onClick={() => {
              setdeleteBasketModal(true);
            }}
          >
            <AiOutlineDelete size={24} />
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-[50px] p-10 justify-start mt-5 rounded-xl">
          {basket.sizes.map((size, index) => (
            <SizeCard
              key={size.id}
              size={size}
              onEdit={() => {
                setModalOpen(true);
              }}
              setBasket={setBasket}
            />
          ))}
          <div
            className="grow p-5 bg-white rounded-xl shadow max-w-xs flex justify-center items-center opacity-40"
            onClick={() => {
              setSizeAdd(true);
            }}
          >
            <MdOutlineAddCircleOutline size={150} />
          </div>
        </div>
      </div>

      {deleteBasketModal && (
        <DeleteModal
          onDelete={delBasket}
          onCancel={() => setdeleteBasketModal(false)}
          delName={basket.name}
        />
      )}
      {modalOpen && (
        <EditBasketModal
          basket={basket}
          onEdit={(bk: Basket) => {
            setModalOpen(false);
            setBasket(bk);
          }}
          onCancel={() => setModalOpen(false)}
        />
      )}
      {addSize && (
        <AddSizeModal
          setBasket={setBasket}
          closeModal={() => setSizeAdd(false)}
        />
      )}
    </div>
  );
};

export default Page;

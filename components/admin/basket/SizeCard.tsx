import { Basket, Item, Size } from "@/utils/types";
import { useState } from "react";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import DeleteModal from "../BasketModal/DeleteModal";
import ItemCard from "../BasketModal/ItemCard";
import ItemModal from "../BasketModal/ItemModal";
import EditSizeModal from "./EditSizeModal";

type props = {
  size: Size;
  onEdit: () => void;
  length: number;
  setBasket: React.Dispatch<React.SetStateAction<Basket | undefined>>;
};

const SizeCard = ({ size, length, setBasket }: props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [deleteSizeModal, setdeleteSizeModal] = useState(false);
  const [deleteItemModal, setdeleteItemModal] = useState(false);
  const [editSizeModal, setEditSizeModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);

  const deleteItem = (index: number) => {
    if (size.items.length == 1) {
      setBasket((p) => {
        if (p) return { ...p, sizes: p.sizes.filter((s) => s.id !== size.id) };
      });
    }
    setBasket((prev) => {
      if (!prev) return;
      // filter out the item
      const newSize = (s: Size) => ({
        ...s,
        items: s.items.filter((item, i) => i != index),
      });

      return {
        ...prev,
        sizes: prev.sizes.map((s) => (s.id == size.id ? newSize(s) : s)),
      };
    });
  };

  const addItems = (items: Item[]) => {
    setBasket((prev) => {
      if (!prev) return;
      return {
        ...prev,
        sizes: prev.sizes.map((s) => (s.id == size.id ? { ...s, items } : s)),
      };
    });
  };

  return (
    <div className="grow p-4 bg-white rounded-xl shadow max-w-sm gap-3 min-w-[260px] w-full relative">
      <div className="absolute top-4 right-4 gap-4">
        <button onClick={() => setEditSizeModal(true)}>
          <BiSolidPencil size={24} />
        </button>
        {length > 1 && (
          <button
            onClick={() => {
              setdeleteSizeModal(true);
            }}
          >
            <RiCloseCircleFill size={24} />
          </button>
        )}
      </div>
      <p className="text-slate-600 m-2 text-lg font-bold">Name : {size.name}</p>
      <p className="text-slate-600 m-2">Price: {size.price / 100}</p>
      {size.items.map((item, index) => (
        <div className="flex flex-col mb-2" key={index}>
          <ItemCard
            key={item.name}
            item={item}
            editItem={() => {
              setModalOpen(true);
              setSelectedIndex(index);
            }}
            deleteItem={() => {
              setSelectedIndex(index);
              setdeleteItemModal(true);
            }}
            index={index}
          />
        </div>
      ))}
      <div
        className="flex justify-center border border-slate-400 rounded-lg px-3 py-2 opacity-50"
        onClick={() => setAddItemModal(true)}
      >
        <MdOutlineAddCircleOutline size={50} />
      </div>
      {modalOpen && (
        <ItemModal
          items={size.items}
          setItems={(items: Item[]) => {
            setBasket((prev) => {
              if (!prev) return;
              return {
                ...prev,
                sizes: prev.sizes.map((s) =>
                  s.id == size.id ? { ...s, items } : s,
                ),
              };
            });
          }}
          index={selectedIndex}
          setOpen={setModalOpen}
        />
      )}
      {deleteSizeModal && (
        <DeleteModal
          onDelete={() => {
            setBasket((p) => {
              if (p)
                return { ...p, sizes: p.sizes.filter((s) => s.id !== size.id) };
            });
          }}
          onCancel={() => setdeleteSizeModal(false)}
          delName={size.name}
        />
      )}
      {deleteItemModal && selectedIndex != undefined && (
        <DeleteModal
          onDelete={() => {
            deleteItem(selectedIndex);
            setdeleteItemModal(false);
          }}
          onCancel={() => setdeleteItemModal(false)}
          delName={size.items[selectedIndex].name}
        />
      )}
      {editSizeModal && (
        <EditSizeModal
          onEdit={(sz: Size) => {
            setEditSizeModal(false);
            setBasket((prev) => {
              if (prev)
                return {
                  ...prev,
                  sizes: prev.sizes.map((s) => (s.id == size.id ? sz : s)),
                };
            });
          }}
          size={size}
          onCancel={() => setEditSizeModal(false)}
        />
      )}
      {addItemModal && (
        <ItemModal
          items={size.items}
          setOpen={setAddItemModal}
          setItems={addItems}
          index={undefined}
        />
      )}
    </div>
  );
};

export default SizeCard;

import Overlay from "@/components/Overlay";
import { updateBasket } from "@/services/database";
import { generateID } from "@/utils/misc";
import { Item, Size } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ItemCard from "../BasketModal/ItemCard";
import ItemModal from "../BasketModal/ItemModal";
import Btn from "../Btn";
import Input from "../Input";

type props = {
  basketId: string;
  sizes: Size[];
  closeModal: () => void;
};

const AddSizeModal = ({ basketId, sizes, closeModal }: props) => {
  const router = useRouter();
  const [itemModal, setItemModal] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const [size, setSize] = useState<Size>({
    id: generateID(),
    name: "",
    description: "",
    price: 0,
    items: [],
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async () =>
      updateBasket(
        { sizes: [...sizes, { ...size, items, price: size.price * 100 }] },
        basketId,
      ),
    onSuccess() {
      router.push(router.asPath);
      closeModal();
    },
  });

  const deleteItem = (index: number | undefined) => {
    setItems((prev) => prev.filter((_, i) => i != index));
  };

  const isNameTaken = !!sizes.find((s) => s.name == size.name);

  return (
    <Overlay onClick={closeModal}>
      <div
        className="rounded-lg bg-white w-full max-w-xl shadow px-7 py-6 flex-grow justify-center max-h-screen my-2 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl text-gray-800 font-semibold">Add New Size</h2>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <Input
              label="Name"
              defaultValue={size.name}
              onChange={(e) =>
                setSize((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {isNameTaken && <p className="text-sm text-red-500">Name Taken</p>}
            <Input
              label="Price"
              type="number"
              defaultValue={size.price || ""}
              onChange={(e) =>
                setSize((prev) => ({
                  ...prev,
                  price: e.target.valueAsNumber || 0,
                }))
              }
            />
          </div>
          <div className="flex flex-col my-5 mb-5">
            <div className="flex flex-row justify-between mb-5">
              <h3 className="text-black font-bold text-2xl">Item</h3>
              <button
                className="bg-amber-500 text-emerald-50 rounded-lg shadow px-4 py-2"
                onClick={() => setItemModal(true)}
              >
                <AiOutlinePlus />
              </button>
            </div>
            <div className="flex flex-col mb-2 gap-4 overflow-auto max-h-[50%]">
              {items.length ? (
                items.map((item, i) => (
                  <ItemCard
                    key={i}
                    item={item}
                    index={i}
                    deleteItem={() => {
                      deleteItem(i);
                    }}
                    editItem={() => {
                      setSelectedIndex(i);
                      setItemModal(true);
                    }}
                  />
                ))
              ) : (
                <p className="text-slate-600 mx-auto">No Items</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Btn label="Cancel" onClick={closeModal} />
          <Btn
            isLoading={isLoading}
            label="Submit"
            onClick={() => mutate()}
            type="submit"
            disabled={!items.length || !size.price || !size.name || isNameTaken}
          />
        </div>
      </div>
      {itemModal && (
        <ItemModal
          index={selectedIndex}
          items={items}
          setOpen={setItemModal}
          setItems={setItems}
        />
      )}
    </Overlay>
  );
};

export default AddSizeModal;

import {
  createProduct,
  updateCatagoryProductCountById,
} from "@/services/database";
import { Product } from "@/utils/types";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import Btn from "../Btn";
import CatagoriesInput from "../CatagoriesInput";
import Input from "../Input";
import UnitInput from "../UnitInput";

type props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const ProductModal = ({ setOpen, onClose }: props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [vendor, setVendor] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState<number>();
  const [catagories, setCatagories] = useState<
    { value: string; label: string }[]
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const product: Product = {
      name,
      unit,
      price,
      vendor,
      catagories: catagories.map((catagory) => catagory.label),
      description: desc,
      created_at: Date.now(),
    };
    catagories.forEach((element) => {
      updateCatagoryProductCountById(element.value, 1);
    });
    createProduct(product).then(() => {
      setLoading(false);
      setOpen(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 absolute top-0 left-0 z-50 py-4 w-full">
      <div className="flex justify-center h-full w-full bg-slate-200 relative top-0 z-50 py-3 ">
        <div className="max-w-sm flex flex-col w-full px-2">
          <button
            className="bg-transparent absolute top-0 right-0 m-2 p-3 rounded-full hover:bg-neutral-100 "
            onClick={() => setOpen(false)}
          >
            <GrClose className="h-6 w-6" />
          </button>

          <h1 className="text-2xl text-neutral-700 font-bold">
            Add New Product
          </h1>

          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col"
          >
            <Input
              label="Name"
              value={name}
              error={nameErr}
              onChange={(e) => {
                setName(e.target.value);
                if (!e.target.value) setNameErr("required");
                else setNameErr("");
              }}
            />
            <Input
              label="Description(optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Input
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber || 0)}
            />
            <UnitInput unit={unit} setUnit={setUnit} />
            <CatagoriesInput
              catagories={catagories}
              setCatagories={setCatagories}
            />
            <Btn
              label="Post"
              type="submit"
              onClick={submit}
              className="ml-auto mt-3 "
              isLoading={loading}
              disabled={!name || !price}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

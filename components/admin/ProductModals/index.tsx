import {
  createProduct,
  updateCatagoryProductCountById,
} from "@/services/database";
import { uploadProductImages } from "@/services/storage";
import { Product } from "@/utils/types";
import { useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import Btn from "../Btn";
import CatagoriesInput from "../CatagoriesInput";
import Input from "../Input";
import UnitInput from "../UnitInput";
import VendorInput from "../VendorInput";

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
  const imgRef = useRef<HTMLInputElement>(null);

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
    const { key } = await createProduct(product);
    await uploadProductImages(key, images);
    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="min-h-screen overflow-auto bg-slate-200 absolute top-0 left-0 z-50 py-4 w-full">
      <div className="flex justify-center h-full w-full relative top-0 z-50">
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
          <input
            type="file"
            name=""
            multiple
            id=""
            onChange={(e) =>
              setImages((p) => [...p, ...Array.from(e.target.files)])
            }
            accept="image/*"
            className="hidden"
            ref={imgRef}
          />
          <div className="flex gap-3 px-4 pt-4 py-1 w-full max-w-md overflow-x-auto">
            {images.map((image, i) => (
              <div
                className="rounded-lg overflow-hidden border-2 
            border-dashed border-neutral-400 h-36 w-36 relative bg-neutral-100 flex flex-col items-center justify-center shrink-0"
                key={i}
              >
                <img
                  src={URL.createObjectURL(image)}
                  className="h-full w-full object-cover"
                  alt=""
                />
                <div
                  className="absolute bottom-0 left-0 bg-red-500 p-2 m-2 rounded-full text-white hover:shadow-md hover:brightness-110 cursor-pointer"
                  role="button"
                  title="Delete"
                  onClick={() =>
                    setImages((p) => p.filter((_, index) => index !== i))
                  }
                >
                  <AiOutlineDelete />
                </div>
                <div className="absolute bottom-0 right-0"></div>
              </div>
            ))}
            <div
              className="rounded-lg overflow-hidden border-2 
            border-dashed border-neutral-400 h-36 w-36 bg-neutral-100 flex flex-col items-center justify-center shrink-0 cursor-pointer mx-auto"
              onClick={() => imgRef.current?.click()}
            >
              <h2 className="text-lg font-bold text-neutral-600">Add Images</h2>
              <p className="text-neutral-500 text-center text-sm">
                Click to add images here
              </p>
            </div>
          </div>
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
            <VendorInput vendor={vendor} setVendor={setVendor} />
            <Btn
              label="Post"
              type="submit"
              onClick={submit}
              className="ml-auto my-3"
              isLoading={loading}
              disabled={!name || !price || images.length == 0}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

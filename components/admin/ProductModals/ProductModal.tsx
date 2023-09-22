import { createProduct } from "@/services/database";
import { useState } from "react";
import FirstProductPage from "./FirstProductPage";

type props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};
const ProductModal = ({ setOpen, onClose }: props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [catagory, setCatagory] = useState("");
  const [vendor, setVendor] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState<number>();

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const product = {
      image: `baskets/default/${image}`,
      name,
      catagory,
      description: desc,
      vendor,
      unit,
      price,
      created_at: Date.now(),
    };
    createProduct(product).then(() => {
      setLoading(false);
      setOpen(false);
    });
  };

  return (
    <div className="min-h-screen h-full overflow-auto w-screen bg-slate-200 absolute top-0 left-0 z-50 py-3">
      <div className="flex items-center justify-center flex-col h-full ">
        <FirstProductPage
          {...{
            name,
            setName,
            catagory,
            setCatagory,
            desc,
            setDesc,
            nameErr,
            setNameErr,
            image,
            setImage,
            vendor,
            setVendor,
            unit,
            setUnit,
            price,
            setPrice,
          }}
          submit={submit}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default ProductModal;

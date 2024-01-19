import useApp from "@/services/appContext";
import { createBasket } from "@/services/database";
import { generateID } from "@/utils/misc";
import { Size } from "@/utils/types";
import Compressor from "compressorjs";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { blobToWebP } from "webp-converter-browser";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";

type props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const BasketModal = ({ setOpen }: props) => {
  const {user} = useApp()
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [catagory, setCatagory] = useState("");
  const [sizes, setSizes] = useState<Size[]>([
    {
      id: generateID(),
      name: "",
      description: "",
      price: 0,
      items: [],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const basket = {
      image: `baskets/default/${image}`,
      name,
      catagory,
      description: desc,
      sizes,
      created_at: Date.now(),
    };
    const basketRef = await createBasket(basket);

    if (imageFile) {
      new Compressor(imageFile, {
        quality: 0.6,
        async success(res) {
          const file = await blobToWebP(res);

    const token = await user!.getIdToken(true);
          const formData = new FormData();
          formData.append("image", file);
          formData.append("obj", JSON.stringify({ basketId: basketRef.key }));

          try {
            await fetch("/api/upload-basket-img", {
              method: "POST",
 headers: {
          authorization: `bearer ${token}`,
        },
              body: formData,
            });
            setOpen(false);
          } finally {
            setLoading(false);
          }
        },
      });
    }
  };

  return (
    <div className="min-h-screen overflow-auto h-full w-screen bg-slate-200 absolute top-0 left-0 z-50 py-3">
      <button
        className="bg-transparent absolute top-0 right-0 m-2 p-3 rounded-full hover:bg-neutral-100"
        onClick={() => setOpen(false)}
      >
        <GrClose className="h-6 w-6" />
      </button>
      <div className="flex items-center justify-center flex-col h-full ">
        {(() => {
          if (page == 0)
            return (
              <FirstPage
                {...{
                  image,
                  setImage,
                  name,
                  setName,
                  desc,
                  setDesc,
                  catagory,
                  setCatagory,
                  nameErr,
                  setNameErr,
                  page,
                  setPage,
                  imageUrl,
                  setImageUrl,
                  imageFile,
                  setImageFile,
                }}
              />
            );
          if (page == 1)
            return (
              <SecondPage
                submit={submit}
                sizes={sizes}
                setPage={setPage}
                isLoading={loading}
                setSizes={setSizes}
              />
            );
          return <></>;
        })()}
      </div>
    </div>
  );
};

export default BasketModal;

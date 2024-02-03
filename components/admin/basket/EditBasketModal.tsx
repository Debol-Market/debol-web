import { getDefaultBasketImages, getImageUrl } from "@/services/storage";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { StorageReference } from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import Overlay from "../../Overlay";
import CatagorySelect from "../BasketModal/CatagorySelect";
import Input from "../Input";

type props = {
  basket: Basket;
  initialImg: string;
  onCancel: () => void;
  onEdit: (Basket) => void;
};

const EditBasketModal = ({ basket, onCancel, initialImg }: props) => {
  const [description, setDescription] = useState(basket.description);
  const [catagory, setCatagory] = useState(basket.catagory);
  const [name, setName] = useState(basket.name);
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState(initialImg);
  const imageInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery({
    queryFn: getDefaultBasketImages,
    queryKey: ["defaultBasketImages"],
  });

  const submit = () => {};

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) return;
    setImageFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <Overlay onClick={onCancel}>
      <div
        className="sm:rounded-lg relative bg-white w-full md:max-w-min shadow p-3 sm:p-6 flex-grow justify-center max-h-screen overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-700"
          onClick={onCancel}
        >
          <IoClose size={32} />
        </button>
        <h1 className="text-2xl font-bold text-slate-700">Edit Basket</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex justify-between gap-3 mt-2">
            {/* <img src={basket.image !== undefined ? `baskets/default/${basket.image}` : ''} alt='' className='w-32 h-32 overflow-hidden rounded' /> */}
            <div className="flex justify-start w-full gap-2 h-64">
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="hidden"
                ref={imageInput}
              />

              <div
                className={`${
                  imageUrl != initialImg ? "bg-primary" : "bg-neutral-200"
                } rounded-lg p-1 shadow-lg h-64 w-64 mx-auto`}
                role="button"
                onClick={() => imageInput.current?.click()}
              >
                <div className="bg-white h-full w-full flex items-center justify-center flex-col rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      loading="lazy"
                      alt=""
                      width={200}
                      height={200}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <>
                      <IoCloudUploadOutline
                        size={52}
                        className="text-neutral-500"
                      />
                      <p className="font-medium text-neutral-600 mx-4 text-center mt-3">
                        {"Upload or Select basket Image"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 shrink-0 h-full flex-col overflow-y-auto">
                {data?.map((img) => (
                  <ImageCard
                    image={img}
                    key={img.name}
                    onClick={(url) => setImageUrl(url)}
                    selected={false}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Input
              label="Name"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Description"
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <CatagorySelect
              catagory={catagory ?? ""}
              setCatagory={setCatagory}
            />
            <div className="flex mt-4 flex-row justify-between">
              <button
                className="bg-amber-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2 "
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2"
                onClick={submit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

const ImageCard: FC<{
  image: StorageReference;
  selected: boolean;
  onClick: (url: string) => void;
}> = ({ image, selected, onClick }) => {
  const { data: url } = useQuery({
    queryFn: () => getImageUrl(image),
    queryKey: ["basketImageURL", image.name],
  });

  if (!url) return <></>;
  return (
    <div
      className={`w-24 h-24 overflow-hidden rounded shrink-0 ${
        selected ? "border-emerald-600 border-2 shadow" : ""
      }`}
      onClick={() => onClick(url)}
    >
      <Image
        src={url}
        alt=""
        className="w-full h-full object-cover"
        width={96}
        height={96}
      />
    </div>
  );
};

export default EditBasketModal;

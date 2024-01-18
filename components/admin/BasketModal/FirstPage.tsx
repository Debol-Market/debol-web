import { getDefaultBasketImages, getImageUrl } from "@/services/storage";
import { useQuery } from "@tanstack/react-query";
import { StorageReference } from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Btn from "../Btn";
import Input from "../Input";
import CatagorySelect from "./CatagorySelect";

type props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  catagory: string;
  setCatagory: React.Dispatch<React.SetStateAction<string>>;
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  nameErr: string;
  setNameErr: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  imageFile?: File;
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const FirstPage: FC<props> = ({
  name,
  setName,
  catagory,
  setCatagory,
  nameErr,
  setNameErr,
  desc,
  setDesc,
  page,
  setPage,
  image,
  setImage,
  imageUrl,
  setImageUrl,
  imageFile,
  setImageFile,
}) => {
  const [selectImageModal, setSelectImageModal] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery({
    queryFn: getDefaultBasketImages,
    queryKey: ["defaultBasketImages"],
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) return;
    setImageFile(selectedFile);
    setImage('')
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <>
      <h1 className="text-xl text-neutral-700 font-bold mb-3">
        Add a New Basket
      </h1>

      <div className="max-w-sm flex flex-col gap-1 w-full px-4">
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
              image ? "bg-primary" : "bg-neutral-200"
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
                onClick={(url) => {
                  setImage(img.name);
                  setImageUrl(url);
                }}
                selected={img.name == image}
              />
            ))}
          </div>
        </div>
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
        <CatagorySelect catagory={catagory} setCatagory={setCatagory} />

        <Btn
          onClick={() => setPage((p) => ++p)}
          label="Next"
          disabled={!name || !imageUrl}
          className="ml-auto mt-3"
        />
      </div>
    </>
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

export default FirstPage;

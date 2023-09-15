import { getImageUrl } from "@/services/storage";
import { StorageReference } from "firebase/storage";
import { FC, useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";

type props = {
  images: StorageReference[];
  selected?: boolean;
  setImage: (item: string) => void;
  image: string;
  setSelectModal: (arg: boolean) => void;
}

const SelectImageModal = ({ images, image, setImage, setSelectModal }: props) => {

  return (<div className="min-h-screen h-full w-screen fixed top-0 left-0 bg-slate-600/40 backdrop-blur flex items-center justify-center z-50">
    <div className="rounded-lg bg-white w-full max-w-sm shadow px-7 py-6 flex-grow justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-end align-top gap-4">
        <RiCloseCircleFill onClick={() => setSelectModal(false)} size={24} />
      </div>
      <h2 className="text-4xl font-bold text-slate-500">Select Image</h2>
      <div className="flex flex-row gap-3 overflow-x-auto mt-2 bg-slate-200 rounded-md p-4 max-w-full">
        {images.length == 0 ? (
          <div>loading </div>
        ) : (
          images.map((item, i) => (
            <ImageCard
              key={i}
              image={item}
              selected={item.name == image}
              onClick={() => { setSelectModal(false); setImage(item.name) }}
            />
          ))
        )}
      </div>
    </div>
  </div>);
}

const ImageCard: FC<{
  image: StorageReference;
  selected: boolean;
  onClick: () => void;
}> = ({ image, selected, onClick }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getImageUrl(image).then(setUrl);
  }, []);

  if (!url) return <></>;
  return (
    <div
      className={`w-32 h-32 overflow-hidden shrink-0 rounded ${selected
        ? 'border-emerald-600 border-2 shadow'
        : 'border-black/60 border'
        }`}
      onClick={onClick}
    >
      <img src={url} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default SelectImageModal;
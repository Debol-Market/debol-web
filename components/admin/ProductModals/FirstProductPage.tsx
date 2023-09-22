import { getCatagories } from '@/services/database';
import { getDefaultBasketImages, getImageUrl } from '@/services/storage';
import { Catagory } from '@/utils/types';
import { StorageReference } from 'firebase/storage';
import React, { FC, useEffect, useState } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { GrClose } from 'react-icons/gr';
import Btn from '../Btn';
import CatagoryCreateModal from '../CatagoryCreateModal';
import Input from '../Input';
import SelectImageModal from '../basket/SelectImageModal';

type props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  catagory: string;
  setCatagory: React.Dispatch<React.SetStateAction<string>>;
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  nameErr: string;
  setNameErr: React.Dispatch<React.SetStateAction<string>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  vendor: string;
  setVendor: React.Dispatch<React.SetStateAction<string>>;
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  submit: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FirstProductPage: FC<props> = ({
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
  submit,
  setOpen
}) => {
  const [isCatagoryModal, setIsCatagoryModal] = useState(false);
  const [selectImageModal, setSelectImageModal] = useState(false);
  const [catagories, setCatagories] = useState<Catagory[]>([]);
  const [images, setImages] = useState<StorageReference[]>([]);

  useEffect(() => {
    getCatagories().then(() => setCatagories);
    getDefaultBasketImages().then(setImages);
  }, []);

  return (
    <div className="min-h-screen flex justify-center h-full w-screen bg-slate-200  top-0 z-50 py-3 ">

      <div className="max-w-sm flex flex-col gap-2 w-full px-4">
        <div className="flex justify-end">
          <button
            className="bg-transparent absolute top-0 right-0 m-2 p-3 rounded-full hover:bg-neutral-100"
            onClick={() => setOpen(false)}
          >
            <GrClose className="h-6 w-6" />
          </button>
        </div>
        <h1 className="text-2xl text-neutral-700 font-bold mb-4">
          Add a New Basket
        </h1>
        <div className="flex justify-start w-full ">
          <button className='bg-amber-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2'
            onClick={() => setSelectImageModal(true)}><BiImageAdd size={24} /></button>
        </div>
        <Input
          label="Name"
          value={name}
          className="w-full"
          error={nameErr}
          onChange={(e) => {
            setName(e.target.value);
            if (!e.target.value) setNameErr('required');
            else setNameErr('');
          }}
        />
        <Input
          label="Description(optional)"
          value={desc}
          className="w-full"
          onChange={(e) => setDesc(e.target.value)}
        />
        <Input
          label="Vendor"
          value={vendor}
          className="w-full"
          onChange={(e) => setVendor(e.target.value)}
        />
        <Input
          label="Price"
          type="number"
          value={price}
          className="w-full"
          onChange={(e) => setPrice(e.target.valueAsNumber || 0)}
        />
        <Input
          label="Unit"
          value={unit}
          className="w-full"
          onChange={(e) => setUnit(e.target.value)}
        />

        <select
          id="unit"
          value={catagory}
          className="mt-4 px-3 py-3 rounded-lg bg-amber-500 text-white"
          onChange={(e) => {
            const val = e.target.value;
            if (val == 'add') return setIsCatagoryModal(true);
            setCatagory(e.target.value);
          }}
        >
          <option className="focus:bg-emerald-600" value="">
            Select Catagory
          </option>
          {catagories.map((item, i) => (
            <option className="focus:bg-emerald-600" key={i} value={item.name}>
              {item.name}
            </option>
          ))}
          <option className="focus:bg-emerald-600" value="add">
            Add
          </option>
        </select>
        <Btn
          onClick={submit}
          label="Post"
          disabled={!name || !vendor || !price}
          className="ml-auto mt-3"
        />
      </div>
      {isCatagoryModal && (
        <CatagoryCreateModal
          onClose={() => setIsCatagoryModal(false)}
          onSubmit={(cat) => {
            setCatagories((prev) => [...prev, cat]);
            setCatagory(cat.name);
          }}
        />
      )}
      {selectImageModal && (
        <SelectImageModal
          images={images}
          image={image}
          setImage={setImage}
          setSelectModal={setSelectImageModal} />
      )

      }
    </div>
  );
};

const ImageCard: FC<{
  image: StorageReference;
  selected: boolean;
  onClick: () => void;
}> = ({ image, selected, onClick }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getImageUrl(image).then(setUrl);
  });

  if (!url) return <></>;
  return (
    <div
      className={`w-32 h-32 overflow-hidden rounded shrink-0 ${selected
        ? 'border-emerald-600 border-2 shadow'
        : 'border-black/60 border'
        }`}
      onClick={onClick}
    >
      <img src={url} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default FirstProductPage;

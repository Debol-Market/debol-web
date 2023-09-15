import { getCatagories } from '@/services/database';
import { getDefaultBasketImages, getImageUrl } from '@/services/storage';
import { Catagory } from '@/utils/types';
import { StorageReference } from 'firebase/storage';
import { FC, useEffect, useState } from 'react';
import { BiImageAdd } from 'react-icons/bi';
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
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
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
    <>
      <h1 className="text-2xl text-neutral-700 font-bold mb-4">
        Add a New Basket
      </h1>

      <div className="max-w-sm flex flex-col gap-2 w-full px-4">
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
          onClick={() => setPage((p) => ++p)}
          label="Next"
          disabled={!name || !image}
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
    </>
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

export default FirstPage;

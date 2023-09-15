import { getCatagories } from '@/services/database';
import { getDefaultBasketImages } from '@/services/storage';
import { Basket, Catagory } from '@/utils/types';
import { StorageReference } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import Overlay from "../../Overlay";
import CatagoryCreateModal from '../CatagoryCreateModal';
import Input from "../Input";
import SelectImageModal from './SelectImageModal';

type props = {
  basket: Basket;
  onEdit: (Basket) => void;
  onCancel: () => void;
}
const EditBasketModal = ({ basket, onEdit, onCancel }: props) => {
  const [description, setDescription] = useState(basket.description !== undefined ? basket.description : '');
  const [catagory, setCatagory] = useState(basket.catagory !== undefined ? basket.catagory : '');
  const [name, setName] = useState(basket.name !== undefined ? basket.name : '');
  const [selectImageModal, setselectImageModal] = useState(false);
  const [images, setImages] = useState<StorageReference[]>([]);
  const [catagories, setCatagories] = useState<Catagory[]>([]);
  const [createCatagoryModal, setCreateCatagoryModal] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    getDefaultBasketImages().then(setImages);
    getCatagories().then(() => setCatagories);
  }, []);

  const submit = () => {
    onEdit({
      ...basket,
      name,
      description,
      catagory,
      image: `baskets/default/${image}`
    })
  }

  return (<Overlay onClick={onCancel}>
    <div className="rounded-lg bg-white w-full max-w-sm shadow px-7 py-6 flex-grow justify-center" onClick={(e) => e.stopPropagation()}>
      <h1 className="text-4xl font-bold text-slate-500">Edit Basket</h1>
      <div className='flex justify-between gap-3 mt-2'>
        {/* <img src={basket.image !== undefined ? `baskets/default/${basket.image}` : ''} alt='' className='w-32 h-32 overflow-hidden rounded' /> */}
        <button className='bg-amber-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2' onClick={() => setselectImageModal(true)}><BiImageAdd size={24} /></button>
      </div>
      <div className='flex flex-col'>
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
        <select
          id="unit"
          value={catagory}
          className="mt-4 px-3 py-3 rounded-lg bg-amber-500 text-white"
          onChange={(e) => {
            const val = e.target.value;
            if (val == 'add') return setCreateCatagoryModal(true);
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
      </div>
      <div className='flex mt-10 flex-row justify-between'>
        <button className='bg-amber-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2 '
          onClick={onCancel} >Cancel</button>
        <button className='bg-green-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2'
          onClick={submit}>Save</button>
      </div>
    </div>
    {selectImageModal && (
      <SelectImageModal
        images={images}
        setImage={setImage}
        image={image}
        setSelectModal={setselectImageModal} />
    )
    }
    {createCatagoryModal && (
      <CatagoryCreateModal
        onClose={() => setCreateCatagoryModal(false)}
        onSubmit={(cat) => {
          setCatagories((prev) => [...prev, cat]);
          setCreateCatagoryModal(false);
        }}
      />
    )

    }
  </Overlay>);
}

export default EditBasketModal;
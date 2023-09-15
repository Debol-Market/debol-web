import Overlay from '@/components/Overlay';
import { Size } from '@/utils/types';
import { useState } from 'react';
import Input from '../Input';

type props = {
  size: Size;
  onEdit: (Size) => void;
  onCancel: () => void;
}

function EditSizeModal({ size, onEdit, onCancel }: props) {

  const [name, setName] = useState(size.name ?? '');
  const [description, setDescription] = useState(size.description ?? '');
  const [price, setPrice] = useState(size.price ?? 0);

  const submit = () => {
    onEdit({
      ...size,
      name,
      description,
      price
    })
  }

  return (<Overlay onClick={onCancel} >
    <div className="rounded-lg bg-white w-full max-w-sm shadow px-7 py-6 flex-grow justify-center" onClick={(e) => e.stopPropagation()}>
      <h1 className="text-4xl font-bold text-slate-500">Edit Size</h1>
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
        <Input
          label="Price"
          defaultValue={price / 100}
          type="number"
          onChange={(e) => setPrice(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber * 100)}
        />
      </div>
      <div className='flex mt-10 flex-row justify-between'>
        <button className='bg-amber-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2 '
          onClick={onCancel} >Cancel</button>
        <button className='bg-green-500 text-emerald-50 min-w-[80px] rounded-lg shadow px-4 py-2'
          onClick={submit}>Save</button>
      </div>


    </div>
  </Overlay>);
}

export default EditSizeModal;
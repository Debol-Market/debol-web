import Overlay from '@/components/Overlay';
import { generateID } from '@/utils/misc';
import { Basket, Item, Size } from '@/utils/types';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import DeleteModal from '../BasketModal/DeleteModal';
import ItemCard from '../BasketModal/ItemCard';
import ItemModal from '../BasketModal/ItemModal';
import Btn from '../Btn';
import Input from '../Input';


type props = {
  setBasket: React.Dispatch<React.SetStateAction<Basket | undefined>>;
  closeModal: () => void
}

const AddSizeModal = ({ setBasket, closeModal }: props) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const [itemModal, setItemModal] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [deleteItemModal, setdeleteItemModal] = useState(false);

  const [size, setSize] = useState<Size>(
    {
      id: generateID(),
      name: '',
      description: '',
      price: 0,
      items: [],
    },
  );

  const submit = async () => {
    setLoading(true);
    setBasket(prev => {
      if (prev) return { ...prev, sizes: [...prev.sizes, { ...size, items }] }
    })
    closeModal();
  }

  const deleteItem = (index: number | undefined) => {
    setItems(prev => {
      return prev.filter((item, i) => i != index)
    })
  }


  return (<Overlay onClick={closeModal}>
    <div
      className="rounded-lg bg-white w-full max-w-xl shadow px-7 py-6 flex-grow justify-center max-h-screen my-2 overflow-auto"
      onClick={(e) => e.stopPropagation()} >
      <h2 className='text-4xl text-slate-500 font-bold'>Add New Size</h2>
      <div className='flex flex-col m-5'>
        <div className='flex flex-col'>
          <Input
            label='Name'
            defaultValue={size.name}
            onChange={e => setSize(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label='Description (optional)'
            defaultValue={size.description}
            onChange={e => setSize(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className='flex flex-col m-5 mb-5'>
          <div className='flex flex-row justify-between mb-5'>
            <h3 className='text-black font-bold text-2xl'>Item</h3>
            <button className="bg-amber-500 text-emerald-50 rounded-lg shadow px-4 py-2" onClick={() => setItemModal(true)}><AiOutlinePlus /></button>
          </div>
          <div className='flex flex-col mb-2 gap-4 overflow-auto max-h-[50%]'>
            {items.length ? (
              items.map((item, i) => (
                <ItemCard
                  key={i}
                  item={item}
                  index={i}
                  deleteItem={() => { deleteItem(i); setdeleteItemModal(true) }}
                  editItem={() => { setSelectedIndex(i); setItemModal(true) }}
                />
              ))) : (<p className="text-slate-600 mx-auto">No Items</p>)}
          </div>

        </div>

      </div>
      <div className='flex justify-between'>
        <Btn isLoading={loading}
          label='Cancel'
          onClick={closeModal} />
        <Btn isLoading={loading}
          label='Submit'
          onClick={submit}
          type='submit'
          disabled={!items.length} />
      </div>
    </div>
    {itemModal &&
      <ItemModal
        index={selectedIndex}
        items={items}
        setOpen={setItemModal}
        setItems={setItems}
      />
    }
    {deleteItemModal && (
      <DeleteModal
        onDelete={() => { setdeleteItemModal(false) }}
        onCancel={() => setdeleteItemModal(false)}
      />
    )}

  </Overlay>);
}

export default AddSizeModal;
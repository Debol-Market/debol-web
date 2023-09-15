import { Item } from '@/utils/types';
import { FaPen, FaTrash } from 'react-icons/fa';

const ItemCard = ({
  index,
  item,
  deleteItem,
  editItem,
}: {
  index: number;
  item: Item;
  deleteItem: () => void;
  editItem: () => void;
}) => {
  return (
    <div className="flex gap-2 border border-slate-400 rounded-lg px-3 py-2">
      <div className="flex flex-col grow">
        <h2 className="text-2xl mb-2">{item.name}</h2>
        <p className="text-slate-600 text-xs">
          ${item.pricePerUnit / 100} X {item.quantity}
          {item.unit} = ${(item.pricePerUnit * item.quantity) / 100}
        </p>
      </div>
      <div className="text-3xl flex flex-col gap-2 justify-evenly ">
        <button onClick={editItem}>
          <FaPen className="h-5 w-5 text-emerald-500 mb-2" />
        </button>
        <button onClick={deleteItem}>
          <FaTrash className="h-5 w-5 text-red-500 mt-2" />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

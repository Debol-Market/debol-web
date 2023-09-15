import { Item, Size } from '@/utils/types';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';

type props = {
  length: number;
  size: Size;
  removeSize: () => void;
  setSize: (size: Size) => void;
};

const SizeForm = ({ size, setSize, removeSize, length }: props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);

  const onEdit = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const setItems = (items: Item[]) => {
    setSize({
      ...size,
      items,
    });
  };

  const deleteItem = (index: number) =>
    setSize({
      ...size,
      items: size.items.filter((_, i) => i != index),
    });

  useEffect(() => {
    setSize({
      ...size,
      price: size.items.reduce(
        (acc, item) => acc + item.pricePerUnit * item.quantity,
        0
      ),
    });
  }, [size.items]);

  return (
    <div className="flex flex-col shadow-lg px-10 pt-8 pb-3 bg-white rounded-2xl gap-5 max-h-[calc(100vh-160px)] overflow-auto min-w-[280px]">
      <div className="flex flex-col gap-3">
        <CustomInput
          label="Name"
          defaultValue={size.name}
          onChange={(e) => setSize({ ...size, name: e.target.value })}
        />
        <CustomInput
          label="Description (optional)"
          defaultValue={size.description}
          onChange={(e) => setSize({ ...size, description: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2 pl-3 border-0 border-l-2 border-emerald-600 py-4">
        <div className="flex justify-between mb-2 -translate-x-1">
          <h1 className="text-xl font-bold text-slate-800">Items</h1>
          <button
            className="bg-amber-500 text-black rounded-lg shadow px-4 py-2"
            onClick={() => setModalOpen(true)}
          >
            <AiOutlinePlus className="h-5 w-5" />
          </button>
        </div>
        {size.items.length ? (
          size.items.map((item, i) => (
            <ItemCard
              key={i}
              item={item}
              index={i}
              deleteItem={() => deleteItem(i)}
              editItem={() => onEdit(i)}
            />
          ))
        ) : (
          <p className="text-slate-600 mx-auto">No Items</p>
        )}
        <CustomInput
          label="Total Price"
          type="number"
          value={size.price / 100}
          onChange={(e) => {
            setSize({
              ...size,
              price: (e.target.valueAsNumber || 0) * 100,
            });
          }}
        />
      </div>

      {modalOpen && (
        <ItemModal
          items={size.items}
          setItems={setItems}
          index={selectedIndex}
          setOpen={(o) => {
            setModalOpen(o);
            setSelectedIndex(undefined);
          }}
        />
      )}

      {length > 1 && (
        <button
          className="bg-red-500 text-white rounded-lg shadow px-4 py-2 flex justify-center"
          onClick={removeSize}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

//

const CustomInput = ({
  label,
  error,
  className,
  ...rest
}: {
  label: string;
  error?: string;
} & React.ComponentProps<'input'>) => {
  return (
    <div className="flex flex-col">
      <label
        className="text-slate-500 mt-1 font-semibold text-sm"
        htmlFor={rest.id}
      >
        {label}
      </label>
      <input
        {...rest}
        className={`py-2 px-3 focus:outline-none border border-slate-400 focus:border-emerald-600 rounded-lg ${error ? 'border-red-600' : ''
          } w-auto min-w-0 ${className ? className : ''}`}
      />
      {error ? <p className="text-xs text-red-600 ">{error}</p> : null}
    </div>
  );
};

export default SizeForm;

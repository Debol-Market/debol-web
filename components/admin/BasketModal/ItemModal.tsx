import Overlay from '@/components/Overlay';
import { Item } from '@/utils/types';
import { useState } from 'react';
import Input from '../Input';

type props = {
  items: Item[];
  index?: number;
  setItems: (items: Item[]) => void;
  setOpen: (open: boolean) => void;
};

// if index is undefined, this modal adds new item
// if index is defined, this modal edits the item from the list using the index
const ItemModal = ({ setOpen, setItems, items, index }: props) => {
  // if index is defined, set the states to the item's values
  const [name, setName] = useState(index != undefined ? items[index].name : '');
  const [unit, setUnit] = useState(
    index != undefined ? items[index].unit : 'kg'
  );
  const [quantity, setQuantity] = useState(
    index != undefined ? items[index].quantity : 1
  );
  const [price, setPrice] = useState(
    index != undefined ? items[index].pricePerUnit ?? 0 : 0
  );

  const submit = () => {
    if (index !== undefined) {
      setItems(
        items.map((item, i) =>
          i == index
            ? {
              name,
              unit,
              quantity,
              pricePerUnit: price,
            }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          name,
          unit,
          quantity,
          pricePerUnit: price,
        },
      ]);
    }
    setOpen(false);
  };

  return (
    <Overlay onClick={() => setOpen(false)}>
      <div
        className="rounded-lg bg-white w-full max-w-sm shadow px-7 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-bold">Item</h1>
        <div className="flex flex-col">
          <Input
            label="Name"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Quantity"
            defaultValue={quantity}
            type="number"
            onChange={(e) => setQuantity(e.target.valueAsNumber || 0)}
          />

          <select
            id="unit"
            defaultValue={unit}
            className="mt-4 px-3 py-3 rounded-lg bg-amber-500  "
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">-- Select Unit --</option>
            <optgroup label="Solid">
              <option value="pc">Piece</option>
              <option value="oz">Quintal (cwt)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="lb">Pound (lb)</option>
              <option value="oz">Ounce (oz)</option>
            </optgroup>
            <optgroup label="Liquid">
              <option value="L">Liter (L)</option>
              <option value="mL">Milliliter (mL)</option>
              <option value="fl-oz">Fluid Ounce (fl oz)</option>
              <option value="cup">Cup (cup)</option>
            </optgroup>
          </select>

          <Input
            label="Price"
            defaultValue={price / 100}
            type="number"
            min={0}
            max={10000}
            onChange={(e) => setPrice((e.target.valueAsNumber || 0) * 100)}
          />
        </div>
        <div className="flex justify-between items-center w-full mt-3">
          <h2 className="text-xl">Total</h2>
          <p className="text-xl">${(quantity * price) / 100}</p>
        </div>
        <div className="mt-5 flex justify-between">
          <button
            className="bg-amber-500 text-black rounded-lg shadow px-4 py-2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            disabled={!name || !quantity || !price}
            className="bg-amber-500 text-black rounded-lg shadow px-4 py-2 disabled:opacity-60"
            onClick={submit}
          >
            {index === undefined ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default ItemModal;

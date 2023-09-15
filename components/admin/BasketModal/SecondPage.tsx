import { generateID } from '@/utils/misc';
import { Size } from '@/utils/types';
import { AiOutlinePlus } from 'react-icons/ai';
import Btn from '../Btn';
import SizeForm from './SizeForms';

type props = {
  sizes: Size[];
  submit: () => void;
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
};

const SecondPage = ({ sizes, setSizes, setPage, isLoading, submit }: props) => {
  const AddSize = () => {
    setSizes((p) => [
      ...p,
      { ...JSON.parse(JSON.stringify(p[p.length - 1])), id: generateID() },
    ]);
  };

  //   console.table(sizes);
  //   console.table(...sizes.map((size) => size.items));

  const removeSize = (index: number) => {
    return () => setSizes((sizes) => sizes.filter((_, i) => i != index));
  };

  return (
    <>
      <h1 className="text-2xl text-neutral-700 font-bold">Add Sizes</h1>
      <div className="flex gap-5 py-6 px-2 max-w-[95vw] overflow-auto">
        {sizes.map((size, i) => (
          <SizeForm
            key={i}
            size={size}
            length={sizes.length}
            setSize={(newSize) =>
              setSizes((sizes) =>
                sizes.map((size, index) => (i == index ? newSize : size))
              )
            }
            removeSize={removeSize(i)}
          />
        ))}
        <button
          className="bg-emerald-600 text-white font-semibold text-lg rounded-full shadow p-4 my-auto"
          onClick={AddSize}
        >
          <AiOutlinePlus className="h-6 w-6" />
        </button>
      </div>
      <div className="flex justify-between items-center w-full max-w-sm">
        <button
          className="bg-amber-500 text-black rounded-lg shadow px-4 py-2"
          onClick={() => setPage((p) => --p)}
        >
          Previous
        </button>
        <Btn
          label="Submit"
          isLoading={isLoading}
          disabled={
            sizes.length == 1
              ? !sizes[0].items.length
              : sizes.some((size) => !size.name || !size.items.length)
          }
          onClick={submit}
        />
      </div>
    </>
  );
};

export default SecondPage;

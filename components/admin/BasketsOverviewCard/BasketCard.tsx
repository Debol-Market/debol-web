import { Basket } from '@/utils/types';
import Link from 'next/link';

type props = {
  remove: () => void;
  basket: Basket & { id: string };
};

const BasketCard = ({ basket, remove }: props) => {
  return (
    <Link href={`/admin/baskets/${basket.id}`}>
      <div className="min-h-[150px] border-2 border-gray-100 hover:bg-neutral-50 min-w-[180px] px-6 py-4 bg-white  rounded-sm flex gap-3">
        <div className="">
          <h1 className="text-2xl py-2">{basket.name}</h1>
          {basket.sizes.map((size, i) => (
            <p className="text-sm font-mono text-slate-600" key={i}>
              {size.name} - ${size.price / 100}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BasketCard;

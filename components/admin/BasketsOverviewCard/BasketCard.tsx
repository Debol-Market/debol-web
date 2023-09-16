import { Basket } from '@/utils/types';
import Link from 'next/link';

type props = {
  remove: () => void;
  basket: Basket & { id: string };
};

const BasketCard = ({ basket, remove }: props) => {
  return (
    <Link href={`/admin/baskets/${basket.id}`}>
      <div className="min-h-[150px] hover:bg-slate-100 min-w-[180px] px-6 py-4 bg-white shadow rounded-md flex gap-3">
        <div className="">
          <h1 className="text-2xl">{basket.name}</h1>
          {basket.sizes.map((size, i) => (
            <p className="text-slate-600" key={i}>
              {size.name} - ${size.price / 100}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BasketCard;

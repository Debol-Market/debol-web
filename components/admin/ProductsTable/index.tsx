import { rtdb } from '@/services/firebase';
import { onValue, ref } from 'firebase/database';
import { FC, useEffect, useState } from 'react';
import { Product } from '../../../utils/types';

const ProductsTable = () => {
  const [data, setData] = useState<(Product & { id: string })[]>([]);

  useEffect(() => {
    const sub = onValue(ref(rtdb, "products/"), (snap) => {
      if (snap.val() && snap.exists())
        setData(
          Object.entries(snap.val()).map(([productId, product]) => ({
            id: productId,
            ...(product as Product),
          }))
        );
    });

    return () => sub();
  }, []);
  return (
    <div className="relative overflow-auto w-full shadow-md sm:rounded-lg">
      <table className="table-auto w-full text-sm max-h-[80vh]  min-w-[720px] text-left text-gray-500 dark:text-gray-300">
        <thead className="text-2xs text-slate-600 uppercase bg-gray-400 dark:bg-gray-800/90 dark:text-gray-400">
          <tr>
            <th scope="col" className="pl-3 py-3">
              Name
            </th>
            <th scope="col" className="pl-3 py-3">
              Vendor
            </th>
            <th scope="col" className="pl-3 py-3">
              Catagory
            </th>
            <th scope="col" className="pl-3 py-3">
              Unit
            </th>            <th scope="col" className="pl-3 py-3">
              Price
            </th>
            <th scope="col" className="pl-3 py-3">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="">
          {data.map((item, i) => (
            <TableRow
              key={i}
              product={item}
            />
          ))}
        </tbody>
      </table>

    </div>
  );
};

const TableRow: FC<{ product: Product }> = ({
  product,
}) => {
  return (
    <tr
      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="pl-3 py-2">{product.name}</td>
      <td className="pl-2 py-2">{product.vendor}</td>
      <td className="pl-2 py-2">{product.catagories}</td>
      <td className="pl-2 py-2">{product.unit}</td>
      <td className="pl-2 py-2">{product.price}</td>
      <td className="pl-2 py-2">{product.created_at}</td>
    </tr>
  );
};

export default ProductsTable;
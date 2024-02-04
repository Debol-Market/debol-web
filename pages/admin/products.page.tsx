import CreateProductModal from "@/components/CreateProductModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import firebaseAdmin from "@/services/firebase-admin";
import { getUrl } from "@/services/storage";
import { Product } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = async () => {
  const productsRef = await firebaseAdmin
    .firestore()
    .collection("products")
    .get();

  const products = productsRef.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as Product,
  );

  return {
    props: { products },
  };
};

export default function Component({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useAdmin();
  return (
    <div className="grid w-full overflow-hidden rounded-lg shadow-lg">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:gap-8">
          <div className="flex justify-between gap-2 mt-6 mx-6">
            <h1 className="font-semibold text-3xl">Products</h1>
            <CreateProductModal includeImage>
              <Button size="sm" className="bg-primary text-gray-50">
                Add product
              </Button>
            </CreateProductModal>
          </div>
          <div className="border shadow-sm rounded-lg mx-3 md:mx-7 overflow-auto">
            <div className="min-w-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead className="max-w-[120px]">Name</TableHead>
                    <TableHead className="w-20">Price</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((prod) => (
                    <ProductRow product={prod} key={prod.id} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductRow = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { data, status } = useQuery({
    queryKey: ["getProductImage", product.id],
    queryFn: () => getUrl(product.image),
    enabled: !!product.image,
  });

  return (
    <TableRow onClick={() => router.push(`/product/${product.id}`)}>
      <TableCell>
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-square">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <Skeleton className="rounded-lg overflow-hidden w-full aspect-square" />
        )}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>${product.price / 100}</TableCell>
      <TableCell>
        <p className="text-sm text-gray-500 truncate">{product.description}</p>
      </TableCell>
      <TableCell className="flex items-center gap-2 flex-col sm:flex-row">
        <Button size="icon" variant="outline">
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button size="icon" variant="outline">
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

function PencilIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

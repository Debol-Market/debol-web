import AddSizeModal from "@/components/admin/basket/AddSizeModal";
import EditBasketModal from "@/components/admin/basket/EditBasketModal";
import SizeCard from "@/components/admin/basket/SizeCard";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBasket } from "@/services/database";
import firebaseAdmin from "@/services/firebase-admin";
import { Basket } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineAddCircleOutline, MdOutlineArrowBack } from "react-icons/md";

export const getServerSideProps = (async (context) => {
  // @ts-ignore
  const basketId = context.params.basketId as string;
  const basketRef = await firebaseAdmin
    .database()
    .ref(`baskets/${basketId}`)
    .get();

  if (!basketRef.val() || !basketRef.exists()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const basket = { ...(basketRef.val() as Basket), id: basketId };
  const basketImage = await firebaseAdmin
    .storage()
    .bucket("debolpackages.appspot.com")
    .file(basket.image)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 3600,
    });

  return { props: { basket, image: basketImage[0] } };
}) satisfies GetServerSideProps<{
  basket: Basket & { id: string };
  image: string;
}>;

const Page = ({
  basket,
  image,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAdmin();
  const router = useRouter();
  const { basketId } = router.query;
  const [addSize, setSizeAdd] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-200 py-4 px-8 md:px-12 ">
      <Link href="/admin/baskets">
        <div className="flex justify-start my-4">
          <MdOutlineArrowBack size={30} />
        </div>
      </Link>
      <div className="p-6 shadow-lg rounded-xl bg-white gap-8 flex flex-col md:flex-row">
        <div className="border shadow-xl overflow-hidden  aspect-square h-[240px] rounded-2xl">
          <img src={image} alt="" className="object-cover h-full w-full" />
        </div>
        <div className="flex flex-col md:flex-row grow justify-between gap-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{basket.name}</h1>
            <p className="text-slate-600">Description: {basket.description}</p>
            <p className="text-slate-600">Catagory: {basket.catagory}</p>
          </div>
          <div className="flex flex-row md:flex-col gap-6">
            <EditBasketModal basket={basket} img={image}
          onSave={() => router.push(router.asPath)}
            ><Button size="icon" variant="outline">
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button></EditBasketModal>
            <DelBtn basketId={basketId as string} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-start my-8 rounded-xl">
        {basket.sizes.map((size) => (
          <SizeCard
            key={size.id}
            size={size}
            onEdit={() => {
              setModalOpen(true);
            }}
            length={basket.sizes.length}
            setBasket={() => {}}
          />
        ))}
        <button
          className="grow p-5 bg-white rounded-xl shadow max-w-xs flex justify-center items-center opacity-40"
          onClick={() => {
            setSizeAdd(true);
          }}
        >
          <MdOutlineAddCircleOutline size={150} />
        </button>
      </div>
      {addSize && (
        <AddSizeModal
          setBasket={() => {}}
          closeModal={() => setSizeAdd(false)}
        />
      )}
    </div>
  );
};

const DelBtn = ({ basketId }: { basketId: string }) => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => deleteBasket(basketId as string),
    onSuccess() {
      router.push("/");
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => mutate()}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Page;

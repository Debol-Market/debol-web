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
import { updateBasket } from "@/services/database";
import { Item, Size } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Loader2, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ItemModal from "../BasketModal/ItemModal";
import EditSizeModal from "./EditSizeModal";
import EditItemModal from "./EditItemModal";

type props = {
  size: Size;
  sizes: Size[];
  basketId: string;
  onEdit: () => void;
};

const SizeCard = ({ size, sizes, basketId }: props) => {
  const router = useRouter();
  const [addItemModal, setAddItemModal] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async (item: Item) => {
      await updateBasket(
        {
          // @ts-ignore
          sizes: sizes.map((s) =>
            s.id != size.id
              ? s
              : {
                  ...s,
                  items: [...s.items, item],
                },
          ),
        },
        basketId,
      );
    },
    onSuccess: () => router.push(router.asPath),
  });

  const delMutation = useMutation({
    mutationFn: async (i: number) => {
      await updateBasket(
        {
          // @ts-ignore
          sizes: sizes.map((s) =>
            s.id != size.id
              ? s
              : {
                  ...s,
                  items: s.items.filter((_, ind) => ind != i),
                },
          ),
        },
        basketId,
      );
    },
    onSuccess: () => router.push(router.asPath),
  });
  const updateItem = async (item: Item, index: number) => {
    await updateBasket(
      {
        sizes: sizes.map((s) =>
          s.id != size.id
            ? s
            : {
                ...s,
                items: s.items.map((it, i) => (i == index ? item : it)),
              },
        ),
      },
      basketId,
    );
  };

  return (
    <div className="grow p-4 bg-white rounded-xl shadow max-w-sm gap-3 min-w-[260px] w-full relative">
      <div className="absolute top-4 right-4 gap-4">
        <EditSizeModal
          size={size}
          onCancel={() => {}}
          basketId={basketId}
          sizes={sizes}
        />
        {sizes.length > 1 && (
          <DelBtn basketId={basketId} sizes={sizes} sizeId={size.id} />
        )}
      </div>
      <p className="text-slate-600 m-2 text-lg font-bold">Name : {size.name}</p>
      <p className="text-slate-600 m-2">Price: {size.price / 100}</p>
      {size.items.map((item, index) => (
        <div className="flex flex-col mb-2" key={index}>
          <ItemCard
            item={item}
            key={item.name}
            mutate={() => delMutation.mutate(index)}
            isLoading={delMutation.isLoading}
            length={size.items.length}
            updateItem={(item: Item) => updateItem(item, index)}
          />
        </div>
      ))}
      <button
        onClick={() => setAddItemModal(true)}
        className="flex w-full justify-center border border-gray-400 rounded-lg px-3 py-2 opacity-70"
      >
        <MdOutlineAddCircleOutline size={36} />
      </button>
      {addItemModal && (
        <ItemModal
          items={size.items}
          setOpen={(o) => {
            if (!isLoading) setAddItemModal(o);
          }}
          setItems={(items: Item[]) => mutate(items.at(-1)!)}
        />
      )}
    </div>
  );
};

const ItemCard = ({
  item,
  length,
  updateItem,
  mutate,
  isLoading,
}: {
  item: Item;
  length: number;
  isLoading: boolean;
  mutate: () => void;
  updateItem: (item: Item) => Promise<void>;
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
        <EditItemModal item={item} updateItem={updateItem} />
        {length > 1 && (
          <ItemDelBtn delItem={() => mutate()} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

const ItemDelBtn = ({
  delItem,
  isLoading,
}: {
  delItem: () => any;
  isLoading: boolean;
}) => {
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
            onClick={() => delItem()}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DelBtn = ({
  basketId,
  sizes,
  sizeId,
}: {
  basketId: string;
  sizeId: string;
  sizes: Size[];
}) => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: async () =>
      updateBasket({ sizes: sizes.filter((s) => s.id != sizeId) }, basketId),
    onSuccess() {
      router.push(router.asPath);
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
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SizeCard;

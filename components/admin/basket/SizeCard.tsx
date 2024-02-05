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
import { Size } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { Loader2, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ItemCard from "../BasketModal/ItemCard";
import EditSizeModal from "./EditSizeModal";

type props = {
  size: Size;
  sizes: Size[];
  basketId: string;
  onEdit: () => void;
};

const SizeCard = ({ size, sizes, basketId }: props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

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
            key={item.name}
            item={item}
            editItem={() => {
              setSelectedIndex(index);
            }}
            deleteItem={() => {
              setSelectedIndex(index);
            }}
            index={index}
          />
        </div>
      ))}
      <div className="flex justify-center border border-slate-400 rounded-lg px-3 py-2 opacity-50">
        <MdOutlineAddCircleOutline size={50} />
      </div>
    </div>
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

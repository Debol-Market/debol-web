import Btn from "@/components/Btn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { rtdb } from "@/services/firebase";
import { Size } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ref, update } from "firebase/database";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Input from "../../Input";

type props = {
  basketId: string;
  size: Size;
  sizes: Size[];
  onCancel: () => void;
};
const schema = z.object({
  name: z.string().min(1, "Name is Required"),
  description: z.string().optional(),
  price: z.number().gt(0, "Price must be greater than 0"),
});

type FormType = z.infer<typeof schema>;

function EditSizeModal({ size, basketId, onCancel, sizes }: props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      name: size.name,
      price: size.price / 100,
      description: size.description,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormType> = async ({
    name,
    price,
    description,
  }) => {
    await update(ref(rtdb, `baskets/${basketId}`), {
      sizes: sizes.map((s) =>
        s.id == size.id ? { ...s, name, description, price: price * 100 } : s,
      ),
    });
    setIsOpen(false);
    router.push(router.asPath);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
        if (!o && onCancel) onCancel();
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Size</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="flex flex-col grow gap-4">
              <Input
                {...register("name")}
                label="Name"
                error={errors.name?.message}
              />
              <div className="group flex text-sm flex-col">
                <label className="text-gray-700 group-focus-within:text-emerald-900 font-medium ">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="py-2 px-3 focus:outline-none border shadow-lg border-gray-800 group-focus-within:border-emerald-800 rounded-md w-auto min-w-0 "
                />
              </div>
              <Input
                {...register("price", {
                  required: "Add a price",
                  setValueAs: (v) => (v == "" ? undefined : Number(v)),
                })}
                label="Price"
                type="number"
                error={errors.price?.message}
              />
              <div className="flex justify-between mt-auto">
                <DialogClose asChild>
                  <button className="bg-gray-200 px-4 py-3 rounded-lg font-medium">
                    Cancel
                  </button>
                </DialogClose>
                <Btn label="Save" isLoading={isSubmitting} type="submit" />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSizeModal;

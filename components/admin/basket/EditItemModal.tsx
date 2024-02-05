import Btn from "@/components/Btn";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Item } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Input from "../../Input";
import UnitInput from "../UnitInput";

type Props = {
  item: Item;
  updateItem: (item: Item) => Promise<void>;
};

const schema = z.object({
  name: z.string(),
  unit: z.string(),
  quantity: z.number(),
  pricePerUnit: z.number(),
});

const EditItemModal = ({ updateItem, item }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Item>({
    resolver: zodResolver(schema),
    defaultValues: { ...item, pricePerUnit: item.pricePerUnit / 100 },
  });

  const onSubmit: SubmitHandler<Item> = async (data) => {
    await updateItem({ ...data, pricePerUnit: data.pricePerUnit * 100 });
    router.push(router.asPath);
    setIsOpen(false)
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-full max-w-2xl overflow-auto px-3 sm:p-6">
        <DialogTitle>Edit Item</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            {...register("name")}
            label="Name"
            error={errors.name?.message}
          />
          <Controller
            control={control}
            name="unit"
            render={({ field: { onChange, value } }) => (
              <UnitInput setUnit={(u) => onChange(u)} unit={value} />
            )}
          />
          <Input
            {...register("pricePerUnit", { valueAsNumber: true })}
            label="Price"
            type="number"
            error={errors.pricePerUnit?.message}
          />
          <Input
            {...register("quantity", { valueAsNumber: true })}
            label="Qty"
            type="number"
            error={errors.quantity?.message}
          />
          <div className="flex justify-between mt-auto">
            <DialogClose asChild>
              <button className="bg-gray-200 px-4 py-3 rounded-lg font-medium">
                Cancel
              </button>
            </DialogClose>
            <Btn label="save" isLoading={isSubmitting} type="submit" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;

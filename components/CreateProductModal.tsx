import useApp from "@/services/appContext";
import { firestore } from "@/services/firebase";
import { getDefaultBasketImages, getImageUrl } from "@/services/storage";
import { compressImage } from "@/utils/compressImage";
import { Product } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { StorageReference } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ZodType, z } from "zod";
import Btn from "./Btn";
import Input from "./Input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

type Props = {
  children: React.ReactElement;
  onSave?: (product: Product) => any;
  includeImage?: boolean;
  onCancel?: VoidFunction;
};

const schema = z.object({
  name: z.string().min(1, "Name is Required"),
  description: z.string().optional(),
  image: z
    .any()
    .refine((files: FileList) =>
      files.length
        ? ["image/png", "image/jpeg", "image/webp"].includes(files[0].type)
        : true,
    ) as ZodType<FileList>,

  price: z.number().gt(0, "Price must be greater than 0"),
});

type FormType = z.infer<typeof schema>;

const CreateProductModal = ({
  children,
  onSave,
  onCancel,
  includeImage,
}: Props) => {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);
  const { data } = useQuery({
    queryFn: getDefaultBasketImages,
    queryKey: ["defaultBasketImages"],
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    if (includeImage && !imageUrl)
      return setError("image", { message: "Image is required" });

    const product: Omit<Product, 'id'>  = {
      name: data.name,
      price: data.price * 100,
      image: selectedImage || "",
      catagories: [],
      description: data.description ?? '',
      created_at: Date.now(),
    }

    const docRef = await addDoc(collection(firestore, "products"), product);

    if (!selectedImage) {
      const file = await compressImage(data.image[0]);
      const token = await user!.getIdToken(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("obj", JSON.stringify({ productId: docRef.id }));

      await fetch("/api/upload-product-img", {
        method: "POST",
        headers: {
          authorization: `bearer ${token}`,
        },
        body: formData,
      });
    }
    reset()
    setSelectedImage('')
    setImageUrl('')
    if (onSave)
      onSave({
        id: docRef.id,
        ...product   
    });
    setIsOpen(false);
  };

  useEffect(() => {
    return watch((val) => {
      if (val.image?.length) {
        setSelectedImage("");
        setImageUrl(URL.createObjectURL(val.image[0]));
      }
    }).unsubscribe;
  }, [watch]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
        if (!o && onCancel) onCancel();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-full max-w-2xl overflow-auto px-3 sm:p-6">
        <DialogTitle>Add New Product.</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row gap-4">
            {includeImage && (
              <div className="flex flex-col w-full sm:w-64">
                <div className="hidden" ref={imageInput}>
                  <input
                    type="file"
                    {...register("image", {})}
                    accept="image/png, image/jpeg, image/webp,"
                  />
                </div>
                <div
                  className={`${
                    imageUrl
                      ? "bg-primary"
                      : errors.image
                        ? "bg-red-400"
                        : "bg-neutral-200"
                  } rounded-lg p-1 shadow-lg h-64 w-full mx-auto shrink-0 mb-1`}
                  role="button"
                  onClick={() =>
                    (imageInput.current?.children[0] as HTMLElement).click()
                  }
                >
                  <div className="bg-white h-full w-full flex items-center justify-center flex-col rounded-lg overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        loading="lazy"
                        alt=""
                        width={200}
                        height={200}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <>
                        <IoCloudUploadOutline
                          size={52}
                          className="text-neutral-500"
                        />
                        <p className="font-medium text-neutral-600 mx-4 text-center mt-3">
                          {"Upload or Select basket Image"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-700">{errors.image.message}</p>
                )}
                <div className=" overflow-auto w-full max-w-[calc(100vw-24px)] mt-2">
                  <div className="flex gap-3 shrink-0">
                    {data?.map((img) => (
                      <ImageCard
                        image={img}
                        key={img.name}
                        onClick={(url) => {
                          setImageUrl(url);
                          setSelectedImage(img.fullPath);
                        }}
                        selected={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-col grow">
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
                <Btn label="save" isLoading={isSubmitting} type="submit" />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ImageCard = ({
  image,
  selected,
  onClick,
}: {
  image: StorageReference;
  selected: boolean;
  onClick: (url: string) => void;
}) => {
  const { data: url } = useQuery({
    queryFn: () => getImageUrl(image),
    queryKey: ["basketImageURL", image.name],
  });

  if (!url) return <></>;
  return (
    <div
      className={`w-24 h-24 overflow-hidden rounded shrink-0 ${
        selected ? "border-emerald-600 border-2 shadow" : ""
      }`}
      onClick={() => onClick(url)}
    >
      <Image
        src={url}
        alt=""
        className="w-full h-full object-cover"
        width={96}
        height={96}
      />
    </div>
  );
};

export default CreateProductModal;

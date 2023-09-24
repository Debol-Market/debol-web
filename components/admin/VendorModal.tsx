import { createVendor } from "@/services/database";
import { uploadVendorLogo } from "@/services/storage";
import { Vendor } from "@/utils/types";
import { useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import Btn from "../Btn";
import Input from "../Input";
import Overlay from "../Overlay";

type props = {
  onSubmit: (vendor: Vendor & { id: string }) => void;
  onClose: VoidFunction;
};

const VendorModal = ({ onSubmit, onClose }: props) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<File>();
  const [banners, setBanners] = useState<File[]>([]);
  const imgRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const vendor: Vendor = {
      name,
      addresses: [address],
    };
    setIsLoading(true);
    const { key } = await createVendor(vendor);
    await uploadVendorLogo(key, logo);
    setIsLoading(false);
    onSubmit({ ...vendor, id: key });
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <div
        className="rounded-lg bg-white w-full max-w-sm shadow py-6 px-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold text-slate-500 mb-3">Add Vendor</h1>
        <input
          type="file"
          name=""
          multiple
          id=""
          onChange={(e) => {
            if (e.target.files[0]) setLogo(e.target.files[0]);
          }}
          accept="image/*"
          className="hidden"
          ref={imgRef}
        />
        <div
          className={`rounded-lg overflow-hidden border-2 
            border-neutral-400 ${
              logo ? "" : "border-dashed hover:border-solid"
            } h-36 w-36 bg-neutral-100 flex flex-col items-center justify-center shrink-0 cursor-pointer mx-auto relative`}
          onClick={() => {
            if (!logo) imgRef.current?.click();
          }}
        >
          {logo ? (
            <>
              <img
                src={URL.createObjectURL(logo)}
                className="h-full w-full object-cover"
                alt=""
              />
              <div
                className="absolute bottom-0 left-0 bg-red-500 p-2 m-2 rounded-full text-white hover:shadow-md hover:brightness-110 cursor-pointer"
                role="button"
                title="Delete"
                onClick={() => setLogo(null)}
              >
                <AiOutlineDelete />
              </div>
              <div
                className="absolute bottom-0 right-0 bg-amber-500 p-2 m-2 rounded-full text-white hover:shadow-md hover:brightness-110 cursor-pointer"
                role="button"
                title="Change"
                onClick={() => imgRef.current?.click()}
              >
                <BiRefresh />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-neutral-600">Add Images</h2>
              <p className="text-neutral-500 text-center text-sm">
                Click to add images here
              </p>
            </>
          )}
        </div>
        <Input
          label="Name"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Address(Optional)"
          defaultValue={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Btn
          type="submit"
          label="Submit"
          className="mt-4"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!logo || !name}
        />
      </div>
    </Overlay>
  );
};

export default VendorModal;

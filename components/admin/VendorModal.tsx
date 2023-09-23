import { createVendor } from "@/services/database";
import { Vendor } from "@/utils/types";
import { useState } from "react";
import Btn from "../Btn";
import Input from "../Input";
import Overlay from "../Overlay";

type props = {
  onSubmit: (vendor: Vendor & { id: string }) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const VendorModal = ({ onSubmit, setOpen }: props) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const vendor: Vendor = {
      name,
      addresses: [address],
    };
    const ref = await createVendor(vendor);
    onSubmit({ ...vendor, id: ref.key });
    setOpen(false);
  };

  return (
    <Overlay onClick={() => setOpen(false)}>
      <div
        className="rounded-lg bg-white w-full max-w-sm shadow py-6 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          label="Name"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Address"
          defaultValue={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Btn type="submit" label="Submit" onClick={handleSubmit} />
      </div>
    </Overlay>
  );
};

export default VendorModal;

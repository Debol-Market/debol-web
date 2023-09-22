import { isPhoneValid } from "@/pages/register";
import useApp from "@/services/appContext";
import { FC, FormEventHandler, useState } from "react";
import Btn from "./Btn";
import Overlay from "./Overlay";
import PhoneField from "./PhoneField";

type props = {
  onClose: VoidFunction;
};

const CheckoutModal: FC<props> = ({ onClose }) => {
  const { user } = useApp();
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const isValid1 = isPhoneValid(phone1);
  const isValid2 = isPhoneValid(phone2);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: add loading to btn
  const { basketCart, productCart } = useApp();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    const token = await user.getIdToken(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          productCart,
          basketCart,
          name,
          phone1,
          phone2,
        }),
      });
      const { url } = await res.json();
      setIsLoading(false);
      window.location = url;
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Overlay onClick={onClose}>
      <div
        className="bg-white max-w-md w-full shadow flex flex-col rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form action="" onSubmit={onSubmit} className="px-8 py-8 flex flex-col">
          <h1 className="text-lg sm:text-2xl font-semibold">
            Enter Shipping Information
          </h1>
          <label
            htmlFor="name"
            className="text-xs font-bold text-neutral-600 mt-4 mb-0.5"
          >
            Name of Receiver
          </label>
          <input
            placeholder="John Doe"
            value={name}
            name="name"
            className="border border-neutral-300 rounded-md p-2 px-4 w-full focus:border-blue-500 shadow-sm placeholder:text-neutral-400"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="text-xs font-bold text-neutral-600 mt-4 mb-0.5">
            Phone Number
          </label>
          <PhoneField
            label="Phone Number"
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
            onChange={(value) => setPhone1(value)}
          />
          <p className="text-red-600 text-sm mb-2 mt-1">
            {!isValid1 && !isFocused1! && phone1 != "+251 "
              ? "Phone Number is not valid."
              : null}
          </p>
          <label className="text-xs font-bold text-neutral-600 mt-4 mb-0.5">
            Phone Number 2(Optional)
          </label>
          <PhoneField
            label="Phone Number 2"
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            onChange={(value) => setPhone2(value)}
          />
          <Btn
            label="Next"
            type="submit"
            className="mt-6"
            isLoading={isLoading}
            disabled={!isValid1 || !name}
          />
        </form>
      </div>
    </Overlay>
  );
};

export default CheckoutModal;

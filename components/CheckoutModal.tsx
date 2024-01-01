import useApp from "@/services/appContext";
import { isPhoneValid } from "@/utils/phone";
import { FC, FormEventHandler, useState } from "react";
import { CiDollar } from "react-icons/ci";
import { IoStorefrontOutline } from "react-icons/io5";
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
  const [paymentMethod, setPaymenMethod] = useState<"chapa" | "stripe">(
    "stripe",
  );

  // TODO: add loading to btn
  const { basketCart, } = useApp();

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
          basketCart,
          name,
          phone1,
          phone2,
          paymentMethod,
        }),
      });
      const { url } = await res.json();
      setIsLoading(false);
      if (res.ok) window.location = url;
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
          <div className="flex gap-3 justify-evenly mt-4 ">
            <button
              type="button"
              className={`flex flex-col items-center flex-1 gap-2 p-3 text-gray-800 ${
                paymentMethod === "stripe"
                  ? "border-gray-900 shadow-lg bg-emerald-50"
                  : "border-gray-300 shadow"
              } rounded border`}
              onClick={() => setPaymenMethod("stripe")}
            >
              <CiDollar size={32} />
              <p className="text-sm font-medium">International</p>
            </button>
            <button
              type="button"
              className={`flex flex-col items-center flex-1 gap-2 p-3 text-gray-800 ${
                paymentMethod === "chapa"
                  ? "border-gray-900 shadow-lg bg-emerald-50"
                  : "border-gray-300 shadow"
              } rounded border`}
              onClick={() => setPaymenMethod("chapa")}
            >
              <IoStorefrontOutline size={32} />
              <p className="text-sm font-medium">Local</p>
            </button>
          </div>
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

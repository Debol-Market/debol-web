import useApp from "@/services/appContext";
import { PaymentData } from "@/utils/types";
import { FC, FormEventHandler, useState } from "react";
import Btn from "./Btn";
import Overlay from "./Overlay";
import PhoneField from "./PhoneField";

type props = {
  onClose: VoidFunction;
};

const CheckoutModal: FC<props> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: add loading to btn
  const { cart, removeFromCart, setCartItemQty } = useApp();
  const total = cart.reduce(
    (prev, item) => prev + item.item.price * item.qty,
    0
  );

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          basketId: item.basketId,
          sizeId: item.item.id,
          qty: item.qty,
        })) as PaymentData[],
        name,
        phone1,
        phone2,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        setIsLoading(false);
        window.location = url;
      })
      .catch((e) => {
        setIsLoading(false);
        console.error(e.error);
      });
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
            onChange={(value) => setPhone1(value)}
          />
          <label className="text-xs font-bold text-neutral-600 mt-4 mb-0.5">
            Phone Number 2(Optional)
          </label>
          <PhoneField
            label="Phone Number 2"
            onChange={(value) => setPhone2(value)}
          />
          <Btn
            label="Next"
            type="submit"
            className="mt-6"
            isLoading={isLoading}
            disabled={!phone1 || !name}
          />
        </form>
      </div>
    </Overlay>
  );
};

export default CheckoutModal;

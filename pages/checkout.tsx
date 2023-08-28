import Btn from "@/components/Btn";
import { CartItem } from "@/components/Cart";
import PhoneField from "@/components/PhoneField";
import useApp from "@/services/appContext";
import { PaymentData } from "@/utils/types";
import { FormEventHandler, useState } from "react";

const Page = () => {
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
    <div className="flex items-center justify-center min-h-screen h-full bg-slate-100">
      <div className="w-full max-w-2xl flex md:flex-row flex-col items-center gap-6">
        <div className="grow">
          {cart.length ? (
            cart.map((item) => (
              <CartItem
                cartItem={item}
                key={item.item.id}
                onChange={(qty) => setCartItemQty(item.item.id, qty)}
                onDel={() => removeFromCart(item.item.id)}
              />
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <form
          action=""
          onSubmit={onSubmit}
          className="grow bg-white rounded-xl shadow-lg px-6 py-5 flex flex-col"
        >
          <input
            placeholder="Name of the Recipent"
            value={name}
            className="border border-neutral-300 rounded-md p-2 px-4 w-full focus:border-blue-500"
            onChange={(e) => setName(e.target.value)}
          />
          <PhoneField
            label="Phone Number"
            onChange={(value) => setPhone1(value)}
          />
          <PhoneField
            label="Phone Number 2"
            onChange={(value) => setPhone2(value)}
          />
          <Btn
            label="Next"
            type="submit"
            isLoading={isLoading}
            disabled={!phone1 || !phone2 || !name}
          />
        </form>
      </div>
    </div>
  );
};

export default Page;

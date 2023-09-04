import useApp from "@/services/appContext";
import { getUrl } from "@/services/storage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import ContentLoader from "react-content-loader";
import { AiFillMinusCircle } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { IoAddCircle, IoCloseCircleOutline } from "react-icons/io5";
import { CartItem } from "../utils/types";
import Btn from "./Btn";
import CheckoutModal from "./CheckoutModal";
import Overlay from "./Overlay";

type props = {
  onClose: () => void;
};

const Cart = ({ onClose }: props) => {
  const { user } = useApp();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { cart, removeFromCart, setCartItemQty } = useApp();
  const total = cart.reduce(
    (prev, item) => prev + item.item.price * item.qty,
    0,
  );

  return (
    <Overlay onClick={onClose}>
      <div
        className="z-50 w-full max-w-md bg-white h-full shadow absolute right-0 flex flex-col h-[100dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-16 gap-2 items-center border-b-neutral-300 border-b">
          <button
            onClick={onClose}
            className="p-2 m-2 hover:bg-slate-200/70 rounded-full shrink-0"
          >
            <GrClose className="h-6 w-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold">Your Cart</h2>
        </div>
        <div className="flex flex-col grow">
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
            <p className="p-4 text-xl sm:text-2xl m-auto text-neutral-800/60">
              Your cart is empty
            </p>
          )}
        </div>
        {cart.length > 0 && (
          <div className="flex justify-between p-2 px-4">
            <h2 className="text-lg">Total:</h2>
            <p className="font-bold text-2xl">${total / 100}</p>
          </div>
        )}
        <Btn
          label="Checkout"
          disabled={cart.length == 0}
          className="m-4 mt-2"
          onClick={() => setIsCheckoutModalOpen(true)}
        />
      </div>
      {isCheckoutModalOpen &&
        (user ? (
          <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} />
        ) : (
          <LoginModal onClose={() => setIsCheckoutModalOpen(false)} />
        ))}
    </Overlay>
  );
};

export function CartItem({
  cartItem,
  onDel,
  onChange,
}: {
  cartItem: CartItem;
  onDel: () => void;
  onChange: (qty: number) => void;
}) {
  const [isExpanded, setisExpanded] = useState(false);
  const { data, status } = useQuery({
    queryKey: ["getBasketImage", cartItem.basketId],
    queryFn: () => getUrl(cartItem.basket.image),
  });

  return (
    <div
      className={`flex flex-col px-4 ${isExpanded && "border-b border-neutral-300 bg-neutral-50"
        }`}
      onClick={() => setisExpanded(!isExpanded)}
    >
      <div className="flex py-4 gap-3 items-start">
        <div className="h-24 w-24 border border-neutral-300 rounded-md">
          {status == "success" ? (
            <Image
              src={data}
              alt=""
              height={96}
              width={96}
              className="h-full object-cover"
            />
          ) : (
            <ContentLoader viewBox="0 0 96 96">
              <rect x="0" y="0" rx="3" ry="3" width="96" height="96" />
            </ContentLoader>
          )}
        </div>
        <div className=" grow">
          <h3 className="text-xl">{cartItem.basket.name}</h3>
          <p className="font-bold text-lg">${cartItem.item.price / 100}</p>
          <p className="text-sm">{cartItem.item.name}</p>
          <div
            className="flex gap-2 text-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="" onClick={() => onChange(cartItem.qty - 1)}>
              {cartItem.qty == 1 ? (
                <BiSolidTrashAlt className="h-6 w-6" />
              ) : (
                <AiFillMinusCircle className="h-6 w-6" />
              )}
            </button>
            <span>{cartItem.qty}</span>
            <button onClick={() => onChange(cartItem.qty + 1)}>
              <IoAddCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        <button onClick={onDel}>
          <IoCloseCircleOutline className="h-6 w-6" />
        </button>
      </div>
      {isExpanded && (
        <div className="pb-3 px-2">
          {cartItem.item.items.map((item) => (
            <div className="flex gap-2 justify-between mb-1" key={item.name}>
              <div className="w-[120px]">{item.name}</div>
              <div className="">
                {item.quantity}
                {item.unit} x {item.pricePerUnit / 100}$
              </div>
              <div className="">
                {(item.pricePerUnit / 100) * item.quantity}$
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const LoginModal: FC<{ onClose: VoidFunction }> = ({ onClose }) => {
  const router = useRouter();
  console.log(router)
  return (
    <Overlay onClick={onClose}>
      <div
        className="bg-white p-6 rounded-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl">Register</h2>
        <p className="my-3 text-neutral-800 mb-7">
          You need to Register inorder to Checkout
        </p>
        <Btn
          label="Register"
          onClick={() =>
            router.push(
              `/register?redirect=${encodeURIComponent(router.pathname)}`,
            )
          }
        />
      </div>
    </Overlay>
  );
};

export default Cart;

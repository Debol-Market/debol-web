import useApp from "@/services/appContext";
import convertCurrency from "@/utils/convertCurrency";
import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import Btn from "../Btn";
import CheckoutModal from "../CheckoutModal";
import Overlay from "../Overlay";
import BasketCartItem from "./BasketCartItem";
import LoginModal from "./LoginModal";

type props = {
  onClose: () => void;
};

const Cart = ({ onClose }: props) => {
  const { user, currencyMultiplier, currency } = useApp();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const {
    basketCart,
    basketCartItems,
    removeFromBasketCart,
    setBasketCartItemQty,
  } = useApp();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    basketCart.forEach((cartItem, index) => {
      const size = basketCartItems[index].sizes.find(
        (s) => s.id == cartItem.sizeId,
      );
      total += (size?.price ?? 0) * cartItem.qty;
    });
    setTotal(total);
  }, [basketCart, basketCartItems]);

  return (
    <Overlay onClick={onClose}>
      <div
        className="z-50 w-full max-w-md bg-white h-full shadow absolute right-0 flex flex-col"
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
          {basketCart.length ? (
            basketCart.map((item, index) => (
              <BasketCartItem
                basket={basketCartItems[index]}
                basketItem={item}
                key={item.sizeId}
                onChange={(qty) => setBasketCartItemQty(item.sizeId, qty)}
                onDel={() => removeFromBasketCart(item.sizeId)}
              />
            ))
          ) : (
            <p className="p-4 text-xl sm:text-2xl m-auto text-neutral-800/60">
              Your cart is empty
            </p>
          )}
        </div>
        {basketCart.length > 0 && (
          <div className="flex justify-between p-2 px-4">
            <h2 className="text-lg">Total:</h2>
            <p className="font-bold text-2xl">
              {convertCurrency(total, currencyMultiplier, currency)}
            </p>
          </div>
        )}
        <Btn
          label="Checkout"
          disabled={basketCart.length == 0}
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

export default Cart;

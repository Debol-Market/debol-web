import useApp from "@/services/appContext";
import convertCurrency from "@/utils/convertCurrency";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Btn from "../Btn";
import Overlay from "../Overlay";
import BasketCartItem from "./BasketCartItem";
import ProductCartItem from "./ProductCartItem";

type props = {
  onClose: () => void;
};

const Cart = ({ onClose }: props) => {
  const router = useRouter();
  const { user, currencyMultiplier, currency } = useApp();
  const {
    basketCart,
    basketCartItems,
    removeFromBasketCart,
    setBasketCartItemQty,

    productCart,
    productCartItems,
    removeFromProductCart,
    setProductCartItemQty,
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
    productCart.forEach((cartItem, index) => {
      const product = productCartItems.find((s) => s.id == cartItem.productId);
      total += (product?.price ?? 0) * cartItem.qty;
    });
    setTotal(total);
  }, [basketCart, basketCartItems, productCart, productCartItems]);

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
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold">Your Cart</h2>
        </div>
        <div className="flex flex-col grow">
          {basketCart.length + productCart.length > 0 ? (
            <>
              {basketCart.map((item, index) => (
                <BasketCartItem
                  basket={basketCartItems[index]}
                  basketItem={item}
                  key={item.sizeId}
                  onChange={(qty) => setBasketCartItemQty(item.sizeId, qty)}
                  onDel={() => removeFromBasketCart(item.sizeId)}
                />
              ))}
              {productCart.map((item, index) => (
                <ProductCartItem
                  product={productCartItems[index]}
                  productItem={item}
                  key={item.productId}
                  onChange={(qty) => setProductCartItemQty(item.productId, qty)}
                  onDel={() => removeFromProductCart(item.productId)}
                />
              ))}
            </>
          ) : (
            <p className="p-4 text-xl sm:text-2xl m-auto text-neutral-800/60">
              Your cart is empty
            </p>
          )}
        </div>
        {basketCart.length + productCart.length > 0 && (
          <>
            <div className="flex text-sm justify-between items-end  p-4 ">
              <h2 className="">Service fee(25%):</h2>
              <p className="font-base font-mono">
                {convertCurrency(total * 0.25, currencyMultiplier, currency)}
              </p>
            </div>
            <div className="flex justify-between items-end pb-2 px-4">
              <h2 className="text-lg font-semibold">Total:</h2>
              <p className="font-semibold text-2xl font-mono ">
                {convertCurrency(total * 1.25, currencyMultiplier, currency)}
              </p>
            </div>
          </>
        )}
        <Btn
          label="Checkout"
          disabled={basketCart.length + productCart.length == 0}
          className="m-4 mt-2"
          onClick={() => {
            if (!user)
              router.push(
                `/register?redirect=${encodeURIComponent("/checkout")}`,
              );
            else router.push("/checkout");
          }}
        />
      </div>
    </Overlay>
  );
};

export default Cart;

import { Basket, CartItem, Size } from "@/utils/types";
import useLocalStorage from "@/utils/useLocalStorage";
import { createContext, useContext, useEffect } from "react";
import { getBasket } from "./database";

type ContextType = {
  cart: CartItem[];
  removeFromCart: (sizeId: string) => void;
  setCartItemQty: (sizeId: string, qty: number) => void;
  addToCart: (
    size: Size,
    qty: number,
    basketId: string,
    basket: Basket
  ) => void;
};

type props = {
  children: JSX.Element | JSX.Element[];
};

export const appContext = createContext<ContextType>({
  cart: [],
  addToCart: () => {},
  setCartItemQty: () => {},
  removeFromCart: () => {},
});

export const AppContext = ({ children }: props) => {
  const [cart, updateCart, clearCart] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = (
    size: Size,
    qty: number,
    basketId: string,
    basket: Basket
  ) => {
    if (cart.some((item: CartItem) => item.item.id == size.id)) return;
    updateCart([...cart, { item: size, basketId, qty, basket }]);
  };

  const removeFromCart = (sizeId: string) => {
    updateCart(cart.filter((item) => item.item.id != sizeId));
  };

  const setCartItemQty = (sizeId: string, qty: number) => {
    if (qty == 0) return removeFromCart(sizeId);

    updateCart(
      cart.map((item) => (item.item.id == sizeId ? { ...item, qty } : item))
    );
  };

  useEffect(() => {
    if (!cart.length) return;
    Promise.all(cart.map((item) => getBasket(item.basketId))).then(
      (baskets) => {
        const newCart: CartItem[] = [];
        console.log(baskets, 123454);
        baskets.forEach((basket) => {
          if (!basket) return;
          console.log({ basket });
          basket.sizes.forEach((size) => {
            const dbSize = cart.find((cartItem) => cartItem.item.id == size.id);
            console.log({ dbSize });
            if (!dbSize) return;
            if (newCart.find((item) => item.item.id == dbSize.item.id)) return;
            newCart.push({ ...dbSize, item: size, basket });
          });
        });
        console.log({ newCart });
        clearCart();
        updateCart(newCart);
      }
    );
  }, []);

  return (
    <appContext.Provider
      value={{ cart, addToCart, removeFromCart, setCartItemQty }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

import { Basket, CartItem, Size } from "@/utils/types";
import useLocalStorage from "@/utils/useLocalStorage";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getBasket } from "./database";
import { auth } from "./firebase";

type ContextType = {
  user?: User;
  cart: CartItem[];
  removeFromCart: (sizeId: string) => void;
  clearCart: () => void;
  setCartItemQty: (sizeId: string, qty: number) => void;
  onAuthChange: (user: User | null) => Promise<void>;
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
  clearCart: () => {},
  setCartItemQty: () => {},
  removeFromCart: () => {},
  onAuthChange: async (user) => {},
});

export const AppContext = ({ children }: props) => {
  const [user, setUser] = useState<User>();
  const [cart, updateCart, clearCart] = useLocalStorage<CartItem[]>("cart", []);

  const onAuthChange = useCallback(async (user: User | null) => {
    if (!user) {
      setUser(undefined);
      return;
    }
    setUser(user);
  }, []);

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
    const sub = onAuthStateChanged(auth, onAuthChange);

    return sub();
  }, []);

  return (
    <appContext.Provider
      value={{
        user,
        clearCart,
        cart,
        addToCart,
        removeFromCart,
        setCartItemQty,
        onAuthChange,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

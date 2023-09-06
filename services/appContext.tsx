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
import { getBasket, getCurrencyMulti } from "./database";
import { auth } from "./firebase";

type ContextType = {
  user?: User;
  currency: string;
  currencyMultiplier: number;
  setCurrency: (currency: string) => void;
  isLoading: boolean;
  cart: CartItem[];
  removeFromCart: (sizeId: string) => void;
  clearCart: () => void;
  setCartItemQty: (sizeId: string, qty: number) => void;
  onAuthChange: (user: User | null) => Promise<void>;
  addToCart: (
    size: Size,
    qty: number,
    basketId: string,
    basket: Basket,
  ) => void;
};

type props = {
  children: JSX.Element | JSX.Element[];
};

export const appContext = createContext<ContextType>({
  cart: [],
  currency: "USD",
  currencyMultiplier: 1,
  setCurrency: () => {},
  isLoading: true,
  addToCart: () => {},
  clearCart: () => {},
  setCartItemQty: () => {},
  removeFromCart: () => {},
  onAuthChange: async (user) => {},
});

export const AppContext = ({ children }: props) => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1);
  const [cart, updateCart, clearCart] = useLocalStorage<CartItem[]>("cart", []);
  const [currency, setCurrency] = useLocalStorage<string>("currency", "USD");

  const onAuthChange = useCallback(async (user: User | null) => {
    setUser(user ?? undefined);
    setIsLoading(false);
  }, []);

  const addToCart = (
    size: Size,
    qty: number,
    basketId: string,
    basket: Basket,
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
      cart.map((item) => (item.item.id == sizeId ? { ...item, qty } : item)),
    );
  };

  useEffect(() => {
    if (currency !== "USD")
      getCurrencyMulti(currency).then(setCurrencyMultiplier);
    else setCurrencyMultiplier(1);
  }, [currency]);

  useEffect(() => {
    setIsLoading(true);
    const sub = onAuthStateChanged(auth, onAuthChange);

    if (cart.length)
      Promise.all(cart.map((item) => getBasket(item.basketId))).then(
        (baskets) => {
          const newCart: CartItem[] = [];
          baskets.forEach((basket) => {
            if (!basket) return;
            basket.sizes.forEach((size) => {
              const dbSize = cart.find(
                (cartItem) => cartItem.item.id == size.id,
              );
              if (!dbSize) return;
              if (newCart.find((item) => item.item.id == dbSize.item.id))
                return;
              newCart.push({ ...dbSize, item: size, basket });
            });
          });
          clearCart();
          updateCart(newCart);
        },
      );

    return () => sub();
  }, []);

  return (
    <appContext.Provider
      value={{
        user,
        cart,
        currency,
        addToCart,
        clearCart,
        isLoading,
        setCurrency,
        currencyMultiplier,
        onAuthChange,
        setCartItemQty,
        removeFromCart,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

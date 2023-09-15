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
  cart: CartItem[];
  currency: string;
  isLoading: boolean;
  currencyMultiplier: number;
  isAdmin: boolean;
  clearCart: () => void;
  setIsAdmin: (boolean) => void;
  setCurrency: (currency: string) => void;
  removeFromCart: (sizeId: string) => void;
  onAuthChange: (user: User | null) => Promise<void>;
  setCurrencyMultiplier: (multiplier: number) => void;
  setCartItemQty: (sizeId: string, qty: number) => void;
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
  isLoading: true,
  currencyMultiplier: 1,
  isAdmin: false,
  addToCart: () => {},
  clearCart: () => {},
  setIsAdmin: () => {},
  setCurrency: () => {},
  setCartItemQty: () => {},
  removeFromCart: () => {},
  setCurrencyMultiplier: () => {},
  onAuthChange: async (user) => {},
});

export const AppContext = ({ children }: props) => {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1);
  const [currency, setCurrency] = useLocalStorage<string>("currency", "USD");
  const [cart, updateCart, clearCart] = useLocalStorage<CartItem[]>("cart", []);

  const onAuthChange = useCallback(async (user: User | null) => {
    setUser(user ?? undefined);
    if (user) {
      const { claims } = await user.getIdTokenResult();
      setIsAdmin(
        Object.keys(claims).includes("role") && claims?.role == "admin",
      );
    }
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
    setIsLoading(true);
    const sub = onAuthStateChanged(auth, onAuthChange);

    if (currency != "USD") {
      getCurrencyMulti(currency).then((res) => {
        setCurrencyMultiplier(res);
      });
    }

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
        isAdmin,
        currency,
        addToCart,
        clearCart,
        isLoading,
        setIsAdmin,
        setCurrency,
        onAuthChange,
        setCartItemQty,
        removeFromCart,
        currencyMultiplier,
        setCurrencyMultiplier,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

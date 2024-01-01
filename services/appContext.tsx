import { Basket, BasketItem, ProductItem } from "@/utils/types";
import useLocalStorage from "@/utils/useLocalStorage";
import { BasketItemSchema, ProductItemSchema } from "@/utils/zodSchemas";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { getBasket, getCurrencyMulti } from "./database";
import { auth } from "./firebase";

type ContextType = {
  user?: User;
  currency: string;
  isLoading: boolean;
  currencyMultiplier: number;
  isAdmin: boolean;
  setIsAdmin: (boolean) => void;
  setCurrency: (currency: string) => void;
  onAuthChange: (user: User | null) => Promise<void>;
  setCurrencyMultiplier: (multiplier: number) => void;

  // basketCart
  basketCart: BasketItem[];
  basketCartItems: Basket[];
  clearBasketCart: () => void;
  addToBasketCart: (item: BasketItem, basket: Basket) => void;
  removeFromBasketCart: (sizeId: string) => void;
  setBasketCartItemQty: (sizeId: string, qty: number) => void;
};

type props = {
  children: JSX.Element | JSX.Element[];
};

export const appContext = createContext<ContextType>({
  currency: "USD",
  isLoading: true,
  currencyMultiplier: 1,
  isAdmin: false,
  setIsAdmin: () => {},
  setCurrency: () => {},
  setCurrencyMultiplier: () => {},
  onAuthChange: async (user) => {},

  basketCart: [],
  basketCartItems: [],
  addToBasketCart: () => {},
  clearBasketCart: () => {},
  removeFromBasketCart: () => {},
  setBasketCartItemQty: () => {},
});

export const AppContext = ({ children }: props) => {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1);
  const [currency, setCurrency] = useLocalStorage<string>(
    "currency",
    "USD",
    z.string(),
  );
  const [basketCart, updateBasketCart, clearBasketCart] = useLocalStorage<
    BasketItem[]
  >("basketCart", [], z.array(BasketItemSchema));

  const [basketCartItems, setBasketCartItems] = useState<
    (Basket & { id: string })[]
  >([]);

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

  const addToBasketCart = (
    item: BasketItem,
    basket: Basket & { id: string },
  ) => {
    if (basketCart.some((i) => JSON.stringify(i) == JSON.stringify(item)))
      return;
    updateBasketCart([...basketCart, item]);
    setBasketCartItems((p) => [...p, basket]);
  };

  const removeFromBasketCart = (sizeId: string) => {
    const itemIndex = basketCart.findIndex((item) => item.sizeId == sizeId);
    if (itemIndex == -1) return;
    updateBasketCart(basketCart.filter((_, index) => index != itemIndex));
    setBasketCartItems((p) => p.filter((_, index) => index != itemIndex));
  };

  const setBasketCartItemQty = (sizeId: string, qty: number) => {
    if (qty == 0) return removeFromBasketCart(sizeId);

    updateBasketCart(
      basketCart.map((item) =>
        item.sizeId == sizeId ? { ...item, qty } : item,
      ),
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

    // fetch and verify each basketCart item
    if (basketCart.length)
      (async () => {
        try {
          const newBasketCart: BasketItem[] = [];
          for (let basketItem of basketCart) {
            const basket = await getBasket(basketItem.basketId);
            if (!basket) continue;
            const size = basket.sizes.find(
              (item) => item.id == basketItem.sizeId,
            );
            if (!size) continue;
            setBasketCartItems((p) => [...(p ?? []), basket]);
            newBasketCart.push(basketItem);
          }
          clearBasketCart();
          updateBasketCart(newBasketCart);
        } catch (e) {
          // clearBasketCart();
          console.log(e);
        }
      })();

    return () => sub();
  }, []);

  return (
    <appContext.Provider
      value={{
        user,
        isAdmin,
        currency,
        isLoading,
        setIsAdmin,
        setCurrency,
        onAuthChange,
        currencyMultiplier,
        setCurrencyMultiplier,

        basketCart,
        basketCartItems,
        addToBasketCart,
        clearBasketCart,
        setBasketCartItemQty,
        removeFromBasketCart,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

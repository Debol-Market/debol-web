import { Basket, BasketItem, Product, ProductItem } from "@/utils/types";
import useLocalStorage from "@/utils/useLocalStorage";
import { BasketItemSchema, ProductItemSchema } from "@/utils/zodSchemas";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { getBasket, getCurrencyMulti } from "./database";
import { auth } from "./firebase";
import { fetchBasketsItems, fetchProductItems } from "./fetchCartItems";

type ContextType = {
  user?: User;
  currency: string;
  isLoading: boolean;
  currencyMultiplier: number;
  isAdmin: boolean;
  setIsAdmin: (boolean) => void;
  setCurrency: (curr: string) => void;
  onAuthChange: (user: User | null) => Promise<void>;
  setCurrencyMultiplier: (multiplier: number) => void;

  // basketCart
  basketCart: BasketItem[];
  basketCartItems: Basket[];
  clearBasketCart: () => void;
  addToBasketCart: (item: BasketItem, basket: Basket) => void;
  removeFromBasketCart: (sizeId: string) => void;
  setBasketCartItemQty: (sizeId: string, qty: number) => void;

  // productCart
  productCart: ProductItem[];
  productCartItems: Product[];
  clearProductCart: () => void;
  addToProductCart: (item: ProductItem, basket: Product) => void;
  removeFromProductCart: (sizeId: string) => void;
  setProductCartItemQty: (sizeId: string, qty: number) => void;
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

  productCart: [],
  productCartItems: [],
  addToProductCart: () => {},
  clearProductCart: () => {},
  removeFromProductCart: () => {},
  setProductCartItemQty: () => {},
});

export const AppContext = ({ children }: { children: ReactNode }) => {
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

  const [productCart, updateProductCart, clearProductCart] = useLocalStorage<
    ProductItem[]
  >("productCart", [], z.array(ProductItemSchema));

  const [basketCartItems, setBasketCartItems] = useState<
    (Basket & { id: string })[]
  >([]);

  const [productCartItems, setProductCartItems] = useState<Product[]>([]);

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

  const addToProductCart = (item: ProductItem, product: Product) => {
    if (basketCart.some((i) => JSON.stringify(i) == JSON.stringify(item)))
      return;
    updateProductCart([...productCart, item]);
    setProductCartItems((p) => [...p, product]);
  };

  const removeFromBasketCart = (sizeId: string) => {
    const itemIndex = basketCart.findIndex((item) => item.sizeId == sizeId);
    if (itemIndex == -1) return;
    updateBasketCart(basketCart.filter((_, index) => index != itemIndex));
    setBasketCartItems((p) => p.filter((_, index) => index != itemIndex));
  };

  const removeFromProductCart = (productId: string) => {
    const itemIndex = productCart.findIndex(
      (item) => item.productId == productId,
    );
    if (itemIndex == -1) return;
    updateProductCart(productCart.filter((_, index) => index != itemIndex));
    setProductCartItems((p) => p.filter((_, index) => index != itemIndex));
  };

  const setBasketCartItemQty = (sizeId: string, qty: number) => {
    if (qty == 0) return removeFromBasketCart(sizeId);
    updateBasketCart(
      basketCart.map((item) =>
        item.sizeId == sizeId ? { ...item, qty } : item,
      ),
    );
  };

  const setProductCartItemQty = (productId: string, qty: number) => {
    if (qty == 0) return removeFromProductCart(productId);
    updateProductCart(
      productCart.map((item) =>
        item.productId == productId ? { ...item, qty } : item,
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
    if (basketCart.length) {
      fetchBasketsItems(basketCart).then((items) => {
        const newBasketCart: BasketItem[] = [];
        const newBasketCartItems: (Basket & { id: string })[] = [];
        for (const basketItem of basketCart) {
          const cartItem = items.find(
            (i) =>
              i?.id == basketItem.basketId &&
              i?.sizes.find((s) => s.id == basketItem.sizeId),
          );
          if (!cartItem) continue;
          newBasketCart.push(basketItem);
          newBasketCartItems.push(cartItem);
        }
        setBasketCartItems(newBasketCartItems);
        updateBasketCart(newBasketCart);
      });
    }

    // fetch and verify each productCart item
    if (productCart.length) {
      fetchProductItems(productCart).then((items) => {
        const newProductCart: ProductItem[] = [];
        const newProductCartItems: Product[] = [];
        for (const productItem of productCart) {
          const cartItem = items.find((i) => i?.id == productItem.productId);
          if (!cartItem) continue;
          newProductCart.push(productItem);
          newProductCartItems.push(cartItem);
        }
        setProductCartItems(newProductCartItems);
        updateProductCart(newProductCart);
      });
    }

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

        // productCart
        productCart,
        productCartItems,
        clearProductCart,
        addToProductCart,
        removeFromProductCart,
        setProductCartItemQty,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useApp = () => useContext(appContext);

export default useApp;

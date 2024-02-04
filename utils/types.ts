export type Item = {
  name: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
};

export type Size = {
  id: string;
  name: string;
  description?: string;
  price: number;
  items: Item[];
};

export type Basket = {
  image: string;
  name: string;
  description: string;
  catagory?: string;
  sizes: Size[];
  created_at: number;
};

export type Contacts = {
  name: string;
  email: string;
  message: string;
};

export type Catagory = {
  name: string;
  basketCount: number;
  productCount: number;
};

export type Driver = {
  name: string;
  email: string;
  password: string;
};

export type BasketItem = {
  basketId: string;
  sizeId: string;
  qty: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  catagories: string[];
  image: string;
  created_at: number;
};

export type ProductItem = {
  productId: string;
  qty: number;
};

export type BasketItemData = BasketItem & { basket: Basket };
export type ProductItemData = ProductItem & { product: Product };

export type Order = {
  id: string;
  uid: string;
  phone1: string;
  phone2: string;
  name: string;
  baskets: BasketItemData[];
  products: ProductItemData[];
  status: "pending" | "completed" | "payment pending";
  paymentId?: string;
  paymentMethod: string;
  bank?: string;
  bill?: string;
  timestamp: number;
  user?: {
    signinMethod: string;
    email?: string;
    phone?: string;
  };
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export type Vendor = {
  name: string;
  addresses: string[];
  logo?: string;
  banners?: string[];
};

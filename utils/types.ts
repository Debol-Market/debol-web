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
};

export type CartItem = {
  basket: Basket;
  basketId: string;
  item: Size;
  qty: number;
};

export type PaymentData = {
  basketId: string;
  sizeId: string;
  qty: number;
};

export type Contacts = {
  name: string;
  email: string;
  message: string;
};

export type OrderItem = {
  basket: Basket;
} & PaymentData;

export type Catagory = {
  name: string;
  count: number;
};

export type Order = {
  uid: string;
  phone1: string;
  phone2: string;
  items: OrderItem[];
  name: string;
  status: "pending" | "completed" | "payment pending";
  paymentId?: string;
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

export type ProductItem = {
  productId: string;
  qty: number;
};

export type Product = {
  name: string;
  description: string;
  catagory: string;
  unit: string;
  price: number;
  catagories: string[];
  vendor: string;
  images: string[];
};

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
  qty: number;
  basketId: string;
  sizeId: string;
};

<<<<<<< HEAD
export type Contacts ={
  name: string;
  email: string;
  message: string;
}
=======
export type Order = {
  uid: string;
  phone1: string;
  phone2: string;
  items: CartItem[];
  name: string;
  status: "pending" | "completed" | "payment pending";
  paymentId?: string;
  timestamp: number;
};
>>>>>>> 7d4b7d8882e56bed5e8f7dd356515aa18be8ea0d

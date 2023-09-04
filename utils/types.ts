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

export type Contacts ={
  name: string;
  email: string;
  message: string;
}

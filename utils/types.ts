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
  count: number;
};

export type Driver = {
  name: string;
  email: string;
  password: string;
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
  created_at: number;
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

export type BasketItemData = BasketItem & { basket: Basket };
export type ProductItemData = ProductItem & { product: Product };

export type Order = {
  uid: string;
  phone1: string;
  phone2: string;
  name: string;
  basket: BasketItemData[];
  products: ProductItemData[];
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
<<<<<<< HEAD

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
  catagory?: string;
  unit: string;
  price: number;
  catagories?: string[]; // made them obtional for test  i will add them to products page 
  vendor: string;
  images?: string[];
};
=======
>>>>>>> 3dbb05029105ecd0bdb3a56c178a77659298af1f

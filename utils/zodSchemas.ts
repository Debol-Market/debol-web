import { z } from "zod";

export const BasketItemSchema = z.object({
  basketId: z.string(),
  sizeId: z.string(),
  qty: z.number(),
});

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  unit: z.string(),
  price: z.number(),
  catagories: z.array(z.string()),
  vendor: z.string(),
  images: z.array(z.string()).optional(),
  created_at: z.number(),
});

export const ProductItemSchema = z.object({
  productId: z.string(),
  qty: z.number(),
});

import { Basket, Product } from './types';

export function generateID() {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const generateKeywords = (str: string) => {
  const keywords: string[] = [];
  for (const word of str.split(' ')) {
    if (!word.length) continue;
    for (let i = 0; i < word.length; i++) {
      keywords.push(word.toLocaleLowerCase().slice(0, i + 1));
    }
  }
  return keywords;
};

export const generateBasketKeywords = (basket: Basket) => {
  return Array.from(
    new Set([
      ...generateKeywords(basket.name),
      ...generateKeywords(basket.description),
      ...basket.sizes.reduce(
        (a, s) => [
          ...a,
          ...generateKeywords(s.name),
          ...generateKeywords(s.description ?? ''),
          ...s.items.reduce(
            (arr, i) => [...arr, ...generateKeywords(i.name)],
            [] as string[]
          ),
        ],
        [] as string[]
      ),
    ])
  );
};

export const generateProductKeywords = (product: Product) => {
  return Array.from(
    new Set([
      ...generateKeywords(product.name),
      ...generateKeywords(product.description),
      ...generateKeywords(product.vendor),
      ...generateKeywords(product.catagory),
      ...product.catagories.reduce(
        (a, s) => [
          ...a,
          ...generateKeywords(s ?? ''),
        ],
        [] as string[]
      ),
    ])
  );
};

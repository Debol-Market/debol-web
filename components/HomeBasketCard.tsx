import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Basket } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { getUrl } from "@/services/storage";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import useApp from "@/services/appContext";
import convertCurrency from "@/utils/convertCurrency";

interface Props {
  basket: Basket;
  id: string;
}

export function HomeBasketCard({ basket, id }: Props) {
  const { addToBasketCart, basketCart, currencyMultiplier, currency } =
    useApp(); // Add basketCart here
  const originalPrice = basket.sizes[0].items.reduce(
    (acc, item) => acc + item.quantity * item.pricePerUnit,
    0,
  );
  const price = basket.sizes[0].price;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) * 100) / originalPrice)
    : null;
  // console.log(originalPrice, discount, price);

  const { data, status } = useQuery({
    queryKey: ["getBasketImage", id],
    queryFn: () => getUrl(basket.image),
  });

  // Check if the specific basket size is already in the cart
  const isInCart = !!basketCart.find(
    (item) => item.basketId === id && item.sizeId === basket.sizes[0].id,
  );

  return (
    <Link
      href={`/basket/${id}`}
      className="group flex flex-col relative overflow-hidden w-full rounded-lg shadow border bg-background"
    >
      {!!discount && (
        <Badge className="absolute top-2 right-2 z-10 text-accent bg-white shadow-sm ">
          {discount}% OFF
        </Badge>
      )}

      <div className="aspect-[5/4] overflow-hidden">
        {status == "success" ? (
          <div className="rounded-lg overflow-hidden w-full aspect-[5/4]">
            <img src={data} alt="" className="object-cover h-full w-full" />
          </div>
        ) : (
          <Skeleton className="rounded-lg overflow-hidden w-full aspect-square" />
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold line-clamp-1">{basket.name}</h3>
        <p className="text-sm mb-6 text-muted-foreground mt-1 line-clamp-2">
          {basket.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-accent ">
              {convertCurrency(price ?? 0, currencyMultiplier, currency)}
            </span>
            {originalPrice != price && (
              <span className="text-sm text-muted-foreground font-semibold line-through">
                {originalPrice / 100}
              </span>
            )}
          </div>
          {/* Update Button based on isInCart */}
          <Button
            className={`text-sm ${isInCart ? "bg-orange-500 cursor-default" : "bg-orange-500 hover:bg-orange-500 hover:opacity-80 transition-all"}`}
            onClick={(e) => {
              if (isInCart) {
                e.preventDefault(); // Prevent navigation if already in cart
                return;
              }
              e.preventDefault();
              return addToBasketCart(
                {
                  sizeId: basket.sizes[0].id,
                  qty: 1,
                  basketId: id,
                },
                basket,
              );
            }}
            size="sm"
            disabled={isInCart} // Disable button if in cart
          >
            {isInCart ? "Added" : "Add to Cart"}{" "}
            {/* Change text based on isInCart */}
          </Button>
        </div>
      </div>
    </Link>
  );
}

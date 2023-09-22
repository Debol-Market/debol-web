import { Basket } from "@/utils/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import BasketCard from "../BasketCard";

describe("BasketCard", () => {
  const mockBasket: Basket = {
    image: "path/to/image.jpg",
    name: "Basket Item",
    description: "This is a mock basket item",
    catagory: "Some category",
    sizes: [
      {
        id: "size1",
        name: "Small",
        description: "Small size description",
        price: 10,
        items: [
          {
            name: "Item 1",
            unit: "unit",
            quantity: 1,
            pricePerUnit: 5,
          },
          {
            name: "Item 2",
            unit: "unit",
            quantity: 2,
            pricePerUnit: 7,
          },
        ],
      },
      {
        id: "size2",
        name: "Large",
        description: "Large size description",
        price: 15,
        items: [
          {
            name: "Item 3",
            unit: "unit",
            quantity: 3,
            pricePerUnit: 8,
          },
        ],
      },
    ],
    created_at: Date.now(),
  };
  jest.mock(
    "next/link",
    () =>
      ({ children }) =>
        children
  );
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        staleTime: Infinity,
        networkMode: "always",
      },
    },
  });

  it("renders BasketCard", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BasketCard basket={mockBasket} id="1" />
      </QueryClientProvider>
    );
    expect(screen.getByText("Basket Item")).toBeInTheDocument();
  });

  it("renders BasketCard with image", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BasketCard basket={mockBasket} id="1" />
      </QueryClientProvider>
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

import { AppContext } from "@/services/appContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      networkMode: "always",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AppContext>
  );
}

import { AppContext } from "@/services/appContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import Logo from "../components/Logo";
import useApp from "../services/appContext";

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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, minimal-ui" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M8H4W423');`,
          }}
        />
      </Head>
      <AppContext>
        <QueryClientProvider client={queryClient}>
          <PageLoader>
            <Component {...pageProps} />
          </PageLoader>
        </QueryClientProvider>
      </AppContext>
    </>
  );
}

const MainFallback = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-white-200 to-white-100 grid place-items-center ">
      <div className="text-4xl">
        <Logo size={60} />
      </div>
    </div>
  );
};

function PageLoader({ children }: { children: JSX.Element }) {
  const { isLoading } = useApp();
  return isLoading ? <MainFallback /> : <>{children}</>;
}

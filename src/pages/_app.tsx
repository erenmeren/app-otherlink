import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import NProgress from "nprogress";
import { wrapper } from "../app/store";
import { ToastContainer } from "react-toastify";

import "@/assets/css/global.css";
import "react-toastify/dist/ReactToastify.css";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      {getLayout(
        <>
          <Head>
            <title>Otherlink - App</title>
            <meta
              name="description"
              content="Making receipts digital and easy. Otherlink own smart IoT device turn your traditional paper receipts into digital one in matter of seconds."
            />
            <meta
              name="keywords"
              content="Receipt, Digital Receipt, Electronic Receipt"
            />
          </Head>
          <ToastContainer />
          <Component {...pageProps} />
        </>
      )}
    </SessionProvider>
  );
}

export default wrapper.withRedux(MyApp);

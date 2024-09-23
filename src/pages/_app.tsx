import OpenAIProvider from "../context/OpenAIProvider";
import "@/utils/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import Layout from '../context/Layout'; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <OpenAIProvider>
          <Layout>  {/* Ajoutez cette ligne */}
            <Component {...pageProps} />
          </Layout>  {/* Ajoutez cette ligne */}
        </OpenAIProvider>
      <Analytics />
    </>
  );
}
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { TcContextExp } from "@/context/tsContext";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <TcContextExp>
      <Component {...pageProps} />
    </TcContextExp>
  );
}

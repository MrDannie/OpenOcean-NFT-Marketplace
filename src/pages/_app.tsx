import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { SignerProvider } from "state/signer";
import Layout from "../components/Layout";
import "../styles/globals.css";

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL as string;
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: GRAPH_URL,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <SignerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SignerProvider>
    </ApolloProvider>
  );
};

export default MyApp;

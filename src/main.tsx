import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import { saveAuthToken } from "./utils.ts";

const httpLink = new HttpLink({ uri: "/api/graphql" });
const wsLink = new GraphQLWsLink(createClient({
  url: window.location.protocol === "https:" ? "wss://" : "ws://"
    + window.location.host
    + "/api/graphql",
}));
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink,
);

saveAuthToken();

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

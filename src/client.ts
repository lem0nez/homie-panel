import { notifications } from "@mantine/notifications";

import { ApolloClient, ApolloError, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

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

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export function handleError(err: ApolloError | undefined) {
  err?.graphQLErrors.forEach((graphqlErr) => {
    // const code = graphqlErr.extensions?.["code"] as string | undefined;
    notifications.show({
      title: "Error",
      message: graphqlErr.message,
      color: "red",
    });
  });
}

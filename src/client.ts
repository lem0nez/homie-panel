import { notifications } from "@mantine/notifications";

import { ApolloClient, ApolloError, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const apolloClient = new ApolloClient({
  link: new GraphQLWsLink(createClient({
    url: window.location.protocol === "https:" ? "wss://" : "ws://"
      + window.location.host
      + "/api/graphql",
  })),
  cache: new InMemoryCache(),
});

export function handleError(err: ApolloError | undefined) {
  err?.graphQLErrors.forEach(graphqlErr => {
    // const code = graphqlErr.extensions?.["code"] as string | undefined;
    notifications.show({
      title: "Error",
      message: graphqlErr.message,
      color: "red",
    });
  });
}

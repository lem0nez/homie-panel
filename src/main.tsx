import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";

import App from "./components/App.tsx";
import { apolloClient } from "./client.ts";
import { theme, variablesResolver } from "./theme.ts";
import { saveAuthToken } from "./utils.ts";

saveAuthToken();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <MantineProvider theme={theme} cssVariablesResolver={variablesResolver}
        defaultColorScheme="auto"
      >
        <Notifications />
        <App />
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
);

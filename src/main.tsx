import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const AUTH_COOKIE_PRESERVE_DAYS = 7;

function saveAuthToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get("auth_token");

  if (authToken != null) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + AUTH_COOKIE_PRESERVE_DAYS);
    document.cookie =
      "authorization=" + authToken
      + "; expires=" + expirationDate.toUTCString()
      + "; path=/api";
  }
}

saveAuthToken();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

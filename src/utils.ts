const AUTH_COOKIE_PRESERVE_DAYS = 7;

export function saveAuthToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get("auth_token");

  if (authToken) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + AUTH_COOKIE_PRESERVE_DAYS);
    document.cookie =
      "authorization=" + authToken
      + "; expires=" + expirationDate.toUTCString()
      + "; path=/api";
  }
}

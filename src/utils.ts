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
      + "; path=/";
  }
}

export function getSiteAccessUrl() {
  const token = getCookie("authorization");
  return window.location.origin + (token ? "/?auth_token=" + token : "");
}

function getCookie(key: string) {
  const pattern = "(^|;)\\s*" + key + "\\s*=\\s*([^;]+)";
  return document.cookie.match(pattern)?.pop();
}

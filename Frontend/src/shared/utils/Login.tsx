export function isLoggedIn() {
  return localStorage.getItem("token") !== null && localStorage.getItem("token") !== "undefined";
}

export function deleteTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
}

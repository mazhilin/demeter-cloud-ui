import Cookies from "js-cookie";

const TokenKey = "X-Console-Web-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function setTokenExpires(token, expires = "") {
  return Cookies.set(TokenKey, token, { expires: expires });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

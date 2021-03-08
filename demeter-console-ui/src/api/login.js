import request from "@/utils/request";

export function login(account, password) {
  const data = {
    account,
    password,
  };
  return request({
    url: "/authority/login",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/authority/logout",
    method: "post",
  });
}

export function getUserInfo(token) {
  return request({
    url: "/authority/info",
    method: "get",
    params: { token },
  });
}

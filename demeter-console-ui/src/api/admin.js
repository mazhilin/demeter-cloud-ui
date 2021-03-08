import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/user/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/user/create",
    method: "post",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/user/edit",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/user/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data,
  });
}

import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/dictionary/item/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/dictionary/item/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/dictionary/item/show",
    method: "get",
    data,
  });
}

export function update(data) {
  return request({
    url: "/dictionary/item/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/dictionary/item/delete",
    method: "post",
    data,
  });
}

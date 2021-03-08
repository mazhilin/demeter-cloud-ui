import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/dictionary/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/dictionary/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/dictionary/show",
    method: "get",
    data,
  });
}
export function update(data) {
  return request({
    url: "/dictionary/update",
    method: "post",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/dictionary/edit",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/dictionary/delete",
    method: "post",
    data,
  });
}

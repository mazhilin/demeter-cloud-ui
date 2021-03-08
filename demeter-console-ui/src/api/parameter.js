import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/parameter/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/parameter/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/parameter/show",
    method: "get",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/parameter/edit",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/parameter/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/parameter/delete",
    method: "post",
    data,
  });
}

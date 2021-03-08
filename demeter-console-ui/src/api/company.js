import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/company/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/company/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/company/show",
    method: "get",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/company/edit",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/company/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/company/delete",
    method: "post",
    data,
  });
}

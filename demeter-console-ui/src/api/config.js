import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/config/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/config/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/config/show",
    method: "get",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/config/edit",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/config/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/config/delete",
    method: "post",
    data,
  });
}

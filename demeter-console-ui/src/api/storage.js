import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/storage/list",
    method: "get",
    params: query,
  });
}

export function create(data) {
  return request({
    url: "/storage/create",
    method: "post",
    data,
  });
}

export function show(data) {
  return request({
    url: "/storage/show",
    method: "get",
    data,
  });
}

export function edit(data) {
  return request({
    url: "/storage/edit",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/storage/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/storage/delete",
    method: "post",
    data,
  });
}

const uploadPath = process.env.BASE_API + "/storage/create";
export { uploadPath };

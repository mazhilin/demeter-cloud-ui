import request from "@/utils/request";

export function listInformation(query) {
  return request({
    url: "/information/list",
    method: "get",
    params: query,
  });
}

export function createInformation(data) {
  return request({
    url: "/information/create",
    method: "post",
    data,
  });
}

export function readInformation(data) {
  return request({
    url: "/information/read",
    method: "get",
    data,
  });
}

export function updateInformation(data) {
  return request({
    url: "/information/update",
    method: "post",
    data,
  });
}

export function deleteInformation(data) {
  return request({
    url: "/information/delete",
    method: "post",
    data,
  });
}

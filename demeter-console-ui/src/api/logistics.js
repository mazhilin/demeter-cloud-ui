import request from "@/utils/request";

export function listLogistics(query) {
  return request({
    url: "/logistics/list",
    method: "get",
    params: query,
  });
}

export function createLogistics(data) {
  return request({
    url: "/logistics/create",
    method: "post",
    data,
  });
}

export function readLogistics(data) {
  return request({
    url: "/logistics/read",
    method: "get",
    data,
  });
}

export function updateLogistics(data) {
  return request({
    url: "/logistics/update",
    method: "post",
    data,
  });
}

export function deleteLogistics(data) {
  return request({
    url: "/logistics/delete",
    method: "post",
    data,
  });
}

import request from "@/utils/request";

export function listEmployee(query) {
  return request({
    url: "/employee/list",
    method: "get",
    params: query,
  });
}

export function createEmployee(data) {
  return request({
    url: "/employee/create",
    method: "post",
    data,
  });
}

export function readEmployee(data) {
  return request({
    url: "/employee/read",
    method: "get",
    data,
  });
}

export function updateEmployee(data) {
  return request({
    url: "/employee/update",
    method: "post",
    data,
  });
}

export function deleteEmployee(data) {
  return request({
    url: "/employee/delete",
    method: "post",
    data,
  });
}

import request from "@/utils/request";

export function listTemplate(query) {
  return request({
    url: "/template/list",
    method: "get",
    params: query,
  });
}

export function createTemplate(data) {
  return request({
    url: "/template/create",
    method: "post",
    data,
  });
}

export function readTemplate(data) {
  return request({
    url: "/template/read",
    method: "get",
    data,
  });
}

export function updateTemplate(data) {
  return request({
    url: "/template/update",
    method: "post",
    data,
  });
}

export function deleteTemplate(data) {
  return request({
    url: "/template/delete",
    method: "post",
    data,
  });
}

export function templateList(data) {
  return request({
    url: "/template/templateList",
    method: "get",
    data,
  });
}

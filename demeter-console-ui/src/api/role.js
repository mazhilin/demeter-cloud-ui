import request from "@/utils/request";

/** 角色列表*/
export function list(query) {
  return request({
    url: "/role/list",
    method: "get",
    params: query,
  });
}

/** 角色新增*/
export function create(data) {
  return request({
    url: "/role/create",
    method: "post",
    data,
  });
}

/** 角色详情*/
export function show(data) {
  return request({
    url: "/role/show",
    method: "get",
    data,
  });
}

/** 角色编辑*/
export function edit(data) {
  return request({
    url: "/role/edit",
    method: "post",
    data,
  });
}

/** 角色更新*/
export function update(data) {
  return request({
    url: "/role/update",
    method: "post",
    data,
  });
}

/** 角色删除*/
export function remove(data) {
  return request({
    url: "/role/delete",
    method: "post",
    data,
  });
}

export function options(query) {
  return request({
    url: "/role/options",
    method: "get",
    params: query,
  });
}

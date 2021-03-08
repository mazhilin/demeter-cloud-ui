import request from "@/utils/request";

/** 角色-权限列表*/
export function permissionList(query) {
  return request({
    url: "/permission/list",
    method: "get",
    params: query,
  });
}

export function updatePermission(data) {
  return request({
    url: "/permission/update",
    method: "post",
    data,
  });
}

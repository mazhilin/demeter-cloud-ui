import request from "@/utils/request";

export function distributionList(query) {
  return request({
    url: "/report/distribution",
    method: "get",
    params: query,
  });
}

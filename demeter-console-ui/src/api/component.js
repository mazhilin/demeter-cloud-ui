import request from "@/utils/request";

export function provinceList(data) {
  return request({
    url: "/component/provinceList",
    method: "get",
    data,
  });
}

export function cityList(data) {
  return request({
    url: "/component/cityList",
    method: "get",
    data,
  });
}

export function districtList(data) {
  return request({
    url: "/component/districtList",
    method: "get",
    data,
  });
}

export function regionList(data) {
  return request({
    url: "/component/regionList",
    method: "get",
    data,
  });
}

import request from '@/utils/request'

export function listParameter(query) {
  return request({
    url: '/parameter/list',
    method: 'get',
    params: query
  })
}

export function createParameter(data) {
  return request({
    url: '/parameter/create',
    method: 'post',
    data
  })
}

export function readParameter(data) {
  return request({
    url: '/parameter/read',
    method: 'get',
    data
  })
}

export function updateParameter(data) {
  return request({
    url: '/parameter/update',
    method: 'post',
    data
  })
}

export function deleteParameter(data) {
  return request({
    url: '/parameter/delete',
    method: 'post',
    data
  })
}

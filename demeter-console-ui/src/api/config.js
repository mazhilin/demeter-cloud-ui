import request from '@/utils/request'

export function listConfig(query) {
  return request({
    url: '/config/list',
    method: 'get',
    params: query
  })
}

export function createConfig(data) {
  return request({
    url: '/config/create',
    method: 'post',
    data
  })
}

export function readConfig(data) {
  return request({
    url: '/config/read',
    method: 'get',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}

export function deleteConfig(data) {
  return request({
    url: '/config/delete',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function listExpress(query) {
  return request({
    url: '/express/list',
    method: 'get',
    params: query
  })
}

export function createExpress(data) {
  return request({
    url: '/express/create',
    method: 'post',
    data
  })
}

export function readExpress(data) {
  return request({
    url: '/express/read',
    method: 'get',
    data
  })
}

export function updateExpress(data) {
  return request({
    url: '/express/update',
    method: 'post',
    data
  })
}

export function deleteExpress(data) {
  return request({
    url: '/express/delete',
    method: 'post',
    data
  })
}

export function expressList(data) {
  return request({
    url: '/express/expressList',
    method: 'get',
    data
  })
}

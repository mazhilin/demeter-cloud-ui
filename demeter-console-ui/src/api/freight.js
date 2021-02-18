import request from '@/utils/request'

export function listFreight(query) {
  return request({
    url: '/freight/list',
    method: 'get',
    params: query
  })
}

export function createFreight(data) {
  return request({
    url: '/freight/create',
    method: 'post',
    data
  })
}

export function readFreight(data) {
  return request({
    url: '/freight/read',
    method: 'get',
    data
  })
}

export function updateFreight(data) {
  return request({
    url: '/freight/update',
    method: 'post',
    data
  })
}

export function deleteFreight(data) {
  return request({
    url: '/freight/delete',
    method: 'post',
    data
  })
}

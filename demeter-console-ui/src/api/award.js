import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/award/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/award/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/award/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/award/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/award/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/award/delete',
    method: 'post',
    data
  })
}

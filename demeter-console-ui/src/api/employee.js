import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/employee/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/employee/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/employee/read',
    method: 'get',
    data
  })
}

export function edit(data) {
  return request({
    url: '/employee/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/employee/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/employee/delete',
    method: 'post',
    data
  })
}

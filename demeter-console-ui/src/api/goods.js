import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/goods/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/goods/show',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}


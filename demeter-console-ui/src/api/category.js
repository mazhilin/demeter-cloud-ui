import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/category/l1',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/category/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/category/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/category/delete',
    method: 'post',
    data
  })
}

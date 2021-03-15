import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/customer/list',
    method: 'get',
    params: query
  })
}
export function create(data) {
  return request({
    url: '/customer/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/customer/show',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/customer/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/customer/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/customer/delete',
    method: 'post',
    data
  })
}


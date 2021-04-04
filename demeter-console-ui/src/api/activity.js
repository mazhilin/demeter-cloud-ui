import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/activity/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/activity/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/activity/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/activity/delete',
    method: 'post',
    data
  })
}

export function bound(data) {
  return request({
    url: '/activity/bound',
    method: 'post',
    data
  })
}

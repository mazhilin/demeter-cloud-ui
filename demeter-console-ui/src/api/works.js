import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/works/list',
    method: 'get',
    params: query
  })
}
export function create(data) {
  return request({
    url: '/works/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/works/show',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/works/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/works/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/works/delete',
    method: 'post',
    data
  })
}

export function bound(data) {
  return request({
    url: '/works/bound',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/works/detail',
    method: 'post',
    data
  })
}


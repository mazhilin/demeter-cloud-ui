import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/template/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/template/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/template/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/template/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/template/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/template/delete',
    method: 'post',
    data
  })
}

export function templateList(data) {
  return request({
    url: '/template/templateList',
    method: 'get',
    data
  })
}

import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/vote/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/vote/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/vote/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/vote/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/vote/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/vote/delete',
    method: 'post',
    data
  })
}

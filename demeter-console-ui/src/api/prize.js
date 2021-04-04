import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/prize/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/prize/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/prize/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/prize/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/prize/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/prize/delete',
    method: 'post',
    data
  })
}

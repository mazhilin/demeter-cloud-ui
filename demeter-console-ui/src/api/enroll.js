import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/enroll/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/enroll/create',
    method: 'post',
    data
  })
}

export function show(data) {
  return request({
    url: '/enroll/show',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/enroll/update',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/enroll/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/enroll/delete',
    method: 'post',
    data
  })
}

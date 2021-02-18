import request from '@/utils/request'

export function listMember(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
export function createMember(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function readMember(data) {
  return request({
    url: '/user/read',
    method: 'get',
    data
  })
}

export function updateMember(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function deleteMember(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function approveAgency(data) {
  return request({
    url: '/user/approveAgency',
    method: 'post',
    data
  })
}

export function detailApprove(id) {
  return request({
    url: '/user/detailApprove',
    method: 'get',
    params: { id }
  })
}

export function listAddress(query) {
  return request({
    url: '/address/list',
    method: 'get',
    params: query
  })
}

export function listCollect(query) {
  return request({
    url: '/collect/list',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params: query
  })
}

export function listFootprint(query) {
  return request({
    url: '/footprint/list',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/history/list',
    method: 'get',
    params: query
  })
}


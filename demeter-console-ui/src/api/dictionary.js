import request from '@/utils/request'

export function listDictionary(query) {
  return request({
    url: '/dictionary/list',
    method: 'get',
    params: query
  })
}

export function createDictionary(data) {
  return request({
    url: '/dictionary/create',
    method: 'post',
    data
  })
}

export function readDictionary(data) {
  return request({
    url: '/dictionary/read',
    method: 'get',
    data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/dictionary/update',
    method: 'post',
    data
  })
}

export function deleteDictionary(data) {
  return request({
    url: '/dictionary/delete',
    method: 'post',
    data
  })
}
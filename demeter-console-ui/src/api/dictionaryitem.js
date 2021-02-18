import request from '@/utils/request'

export function listDictionaryItem(query) {
  return request({
    url: '/dictionary/item/list',
    method: 'get',
    params: query
  })
}

export function createDictionaryItem(data) {
  return request({
    url: '/dictionary/item/create',
    method: 'post',
    data
  })
}

export function readDictionaryItem(data) {
  return request({
    url: '/dictionary/item/read',
    method: 'get',
    data
  })
}

export function updateDictionaryItem(data) {
  return request({
    url: '/dictionary/item/update',
    method: 'post',
    data
  })
}

export function deleteDictionaryItem(data) {
  return request({
    url: '/dictionary/item/delete',
    method: 'post',
    data
  })
}

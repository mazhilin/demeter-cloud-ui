import request from '@/utils/request'

export function achievementList(query) {
  return request({
    url: '/report/achievement',
    method: 'get',
    params: query
  })
}

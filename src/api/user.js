import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'post'
  })
}

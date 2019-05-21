import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/system/sysuser/register',
    method: 'post',
    data
  })
}

export function getInfo(name) {
  const url = `/system/sysuser/name/${name}`
  console.log('name', url)
  return request({
    url: url,
    method: 'get'
  })
}

export function getList(data) {
  return request({
    url: `/system/sysuser/list`,
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

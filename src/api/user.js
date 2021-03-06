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

export function addUser(data) {
  return request({
    url: `/system/sysuser/add`,
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: `/system/sysuser/edit`,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: `/system/sysuser/delete/${data}`,
    method: 'delete'
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/sysuser/export`,
    method: 'get',
    params: data
  })
}

export function getInfoById(data) {
  return request({
    url: `/system/sysuser/get/${data}`,
    method: 'get'
  })
}

export function editInfoById(userId, data) {
  return request({
    url: `/system/sysuser/editUser`,
    method: 'put',
    data: data
  })
}

export function modifyPsw(data) {
  return request({
    url: `/system/sysuser/editPassword`,
    method: 'put',
    data: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

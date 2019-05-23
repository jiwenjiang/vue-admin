import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/system/sysrule/all',
    method: 'get'
  })
}

export function getRolesList(data) {
  return request({
    url: '/system/sysrule/list',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/system/sysrule/add',
    method: 'post',
    data
  })
}

export function editRole(data) {
  return request({
    url: `/system/sysrule/edit`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/system/sysrule/delete/${id}`,
    method: 'delete'
  })
}

export function roleAuth() {
  return request({
    url: `/system/sysrule/allAuth`,
    method: 'get'
  })
}

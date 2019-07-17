/**
 * Created by j_bleach on 2019/7/17 0017.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/sysnaveval/list`,
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
    url: `/system/sysnaveval/delete/${data}`,
    method: 'delete'
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/sysnaveval/export`,
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

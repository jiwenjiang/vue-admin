/**
 * Created by j_bleach on 2019/6/25 0025.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/syssmallprogram/list`,
    method: 'get',
    params: data
  })
}

export function getAllMini(data) {
  return request({
    url: `/system/syssmallprogram/programAll`,
    method: 'get',
    params: data
  })
}

export function getNoBindList(programId) {
  return request({
    url: `/system/syssmallprogram/programNoBindZone/${programId}`,
    method: 'get'
  })
}

export function getOtherBindList(programId) {
  return request({
    url: `/system/syssmallprogram/programOtherZone/${programId}`,
    method: 'get'
  })
}

export function getBindList(programId) {
  return request({
    url: `/system/syssmallprogram/get/${programId}`,
    method: 'get'
  })
}

export function cancelMiniBind(data) {
  return request({
    url: `/system/syssmallprogram/untyZone`,
    method: 'put',
    data: data
  })
}

export function addMiniBind(data) {
  return request({
    url: `/system/syssmallprogram/bindZone`,
    method: 'put',
    data: data
  })
}

export function addUser(data) {
  return request({
    url: `/system/syssmallprogram/add`,
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: `/system/syssmallprogram/edit`,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: `/system/syssmallprogram/delete/${data}`,
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

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userMini(data) {
  return request({
    url: `/system/syssmallprogram/userProgram`,
    method: 'get',
    params: data
  })
}

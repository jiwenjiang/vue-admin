/**
 * Created by j_bleach on 2019/6/28 0028.
 */
import request from '@/utils/request'

export function getAreaList(data) {
  return request({
    url: `/system/locMapZone/list`,
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: `/system/locMapZone/updateStatus`,
    method: 'post',
    data: data
  })
}

export function updateMarker(data) {
  return request({
    url: `/system/locMapZone/updateWatermark`,
    method: 'post',
    data: data
  })
}

export function getAreaAll(data) {
  return request({
    url: `/system/locMapZone/getAll`,
    method: 'post',
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
    url: `/system/sysuser/edit`,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: `/system/locMapZone/delete/${data}`,
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

/**
 * Created by j_bleach on 2019/5/23 0023.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/syswxconfig/list`,
    method: 'get',
    params: data
  })
}

export function getAllWX(data) {
  return request({
    url: `/system/syswxconfig/all`,
    method: 'get',
    params: data
  })
}

export function addWx(data) {
  return request({
    url: `/system/syswxconfig/add`,
    method: 'post',
    data: data
  })
}

export function editWx(data) {
  return request({
    url: `/system/syswxconfig/edit`,
    method: 'put',
    data: data
  })
}

export function deleteWx(data) {
  return request({
    url: `/system/syswxconfig/delete/${data}`,
    method: 'delete'
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/syswxconfig/export`,
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

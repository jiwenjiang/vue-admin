/**
 * Created by j_bleach on 2019/7/8 0008.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/hospServiceFunction/list`,
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: `/system/hospServiceFunction/add`,
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: `/system/hospServiceFunction/edit`,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: `/system/hospServiceFunction/delete/${data}`,
    method: 'delete'
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/hospServiceFunction/export`,
    method: 'get',
    params: data
  })
}


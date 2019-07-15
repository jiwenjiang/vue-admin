/**
 * Created by j_bleach on 2019/7/8 0008.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/hospServiceType/list`,
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: `/system/hospServiceType/add`,
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: `/system/hospServiceType/edit`,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: `/system/hospServiceType/delete/${data}`,
    method: 'delete'
  })
}

export function searchType(data) {
  return request({
    url: `/system/hospServiceType/selectServiceTypes`,
    method: 'get',
    params: data
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/hospServiceType/export`,
    method: 'get',
    params: data
  })
}


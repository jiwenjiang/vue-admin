/**
 * Created by j_bleach on 2019/5/22 0022.
 */
import request from '@/utils/request'

export function getPartners() {
  return request({
    url: '/system/syspartner/all',
    method: 'get'
  })
}

export function getPartnersList(data) {
  return request({
    url: '/system/syspartner/list',
    method: 'get',
    params: data
  })
}

export function addPartners(data) {
  return request({
    url: '/system/syspartner/add',
    method: 'post',
    data: data
  })
}

export function editPartners(data) {
  return request({
    url: '/system/syspartner/edit',
    method: 'put',
    data: data
  })
}

export function deletePartners(data) {
  return request({
    url: `/system/syspartner/delete/${data}`,
    method: 'delete',
  })
}

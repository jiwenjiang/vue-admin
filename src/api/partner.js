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
    method: 'get',
    params: data
  })
}


/**
 * Created by j_bleach on 2019/5/23 0023.
 */
/**
 * Created by j_bleach on 2019/5/23 0023.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/syslog/list`,
    method: 'get',
    params: data
  })
}

export function deleteLog(data) {
  return request({
    url: `/system/syslog/delete/${data}`,
    method: 'delete'
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/syslog/export`,
    method: 'get',
    params: data
  })
}


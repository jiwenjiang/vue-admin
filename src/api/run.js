/**
 * Created by j_bleach on 2019/8/2 0002.
 */
import request from '@/utils/request'

export function getRun(data) {
  return request({
    url: '/system/sysconfig/runConfig',
    method: 'get',
    params: data
  })
}

export function editRun(data) {
  return request({
    url: '/system/sysconfig/edit',
    method: 'put',
    data: data
  })
}

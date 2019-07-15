/**
 * Created by j_bleach on 2019/7/12 0012.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/IbeaconDevice/list`,
    method: 'post',
    data: data
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/IbeaconDevice/export`,
    method: 'get',
    params: data
  })
}


/**
 * Created by j_bleach on 2019/7/19 0019.
 */
import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/system/sysIbeaconClass/list`,
    method: 'post',
    data: data
  })
}

export function exportFlie(data) {
  return request({
    url: `/system/sysIbeaconClass/exportLibrary`,
    method: 'get',
    params: data
  })
}

export function getTime(data) {
  return request({
    url: `/system/sysIbeaconClass/learnDate`,
    method: 'get',
    params: data
  })
}

export function deletePrint(data) {
  return request({
    url: `/location/class/v1/delete`,
    method: 'put',
    data: data
  })
}

export function deletePrints(data) {
  return request({
    url: `/location/class/v1/bulkDelete`,
    method: 'put',
    data: data
  })
}

export function getDBList(data) {
  return request({
    url: `/system/sysIbeaconClass/list`,
    method: 'post',
    data: data
  })
}

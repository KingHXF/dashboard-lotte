import request from '../utils/request'

export function getDeviceCard(params) {
  return request({
    url: '/dashboard/device-card',
    method: 'get',
    params
  })
}

export function countRepFaultStatus(params) {
  return request({
    url: '/dashboard/count-rep-fault-status',
    method: 'get',
    params
  })
}

// 上面两个接口可以删掉

export function getDepartmentFaultCount(params) {
  return request({
    url: '/dashboard/department-fault-count',
    method: 'get',
    params
  })
}

export function getProgressCount(params) {
  return request({
    url: '/dashboard/progress-count',
    method: 'get',
    params
  })
}

export function getWeekEveryDayDispose(params) {
  return request({
    url: '/dashboard/week-every-day-dispose',
    method: 'get',
    params
  })
}

export function getRepFault(params) {
  return request({
    url: '/dashboard/get-rep-fault',
    method: 'get',
    params
  })
}

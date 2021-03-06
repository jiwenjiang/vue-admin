import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

let isFormData = (v) => {
  return Object.prototype.toString.call(v) === '[object FormData]'
}

// create an axios instance
// const baseUrl = 'http://192.168.4.241:5009/'
const baseUrl = 'http://192.168.4.121:5009/'
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'authorization': 'Basic d3NuZ3QtaDU6d3NuZ3QtaDU='
  },
  transformRequest: [function(data) {
    if (!isFormData(data)) {
      data = qs.stringify(data)
    }
    // console.log(1111, data && data.valueOf())
    return data
  }]
})

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log('config', config)
    // do something before request is sent
    // if (config.url.indexOf('/oauth/token') > -1) {
    //   console.log('login')
    // }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (!res.hasOwnProperty('code')) {
      return res
    }
    if (res.code !== 0) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

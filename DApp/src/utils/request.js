import axios from 'axios'
import { useUserStore } from '@/store/user/index.js'
import { showToast } from 'vant'

let _axios = null
/**
 * 初始化
 */
export const baseURL = __config._BASE_API
// export const initAxios = () => {
if (!_axios) {
  _axios = axios.create({
    // 默认请求连接
    baseURL: baseURL,
    // 请求头
    headers: {
      'Content-Type': 'application/json'
    },
    // 超时时间（ms）
    timeout: 10 * 1000
  })
}
// }
// 请求拦截器
_axios.interceptors.request.use((config) => {
  // token 判断
  let userStore = useUserStore()
  let token = userStore.token
  if (token) {
    config.headers['authorization'] = token
    config.headers['satoken'] = token
  }
  config.headers['language'] = document.querySelector('html').getAttribute('language')
  config.headers['lang'] = document.querySelector('html').getAttribute('lang')

  return config
})

// 响应拦截器
_axios.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data.code == '500' && response.data?.msg?.includes('Token')) {
      // 判断钱包清除用户数据  浏览器 跳转登录页
      let userStore = useUserStore()
      userStore.signOut()
      setTimeout(() => location.reload(), 10)
    }
    if (response.data && response.data.code > 0) {
      return Promise.resolve(response.data)
    } else {
      showToast(response.data.msg || 'System error')
      return Promise.reject(response)
    }
  } else {
    showToast('Network anomaly')
    return Promise.resolve(response)
  }
})

/**
 * post 请求
 */
export const post = (url, params) => _axios.post(url, params)

/**
 * get 请求
 */
export const get = (url, params) => _axios.get(url, params)

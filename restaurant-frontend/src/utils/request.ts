import axios from 'axios'
import { message } from 'antd'
import type { Result } from '../types'

const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => {
    const res: Result<unknown> = response.data
    if (res.code !== 200) {
      message.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg))
    }
    return response
  },
  (error) => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request

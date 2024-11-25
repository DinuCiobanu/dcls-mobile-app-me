import * as Sentry from '@sentry/react-native'
import axios from 'axios'
import { store } from '../store'

const options = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

const API = axios.create({
  baseURL: 'https://mydcsl.com/api/',
  ...options,
})

API.interceptors.request.use(
  (config: any) => {
    const token = store.getState().auth?.token

    console.log(token, 'asdsdasdasd')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  (error) => Promise.reject(error),
)

const API_v2 = axios.create({
  baseURL: 'https://mydcsl.com/api/v2/',
  ...options,
})

API_v2.interceptors.request.use(
  (config: any) => {
    const token = store.getState().auth?.token
    console.log(token, 'bebebebbebe')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  (error) => Promise.reject(error),
)

API.interceptors.response.use(undefined, (error) => {
  Sentry.captureEvent({ message: 'network error', extra: error })

  return Promise.reject(error)
})

export const api = {
  v1: API,
  v2: API_v2,
}

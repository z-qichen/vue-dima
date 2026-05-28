import { post, get } from './request'
import type { ApiResponse } from './request'

interface LoginData {
  token: string
  username: string
}

interface UserInfo {
  userId: string
  username: string
}

export function registerApi(username: string, password: string) {
  return post('/register', { username, password })
}

export function loginApi(username: string, password: string) {
  return post<LoginData>('/login', { username, password })
}

export function getUserInfoApi() {
  return get<UserInfo>('/user/info')
}

export type { LoginData, UserInfo }

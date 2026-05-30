import { post, get, del } from './request'
import type { ApiResponse } from './request'
import type { Status } from '@/types'

interface LoginData {
  token: string
  username: string
}

interface UserInfo {
  userId: string
  username: string
}

interface SurveyData {
  _id: string
  userId: string
  title: string
  createDate: number
  updateDate: number
  surveyCount: number
  coms: Status[]
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

export function saveUserQustion(title: string, id?: string, createDate?: number, surveyCount: number = 0, coms?: Status[]) {
  return post('/survey', {
    _id: id,
    title,
    createDate,
    surveyCount,
    coms,
  })
}

export function changeUserQustion(id: string, title: string, createDate?: number, surveyCount: number = 0, coms?: Status[]) {
  return post('/survey', {
    _id: id,
    title,
    createDate,
    surveyCount,
    coms,
  })
}

export function getSurveyListApi() {
  return get<SurveyData[]>('/survey')
}

export function getSurveyByIdApi(id: string) {
  return get<SurveyData>(`/survey/${id}`)
}

export function deleteSurveyApi(id: string) {
  return del(`/survey/${id}`)
}

export type { LoginData, UserInfo, SurveyData }

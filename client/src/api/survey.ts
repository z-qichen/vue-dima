import { get, post, del } from './request'
import type { ApiResponse } from './request'

export interface SurveyData {
  _id: string
  userId: string
  title: string
  createDate: number
  updateDate: number
  surveyCount: number
  coms: any[]
}

export interface SaveSurveyBody {
  _id?: string
  title: string
  createDate?: number
  surveyCount?: number
  coms?: any[]
}

export function saveSurveyApi(body: SaveSurveyBody) {
  return post<SurveyData>('/survey', body)
}

export function getSurveyListApi() {
  return get<SurveyData[]>('/survey')
}

export function getSurveyDetailApi(id: string) {
  return get<SurveyData>(`/survey/${id}`)
}

export function deleteSurveyApi(id: string) {
  return del(`/survey/${id}`)
}

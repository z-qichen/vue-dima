import type { Status } from './common'
export interface SurveyDBData {
  createDate: number
  updateDate: number
  title: string
  surveyCount: number
  coms: Status[]
  _id?: string
}

export interface SurveyDBReturnData extends SurveyDBData {
  id: number
}

// 本地分享问卷数据
export interface QuizDBData {
  id: string
  surveyCount: number
  coms: Status[]
  createDate: number
}

// 本地答卷数据
export interface AnswerDBData {
  id?: number
  quizId: string
  answers: { [key: number]: string | number | Date }
  createDate: number
}

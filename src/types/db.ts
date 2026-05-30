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

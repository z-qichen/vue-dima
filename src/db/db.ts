// db.ts
import Dexie, { type Table } from 'dexie'
import type { SurveyDBData, QuizDBData, AnswerDBData } from '@/types'

// 定义数据库
class SurveyDatabase extends Dexie {
  surveys!: Table<SurveyDBData, number> // 表名和主键类型
  quizzes!: Table<QuizDBData, string> // 本地分享问卷表
  answers!: Table<AnswerDBData, number> // 本地答卷表

  constructor() {
    super('SurveyDatabase')
    this.version(1).stores({
      surveys: '++id, createDate, updateDate, title, surveyCount, coms', // 定义表的模式
    })
    this.version(2).stores({
      surveys: '++id, createDate, updateDate, title, surveyCount, coms',
      quizzes: 'id, createDate',
      answers: '++id, quizId, createDate',
    })
  }
}

// 实例化数据库
const db = new SurveyDatabase()

// 导出数据库实例和类型
export { db }

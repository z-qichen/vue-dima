import { db } from './db'
import type { SurveyDBData, QuizDBData, AnswerDBData } from '@/types'

// 添加数据
export async function saveSurvey(survey: SurveyDBData) {
  return await db.surveys.add(survey)
}

// 查询数据
export async function getSurveys() {
  const allSurveys = await db.surveys.toArray()
  return allSurveys
}

// 获取单个数据
export async function getSurveyById(id: number) {
  const survey = await db.surveys.get(id)
  return survey
}

// 更新数据
export async function updateSurvey(id: number, updatedSurvey: Partial<SurveyDBData>) {
  await db.surveys.update(id, updatedSurvey)
}

// 删除数据
export async function deleteSurvey(id: number) {
  return await db.surveys.delete(id)
}

// ===== 本地分享问卷 =====
// 保存分享问卷
export async function saveQuiz(quiz: QuizDBData) {
  return await db.quizzes.put(quiz)
}

// 根据 id 获取分享问卷
export async function getQuizById(id: string) {
  const quiz = await db.quizzes.get(id)
  return quiz
}

// 删除分享问卷
export async function deleteQuiz(id: string) {
  return await db.quizzes.delete(id)
}

// ===== 本地答卷 =====
// 保存答卷
export async function saveAnswer(answer: AnswerDBData) {
  return await db.answers.add(answer)
}

// 查询某份问卷的所有答卷
export async function getAnswersByQuizId(quizId: string) {
  const answers = await db.answers.where('quizId').equals(quizId).toArray()
  return answers
}

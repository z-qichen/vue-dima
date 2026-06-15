import { ElMessage, ElMessageBox } from 'element-plus'
import { saveSurvey, updateSurvey, deleteSurvey, getSurveyById } from '@/db/operation'
import type { EditorStore } from '@/types'
import { saveUserQustion, changeUserQustion, deleteSurveyApi } from '@/api/user'

export function save(store: EditorStore) {
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt('请输入问卷标题', '提示', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      type: 'info',
    })
      .then(({ value }) => {
        const createDate = new Date().getTime()
        const surveyToSave = {
          createDate,
          updateDate: createDate,
          title: value,
          surveyCount: store.surveyCount,
          coms: JSON.parse(JSON.stringify(store.coms)),
        }
        saveSurvey(surveyToSave)
          .then((id) => {
            saveUserQustion(value, undefined, createDate, store.surveyCount, store.coms)
              .then((res) => {
                if (res.code === 200 && res.data?._id) {
                  updateSurvey(id, { _id: res.data._id })
                }
              })
              .catch(() => {})
            resolve(id)
            ElMessage({
              type: 'success',
              message: '已保存',
            })
          })
          .catch((e) => {
            reject(e)
            console.log('保存失败')
          })
      })
      .catch((e) => {
        console.log(e)
        console.log('取消保存')
      })
  })
}

export function update(store: EditorStore, id: number) {
  return new Promise((resolve, reject) => {
    updateSurvey(id, {
      updateDate: new Date().getTime(),
      surveyCount: store.surveyCount,
      coms: JSON.parse(JSON.stringify(store.coms)),
    })
      .then(async () => {
        try {
          const survey = await getSurveyById(id)
          if (survey?._id) {
            changeUserQustion(survey._id, survey.title, survey.createDate, store.surveyCount, store.coms)
          }
        } catch {}
        resolve(void 0)
        ElMessage({
          type: 'success',
          message: '已保存',
        })
        store.setCurrentComponentIndex(-1)
      })
      .catch((e) => {
        reject(e)
        console.log('取消更新')
      })
  })
}

// 删除试卷
export function remove(id: number) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('确定删除该问卷吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          const survey = await getSurveyById(id)
          await deleteSurvey(id)
          if (survey?._id) {
            deleteSurveyApi(survey._id).catch(() => {})
          }
        } catch (e) {
          reject(e)
          return
        }
        resolve(void 0)
        ElMessage.success('删除成功')
      })
      .catch(() => {
        console.log('取消删除')
      })
  })
}

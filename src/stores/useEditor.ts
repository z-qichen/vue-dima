/**
 * 该仓库用于存储画布的状态
 */
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import textNoteDefaultStatus from '@/configs/defaultStatus/TextNote'
import {
  addOption,
  removeOption,
  setPosition,
  setSize,
  setWeight,
  setItalic,
  setColor,
  setTextType,
  setTextStatus,
  setUse,
  setOptionsStatusByIndex,
  setPicLinkByIndex,
} from '@/stores/actions'
import type { TypeStatus, Status, SurveyDBData } from '@/types'
import { isSurveyComName } from '@/types'
import { v4 as uuidv4 } from 'uuid'
// 编辑器
import TextTypeEditor from '@/components/SurveyComs/EditItems/TextTypeEditor.vue'
import TitleEditor from '@/components/SurveyComs/EditItems/TitleEditor.vue'
import DescEditor from '@/components/SurveyComs/EditItems/DescEditor.vue'
import PositionEditor from '@/components/SurveyComs/EditItems/PositionEditor.vue'
import SizeEditor from '@/components/SurveyComs/EditItems/SizeEditor.vue'
import WeightEditor from '@/components/SurveyComs/EditItems/WeightEditor.vue'
import ItalicEditor from '@/components/SurveyComs/EditItems/ItalicEditor.vue'
import ColorEditor from '@/components/SurveyComs/EditItems/ColorEditor.vue'
// 历史记录
import { HistoryManager, DebounceMerger } from './history'
import {
  createAddCommand,
  createRemoveCommand,
  createUpdateCommand,
  createMoveCommand,
} from './commands'

const initStore = () =>
  [
    Object.assign({}, textNoteDefaultStatus(), {
      status: <TypeStatus>{
        type: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['标题', '段落'],
          isShow: true,
          editCom: markRaw(TextTypeEditor),
          name: 'text-type-editor',
        },
        title: {
          id: uuidv4(),
          status: '问卷标题',
          isShow: true,
          editCom: markRaw(TitleEditor),
          name: 'title-editor',
        },
        desc: {
          id: uuidv4(),
          status: '默认描述内容',
          isShow: false,
          editCom: DescEditor,
          name: 'desc-editor',
        },
        position: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['左对齐', '居中对齐'],
          isShow: false,
          editCom: markRaw(PositionEditor),
          name: 'position-editor',
        },
        titleSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['26', '24', '22'],
          isShow: true,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        descSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['16', '14', '12'],
          isShow: false,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        titleWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: true,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        descWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: false,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        titleItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: true,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        descItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: false,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        titleColor: {
          id: uuidv4(),
          status: '#000',
          isShow: true,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
        descColor: {
          id: uuidv4(),
          status: '#909399',
          isShow: false,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
      },
    }),
    Object.assign({}, textNoteDefaultStatus(), {
      status: <TypeStatus>{
        type: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['标题', '段落'],
          isShow: true,
          editCom: markRaw(TextTypeEditor),
          name: 'text-type-editor',
        },
        title: {
          id: uuidv4(),
          status: '默认标题内容',
          isShow: false,
          editCom: markRaw(TitleEditor),
          name: 'title-editor',
        },
        desc: {
          id: uuidv4(),
          status:
            '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！',
          isShow: true,
          editCom: markRaw(DescEditor),
          name: 'desc-editor',
        },
        position: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['左对齐', '居中对齐'],
          isShow: true,
          editCom: markRaw(PositionEditor),
          name: 'position-editor',
        },
        titleSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['26', '24', '22'],
          isShow: false,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        descSize: {
          id: uuidv4(),
          currentStatus: 0,
          status: ['16', '14', '12'],
          isShow: true,
          editCom: markRaw(SizeEditor),
          name: 'size-editor',
        },
        titleWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: false,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        descWeight: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['加粗', '正常'],
          isShow: true,
          editCom: markRaw(WeightEditor),
          name: 'weight-editor',
        },
        titleItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: false,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        descItalic: {
          id: uuidv4(),
          currentStatus: 1,
          status: ['斜体', '正常'],
          isShow: true,
          editCom: markRaw(ItalicEditor),
          name: 'italic-editor',
        },
        titleColor: {
          id: uuidv4(),
          status: '#000',
          isShow: false,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
        descColor: {
          id: uuidv4(),
          status: '#909399',
          isShow: true,
          editCom: markRaw(ColorEditor),
          name: 'color-editor',
        },
      },
    }),
  ] as unknown as Status[]

export const useEditorStore = defineStore('editor', {
  state: () => ({
    currentComponentIndex: -1,
    surveyCount: 0,
    coms: initStore(),
    // 历史记录
    history: new HistoryManager(),
    debounceMerger: new DebounceMerger(),
    // 用于合并的暂存值
    pendingOldValue: null as unknown,
  }),
  getters: {
    canUndo: (state) => state.history.canUndo,
    canRedo: (state) => state.history.canRedo,
  },
  actions: {
    setCurrentComponentIndex(index: number) {
      this.currentComponentIndex = index
    },
    // 新增一个业务组件（带历史记录）
    addCom(coms: Status[], newCom: Status) {
      const command = createAddCommand(
        coms,
        newCom,
        (c, n) => {
          c.push(n)
          this.currentComponentIndex = -1
          if (isSurveyComName(n.name)) {
            this.surveyCount++
          }
        },
        (idx) => {
          const com = this.coms[idx]
          if (com && isSurveyComName(com.name)) {
            this.surveyCount--
          }
          this.coms.splice(idx, 1)
        },
      )
      this.history.execute(command)
    },
    // 删除组件（带历史记录）
    removeCom(index: number): void {
      const command = createRemoveCommand(
        this.coms,
        index,
        (idx) => {
          const com = this.coms[idx]
          if (com && isSurveyComName(com.name)) {
            this.surveyCount--
          }
          this.coms.splice(idx, 1)
        },
        (c, n) => {
          c.push(n)
          if (isSurveyComName(n.name)) {
            this.surveyCount++
          }
        },
      )
      this.history.execute(command)
    },
    // 更新属性（带历史记录和防抖合并）
    updateStatus(comIndex: number, configKey: string, newValue: unknown) {
      const com = this.coms[comIndex]
      if (!com || !com.status[configKey]) return

      const oldValue = this.getStatusValue(com, configKey)

      const command = createUpdateCommand(
        this.coms,
        comIndex,
        configKey,
        oldValue,
        newValue,
        (coms, idx, key, val) => {
          this.setStatusValue(coms[idx], key, val)
        },
      )

      // 尝试防抖合并
      const mergeResult = this.debounceMerger.tryMerge(command)
      if (mergeResult.shouldMerge) {
        // 需要合并：保留最初的 oldValue，更新 newValue
        const mergedCommand = createUpdateCommand(
          this.coms,
          comIndex,
          configKey,
          this.pendingOldValue ?? oldValue,
          newValue,
          (coms, idx, key, val) => {
            this.setStatusValue(coms[idx], key, val)
          },
        )
        // 替换历史栈中最后一个命令
        this.history.replaceCurrent(mergedCommand)
        // 执行更新
        this.setStatusValue(com, configKey, newValue)
      } else {
        // 不需要合并：记录 oldValue 并执行新命令
        this.pendingOldValue = oldValue
        this.history.execute(command)
      }
    },
    // 移动组件（带历史记录）
    moveCom(oldIndex: number, newIndex: number) {
      const command = createMoveCommand(this.coms, oldIndex, newIndex)
      this.history.execute(command)
    },
    // 撤销
    undo() {
      this.debounceMerger.clear()
      this.pendingOldValue = null
      this.history.undo()
    },
    // 重做
    redo() {
      this.debounceMerger.clear()
      this.pendingOldValue = null
      this.history.redo()
    },
    // 重置
    resetComs() {
      this.surveyCount = 0
      this.currentComponentIndex = -1
      this.coms = initStore()
      this.history.clear()
      this.debounceMerger.clear()
      this.pendingOldValue = null
    },
    // 还原已有问卷的仓库状态
    setStore(storeStatus: SurveyDBData) {
      this.surveyCount = storeStatus.surveyCount
      this.currentComponentIndex = -1
      this.coms = storeStatus.coms
      this.history.clear()
      this.debounceMerger.clear()
      this.pendingOldValue = null
    },
    // 初始化仓库
    initStore() {
      this.surveyCount = 0
      this.currentComponentIndex = -1
      this.coms = initStore()
      this.history.clear()
      this.debounceMerger.clear()
      this.pendingOldValue = null
    },
    // 获取状态值
    getStatusValue(com: Status, configKey: string): unknown {
      const prop = com.status[configKey]
      if (!prop) return undefined
      if ('status' in prop) {
        return prop.status
      }
      if ('currentStatus' in prop) {
        return prop.currentStatus
      }
      return undefined
    },
    // 设置状态值
    setStatusValue(com: Status, configKey: string, value: unknown) {
      const prop = com.status[configKey]
      if (!prop) return
      if ('status' in prop && typeof value === 'string') {
        prop.status = value
      }
      if ('currentStatus' in prop && typeof value === 'number') {
        prop.currentStatus = value
      }
    },
    // 原有的 actions（保留兼容）
    addOption,
    removeOption,
    setPosition,
    setSize,
    setWeight,
    setItalic,
    setColor,
    setTextType,
    setTextStatus,
    setUse,
    setOptionsStatusByIndex,
    setPicLinkByIndex,
  },
})

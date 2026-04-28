import type { Status } from '@/types'

export type CommandType = 'add' | 'remove' | 'update' | 'move'

export interface Command {
  type: CommandType
  execute: () => void
  undo: () => void
  mergeKey?: string
}

export interface HistoryState {
  coms: Status[]
  surveyCount: number
  currentComponentIndex: number
}

export class HistoryManager {
  private history: Command[] = []
  private pointer = -1
  private maxSize = 50
  private isUndoing = false

  get canUndo() {
    return this.pointer >= 0
  }

  get canRedo() {
    return this.pointer < this.history.length - 1
  }

  execute(command: Command) {
    if (this.isUndoing) return

    // 如果当前指针不在末尾，删除指针之后的所有记录
    if (this.pointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.pointer + 1)
    }

    command.execute()
    this.history.push(command)

    // 限制历史记录大小
    if (this.history.length > this.maxSize) {
      this.history.shift()
    } else {
      this.pointer++
    }
  }

  // 替换当前指针位置的命令（用于合并）
  replaceCurrent(command: Command) {
    if (this.pointer >= 0 && this.pointer < this.history.length) {
      this.history[this.pointer] = command
    }
  }

  undo() {
    if (!this.canUndo) return
    this.isUndoing = true
    this.history[this.pointer].undo()
    this.pointer--
    this.isUndoing = false
  }

  redo() {
    if (!this.canRedo) return
    this.isUndoing = true
    this.pointer++
    this.history[this.pointer].execute()
    this.isUndoing = false
  }

  clear() {
    this.history = []
    this.pointer = -1
  }
}

// 防抖合并器，用于合并连续输入
export class DebounceMerger {
  private lastMergeKey: string | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private readonly delay = 300

  tryMerge(command: Command): { shouldMerge: boolean; command: Command } {
    // 如果没有合并键，不合并
    if (!command.mergeKey) {
      return { shouldMerge: false, command }
    }

    // 如果上一个命令存在且 mergeKey 相同，说明需要合并
    if (this.lastMergeKey === command.mergeKey) {
      // 重置定时器
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.lastMergeKey = null
      }, this.delay)
      return { shouldMerge: true, command }
    }

    // 新的命令类型
    this.lastMergeKey = command.mergeKey
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.lastMergeKey = null
    }, this.delay)
    return { shouldMerge: false, command }
  }

  clear() {
    this.lastMergeKey = null
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}

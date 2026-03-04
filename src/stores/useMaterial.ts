// 组件市场里面所有组件状态的仓库
import { defineStore } from 'pinia';
import { defaultStatusMap } from '@/configs/defaultStatus/defaultStatusMap';
import {
  setTextStatus,
  addOption,
  removeOption,
  setPosition,
  setSize,
  setPicLinkByIndex,
} from './actions';

export const useMaterialStore = defineStore('materialStore', {
  state: () => ({
    currentMaterialCom: 'single-select', // 当前选中的组件
    // 记录所有的业务组件
    coms: {
      'single-select': defaultStatusMap['single-select'](),
      'single-pic-select': defaultStatusMap['single-pic-select'](),
      'text-note': defaultStatusMap['text-note']()
    },
  }),
  actions: {
    setCurrentMaterialCom(comName: string) {
      this.currentMaterialCom = comName;
    },
    // 编辑器状态更新
    setTextStatus,
    addOption,
    removeOption,
    setPosition,
    setSize,
    setPicLinkByIndex,
  },
});

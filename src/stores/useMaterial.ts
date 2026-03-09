// 组件市场里面所有组件状态的仓库
import { defineStore } from 'pinia';
import { defaultStatusMap } from '@/configs/defaultStatus/defaultStatusMap';
import {
  setTextStatus,
  addOption,
  removeOption,
  setPosition,
  setCurrentStatus,
  setPicLinkByIndex,
} from './actions';
import { updateInitStatusBeforeAdd } from '@/utils';
import type { Material, Status } from '@/types';

// 哪些业务组件需要初始化
const keyToInit = ['personal-info-gender', 'personal-info-education'] as Material[];

const initializedStates: { [key: string]: Status } = {};

keyToInit.forEach((key) => {
  const defaultStatus = defaultStatusMap[key]() as Status;
  updateInitStatusBeforeAdd(defaultStatus, key);
  initializedStates[key] = defaultStatus;
});

export const useMaterialStore = defineStore('materialStore', {
  state: () => ({
    currentMaterialCom: 'single-select', // 当前选中的组件
    // 记录所有的业务组件
    coms: {
      'single-select': defaultStatusMap['single-select'](),
      'single-pic-select': defaultStatusMap['single-pic-select'](),
      'text-note': defaultStatusMap['text-note'](),
      'personal-info-gender': initializedStates['personal-info-gender'],
      'personal-info-education': initializedStates['personal-info-education'],
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
    setCurrentStatus,
    setPicLinkByIndex,
  },
});

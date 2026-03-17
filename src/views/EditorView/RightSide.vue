<template>
  <div class="right-side-container">
    <div
      v-if="store.currentComponentIndex === -1"
      class="content flex justify-content-center align-items-center"
    >
      点击题型进行编辑
    </div>
    <div v-else>
      <EditPannel :com="currentCom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
// 仓库
import { useEditorStore } from '@/stores/useEditor';
const store = useEditorStore();
import EditPannel from '@/components/SurveyComs/EditItems/EditPannel.vue';

import { ElMessage } from 'element-plus';
import type { PicLink } from '@/types';
import { isPicLink, IsTypeStatus, IsOptionsStatus } from '@/types';
import { changeEditorIsShowStatus } from '@/utils';

const currentCom = computed(() => store.coms[store.currentComponentIndex]);

const updateStatus = (configKey: string, payload?: number | string | boolean | PicLink) => {
  // 拿到新的状态数据之后，就应该去修改仓库里面的数据
  switch (configKey) {
    case 'type': {
      if (typeof payload === 'number' && IsTypeStatus(currentCom.value.status)) {
        // 切换其他编辑器的显示状态
        changeEditorIsShowStatus(currentCom.value.status, payload);
        store.setCurrentStatus(currentCom.value.status[configKey], payload);
      }
      break;
    }
    case 'title':
    case 'desc': {
      if (typeof payload !== 'string') {
        console.error('Invalid payload type for "title or desc". Expected string.');
        return;
      }
      store.setTextStatus(currentCom.value.status[configKey], payload);
      break;
    }
    case 'options': {
      if (IsOptionsStatus(currentCom.value.status))
        if (typeof payload === 'number') {
          // 说明是删除选项
          const result = store.removeOption(currentCom.value.status[configKey], payload);
          if (result) ElMessage.success('删除成功');
          else ElMessage.error('至少保留两个选项');
        } else if (typeof payload === 'object' && isPicLink(payload)) {
          // 说明是在设置图片的链接
          store.setPicLinkByIndex(currentCom.value.status[configKey], payload);
        } else {
          // 说明是新增选项
          store.addOption(currentCom.value.status[configKey]);
        }
      break;
    }
    case 'position': {
      if (typeof payload !== 'number') {
        console.error('Invalid payload type for "position". Expected number.');
        return;
      }
      store.setPosition(currentCom.value.status[configKey], payload);
      break;
    }
    case 'titleSize':
    case 'descSize': {
      if (typeof payload !== 'number') {
        console.error('Invalid payload type for "titleSize or descSize". Expected number.');
        return;
      }
      store.setCurrentStatus(currentCom.value.status[configKey], payload);
      break;
    }
  }
};

const getLink = (link: PicLink) => {
  updateStatus('options', link);
};

provide('updateStatus', updateStatus);
provide('getLink', getLink);
</script>

<style scoped lang="scss">
.right-side-container {
  width: 320px;
  height: calc(100vh - 50px - 40px);
  position: fixed;
  right: 20px;
  top: 70px;
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  overflow-y: scroll;
}
.content {
  height: 100%;
}
</style>

<template>
  <div>
    <buttonGroup :title="`${configKey === 'titleColor' ? '标题' : '描述'}颜色`" :status="status">

    </buttonGroup>
  </div>
</template>

<script setup lang="ts">
import buttonGroup from './buttonGroup.vue'
import { inject } from 'vue';
import type { VueComType } from '@/types/common.ts'
const props = defineProps<{
  status: string;
  isShow: boolean;
  configKey: string;
  editCom: VueComType;
  id: string
}>();
const updateStatus: Function = inject('updateStatus')!
const changePosition = (num: number) => {
  updateStatus(props.configKey, num)
}
</script>

<style scoped></style>

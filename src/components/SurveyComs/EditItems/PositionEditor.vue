<template>
  <div>
    <buttonGroup :title="'居中设置'" :status="status[currentStatus]">
      <!-- 按钮组 -->
      <el-button-group>
        <el-button :class="{
          select: currentStatus === 0,
        }" @click="changePosition(0)">
          <font-awesome-icon icon="align-left" />
        </el-button>
        <el-button :class="{
          select: currentStatus === 1,
        }" @click="changePosition(1)">
          <font-awesome-icon icon="align-center" />
        </el-button>
      </el-button-group>
    </buttonGroup>
  </div>
</template>

<script setup lang="ts">
import buttonGroup from './buttonGroup.vue'
import { inject } from 'vue';
import type { VueComType } from '@/types/common.ts'
const props = defineProps<{
  currentStatus: number;
  status: string[];
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

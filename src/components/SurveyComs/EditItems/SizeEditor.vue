<template>
  <div>
    <buttonGroup :title="`${configKey === 'titleSize' ? '标题' : '描述'}尺寸`" :status="`${status[currentStatus]}px`">
      <el-button-group>
        <el-button :class="{
          select: currentStatus === 0,
        }" @click="changeSize(0)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-daxie"></use>
          </svg>
        </el-button>
        <el-button :class="{
          select: currentStatus === 1,
        }" @click="changeSize(1)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-daxiaoxie"></use>
          </svg>
        </el-button>
        <el-button :class="{
          select: currentStatus === 2,
        }" @click="changeSize(2)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiaoxie"></use>
          </svg>

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
const changeSize = (num: number) => {
  updateStatus(props.configKey, num)
}
</script>

<style scoped></style>

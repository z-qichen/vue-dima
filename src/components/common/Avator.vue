<template>
  <div class="avatar-wrapper">
    <el-avatar :size="size" :src="src" class="avatar-trigger" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  size?: number
}>(), {
  src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  size: 36,
})
</script>

<style lang="less" scoped>
.avatar-wrapper {
  display: inline-flex;
  align-items: center;
}

.avatar-trigger {
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.4s;

  &:hover {
    transform: scale(1.15);
  }
}
</style>

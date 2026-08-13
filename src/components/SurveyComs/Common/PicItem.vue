<template>
  <div @click.stop>
    <div class="container mb-10">
      <div class="top flex justify-content-center align-items-center">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadLocal"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else>
            <el-icon><Upload /></el-icon>
            添加图片
          </div>
        </el-upload>
      </div>
      <div
        class="bottom flex justify-content-center align-items-center flex-direction-column font-weight-500"
      >
        <div class="item">{{ picTitle }}</div>
        <div class="desc mt-5 mb-5">{{ picDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import type { GetLink } from '@/types'
const props = defineProps({
  picTitle: {
    type: String,
    default: '选项',
  },
  picDesc: {
    type: String,
    default: '说明（选填，限24字）',
  },
  value: {
    type: String,
    default: null,
  },
  index: {
    type: Number,
    default: 0,
  },
})
const imageUrl = ref('')
// 预览的时候不会有注入，所以需要设置默认值
const getPicLink = inject<GetLink>('getPicLink', () => {})

watch(
  () => props.value,
  async (newVal) => {
    if (newVal) {
      // base64 图片直接使用，旧的外链地址才需要拉取转换
      if (newVal.startsWith('data:')) {
        imageUrl.value = newVal
      } else {
        const response = await fetch(newVal)
        const blob = await response.blob()
        // 使用 Blob 创建 File 对象
        const file = new File([blob], 'filename.jpg', { type: blob.type })
        imageUrl.value = URL.createObjectURL(file)
      }
    } else {
      imageUrl.value = ''
    }
  },
  { immediate: true },
)

// 本地读取图片为 base64，并写入问卷状态
const uploadLocal: UploadProps['httpRequest'] = (options) => {
  return new Promise((resolve) => {
    const file = options.file as File
    const reader = new FileReader()
    reader.onload = () => {
      if (getPicLink) {
        getPicLink({
          index: props.index,
          link: reader.result as string,
        })
      }
      resolve({})
    }
    reader.onerror = () => resolve({})
    reader.readAsDataURL(file)
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片不能超过2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.container {
  width: 200px;
  height: 300px;
  border: 1px solid var(--font-color-lightest);
  border-radius: var(--border-radius-md);
  color: var(--font-color-light);
  > .top {
    width: 100%;
    height: 200px;
    background-color: var(--font-color-lightest);
  }
  > .bottom {
    height: 100px;
    font-size: var(--font-size-lg);
    > .desc {
      font-size: var(--font-size-base);
      color: var(--font-color-light);
    }
  }
}
.avatar {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>

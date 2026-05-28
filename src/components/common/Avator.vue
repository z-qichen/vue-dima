<template>
  <div class="avatar-wrapper" @mouseenter="visible = true" @mouseleave="visible = false">
    <el-avatar
      :size="size"
      :src="src"
      class="avatar-trigger"
    />

    <transition name="popover-fade">
      <div v-show="visible" class="popover">
        <div class="popover-inner">
          <!-- 用户信息卡片 -->
          <div class="user-card">
            <div class="user-info">
              <el-avatar :size="48" :src="src" />
              <div class="user-meta">
                <span class="user-name">{{ username }}</span>
                <span class="user-sub">LV6 · 大会员</span>
              </div>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-num">0</span>
                <span class="stat-label">关注</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">0</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">0</span>
                <span class="stat-label">获赞</span>
              </div>
            </div>
          </div>

          <div class="divider" />

          <!-- 菜单 -->
          <div class="menu-list">
            <div class="menu-item" v-for="item in menuItems" :key="item.label" @click.stop="item.onClick">
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </div>
          </div>

          <div class="divider" />

          <div class="menu-list">
            <div class="menu-item menu-item--danger" @click.stop="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { House, VideoCamera, Edit, Upload, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const visible = ref(false)

withDefaults(defineProps<{
  src?: string
  size?: number
  username?: string
}>(), {
  src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  size: 36,
  username: '用户昵称',
})

const menuItems = [
  { label: '个人中心', icon: House, onClick: () => router.push('/profile') },
  { label: '投稿管理', icon: VideoCamera, onClick: () => {} },
  { label: '创作中心', icon: Edit, onClick: () => {} },
  { label: '稿件上传', icon: Upload, onClick: () => {} },
]

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('activeView')
  router.push('/login')
}
</script>

<style lang="less" scoped>
.avatar-wrapper {
  position: relative;
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

.popover {
  position: absolute;
  top: 100%;
  right: 0;
  padding-top: 12px;
  z-index: 1000;
}

.popover-inner {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.user-card {
  padding: 16px 16px 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.user-sub {
  font-size: 12px;
  color: #999;
}

.user-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 12px;
}

.menu-list {
  padding: 6px 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f5f5f5;
  }

  &--danger {
    color: #e74c3c;

    &:hover {
      background: #fef0f0;
    }
  }
}

/* 进入/离开动画 */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

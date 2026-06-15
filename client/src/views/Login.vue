<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">启承问卷系统</h1>
      <p class="login-subtitle">{{ isLogin ? '欢迎回来，请登录您的账号' : '创建账号，开始使用问卷系统' }}</p>

      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            native-type="submit"
            :loading="loading"
            class="submit-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入账号"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            native-type="submit"
            :loading="loading"
            class="submit-btn"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换 -->
      <div class="switch-row">
        <span>{{ isLogin ? '没有账号？' : '已有账号？' }}</span>
        <el-button link type="primary" @click="toggleMode">
          {{ isLogin ? '立即注册' : '返回登录' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { loginApi, registerApi } from '@/api/user'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)

const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const loginForm = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const validateUsername = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入账号'))
  } else if (value.length < 3 || value.length > 20) {
    callback(new Error('账号长度应为3-20个字符'))
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('账号仅支持字母、数字和下划线'))
  } else {
    callback()
  }
}

const validatePassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 32) {
    callback(new Error('密码长度应为6-32个字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const loginRules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}

const registerRules: FormRules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  loginFormRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await loginApi(loginForm.username, loginForm.password)
      if (res.code === 200 && res.data) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        ElMessage.success('登录成功')
        router.push('/home')
      } else {
        ElMessage.error(res.message || '登录失败')
      }
    } catch {
      ElMessage.error('网络错误，请稍后重试')
    } finally {
      loading.value = false
    }
  })
}

const handleRegister = () => {
  registerFormRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await registerApi(registerForm.username, registerForm.password)
      if (res.code === 200) {
        ElMessage.success('注册成功，请登录')
        toggleMode()
      } else {
        ElMessage.error(res.message || '注册失败')
      }
    } catch {
      ElMessage.error('网络错误，请稍后重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #e0f0ff 100%);
}

.login-card {
  width: 420px;
  padding: 48px 40px 36px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 8px 32px rgba(31, 35, 41, 0.12);
}

.login-title {
  margin: 0 0 8px;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #1f2329;
  letter-spacing: 0;
}

.login-subtitle {
  margin: 0 0 36px;
  text-align: center;
  font-size: 14px;
  color: #8a9099;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #8a9099;
}
</style>

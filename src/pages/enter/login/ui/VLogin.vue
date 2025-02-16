<template>
  <VCard class="card">
    <div class="inner">
      <template v-if="currentScreen === 'login'">
        <div class="title">Вход в Kinko</div>
        <div class="desc">Войдите в свой профиль, чтобы получить доступ к вашим паролям</div>
        <div class="content">
          <VPassword
            v-model="password"
            label="Пароль"
            placeholder="Введите ваш пароль"
            toggleMask
            class="mb-4" />
          <VButton
            label="Войти"
            @click="handleLogin" />
          <VButton
            label="Забыли пароль?"
            severity="secondary"
            @click="currentScreen = 'login'"
            class="mt-2" />
        </div>
      </template>
      <template v-if="currentScreen === 'recover'">
        <div class="title">Восстановление пароля</div>
        <div class="desc">Введите ваш email, чтобы восстановить доступ к профилю</div>
        <div class="content">
          <VButton label="Восстановить" />
          <VButton
            label="Назад"
            severity="secondary"
            @click="currentScreen = 'login'"
            class="mt-2" />
        </div>
      </template>
      <VMessage
        v-if="errorMessage"
        sticky
        severity="error"
        class="mt-4"
        :message="errorMessage" />
    </div>
  </VCard>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { profileModel } from '@/entities/profile'
import { useCrypto } from '@/shared/lib/crypto'
import { isNull } from '@/shared/lib/typeguards'
import { VPassword } from '@/shared/ui/password'
import { VMessage } from '@/shared/ui/message'
import { VButton } from '@/shared/ui/button'
import { VCard } from '@/shared/ui/card'

const router = useRouter()

const screens = ['login', 'recover'] as const
const currentScreen = ref<(typeof screens)[number]>('login')

const password: Ref<Nullable<string>> = ref(null)

// Сообщение об ошибке
const errorMessage = ref<Nullable<string>>(null)

// Обработка входа
const { profile, currentPassword } = profileModel()
const { getHash } = useCrypto()

const handleLogin = async () => {
  try {
    if (isNull(profile.value) || isNull(password.value)) return
    errorMessage.value = null
    const hashPassword = getHash(password.value, profile.value.salt, 'strong')
    if (hashPassword !== profile.value.hashedPassword) return
    currentPassword.value = password.value
    // await login(loginForm.value.login, loginForm.value.password)
    router.push({ name: 'credentialList' }) // Перенаправляем на страницу с паролями
  } catch (error) {
    // errorMessage.value = error.message || 'Ошибка при входе'
  }
}
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mt-2 {
  margin-top: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>

<template>
  <VCard class="card">
    <div class="inner">
      <template v-if="currentScreen === 'welcome'">
        <div class="title">Добро пожаловать в Kinko</div>
        <div class="desc">
          Храните ваши пароли в безопасности и получайте к ним доступ в любое время
        </div>
        <div class="content">
          <VButton
            label="Создать профиль"
            @click="currentScreen = 'create'" />
          <VButton
            label="Восстановить профиль"
            severity="secondary"
            @click="currentScreen = 'create'" />
        </div>
      </template>
      <CreationWizard
        v-if="currentScreen === 'create'"
        v-model:message="errorMessage"
        @cancel-creation="currentScreen = 'welcome'" />
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
import { VMessage } from '@/shared/ui/message'
import { VButton } from '@/shared/ui/button'
import { VCard } from '@/shared/ui/card'
import CreationWizard from './CreationWizard.vue'

const screens = ['welcome', 'create', 'recover'] as const
const currentScreen: Ref<(typeof screens)[number]> = ref('welcome')

const errorMessage: Ref<Nullable<string>> = ref(null)
</script>

<style scoped lang="scss">
.card {
  width: 100%;
  max-width: 480px;
  justify-content: center;
  position: relative;
}

.inner {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 1.2rem 0;
}

.desc {
  color: var(--text-color-secondary);
  line-height: 1.5;
  margin: 1rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0 auto;
}
</style>

<template>
  <div class="nav">
    <VButton
      size="small"
      variant="text"
      icon="pi pi-arrow-left"
      @click="stepBackHandler" />
  </div>
  <Transition
    name="fade"
    mode="out-in">
    <div
      :key="currentStep"
      class="title">
      {{ titles[currentStep] }}
    </div>
  </Transition>
  <Transition
    name="fade"
    mode="out-in">
    <div
      :key="currentStep"
      class="desc">
      {{ descs[currentStep] }}
    </div>
  </Transition>
  <Transition
    name="fade"
    mode="out-in">
    <div
      :key="currentStep"
      class="content"
      :class="{ blur: inProcess }">
      <template v-if="currentStep === 'password'">
        <VPassword
          v-model:password="masterPassword"
          feedback
          class="password"
          placeholder="Пароль" />
        <VPassword
          v-model:password="confirmPassword"
          class="password"
          placeholder="Подтвердите пароль" />
        <VButton
          label="Продолжить"
          @click="handleSeedsGenerate" />
      </template>
      <template v-if="currentStep === 'seeds'">
        <div class="seeds-grid">
          <div
            v-for="seed in seedCollection"
            :key="seed"
            class="seed">
            {{ seed }}
          </div>
        </div>
        <VButton
          label="Продолжить"
          @click="currentStep = 'complete'" />
      </template>
      <template v-if="currentStep === 'complete'">
        <VButton
          label="Начать"
          @click="handleCreateProfile" />
      </template>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isNull } from '@/shared/lib/typeguards'
import { useWait } from '@/shared/lib/network'
import { VPassword } from '@/shared/ui/password'
import { VButton } from '@/shared/ui/button'
import { creationProfileModel } from '../model'

const STEPS = ['password', 'seeds', 'complete'] as const
type Step = (typeof STEPS)[number]

const { getSeeds, createProfile } = creationProfileModel()

const titles: Record<Step, string> = {
  password: 'Придумайте пароль',
  seeds: 'Сохраните seed-фразы',
  complete: 'Все готово!'
}

const descs: Record<Step, string> = {
  password: 'Используется для входа',
  seeds: 'Никому и никогда не сообщайте seed-фразы',
  complete: 'Теперь профилем можно пользоваться'
}

const emit = defineEmits<{
  (e: 'cancelCreation'): void
}>()

const currentStep: Ref<Step> = ref('password')

const stepBackHandler = (): void => {
  const currentIndex = STEPS.findIndex((step) => step === currentStep.value)

  if (currentIndex === -1) return

  message.value = null

  if (STEPS[currentIndex] === 'password') {
    emit('cancelCreation')
    return
  }

  currentStep.value = STEPS[currentIndex - 1]
}

const masterPassword: Ref<Nullable<string>> = ref(null)
const confirmPassword: Ref<Nullable<string>> = ref(null)

const message = defineModel<Nullable<string>>('message', { default: null })

const seedPhrases: Ref<Nullable<string>> = ref(null)
const seedCollection: Ref<Array<string>> = computed(() =>
  isNull(seedPhrases.value) ? [] : seedPhrases.value.split(' ')
)

const inProcess: Ref<boolean> = ref(false)

const handleSeedsGenerate = async (): Promise<void> => {
  if (seedPhrases.value) {
    currentStep.value = 'seeds'
    return
  }

  inProcess.value = true
  await useWait()
  const result = getSeeds(masterPassword.value, confirmPassword.value)
  inProcess.value = false

  if (!result.success) {
    message.value = result.error
    return
  }

  message.value = null

  seedPhrases.value = result.seeds
  currentStep.value = 'seeds'
}

const router = useRouter()
const handleCreateProfile = async () => {
  if (!masterPassword.value || !seedPhrases.value) return

  inProcess.value = true

  await useWait()
  createProfile(masterPassword.value, seedPhrases.value)

  inProcess.value = false

  router.push({ name: 'credentialList' })
}
</script>

<style scoped lang="scss">
.nav {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.2rem 0;
}

.desc {
  line-height: 1.5;
  margin: 1rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0 auto;

  &.blur {
    filter: blur(0.2rem);
  }
}

.password {
  display: contents;
}

.seeds-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin: 1.2rem;
}

.seed {
  border: 1px solid var(--p-card-color);
  border-radius: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

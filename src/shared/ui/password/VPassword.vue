<template>
  <Password
    v-model="password"
    :readonly
    :feedback
    :toggleMask
    :placeholder />
</template>

<script setup lang="ts">
import { Password } from 'primevue'

interface Props {
  placeholder?: string
  feedback?: boolean
  toggleMask?: boolean
  readonly?: boolean
}

defineProps<Props>()
const password = defineModel<Nullable<string>>('password', { default: null })
</script>

<style scoped lang="scss">
:deep(.p-password-input) {
  width: 100%;
}
</style>

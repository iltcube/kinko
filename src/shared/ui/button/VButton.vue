<template>
  <Button
    :icon
    :size
    :label
    :variant
    :severity
    @click="$emit('click')" />
</template>

<script setup lang="ts">
import { Button } from 'primevue'

interface Props {
  icon?: string
  label?: string
  variant?: 'text' | 'outlined' | 'link'
  size?: 'small' | 'large'
  severity?: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
}

defineProps<Props>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

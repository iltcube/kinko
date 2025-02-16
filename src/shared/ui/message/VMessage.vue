<template>
  <Message
    :sticky
    :severity>
    {{ message }}
  </Message>
</template>

<script setup lang="ts">
import { Message } from 'primevue'

interface Props {
  severity: 'success' | 'info' | 'warn' | 'error'
  sticky?: boolean
  message: Nullable<string>
}

defineProps<Props>()
</script>

<template>
  <Card>
    <template
      v-if="title"
      #title>
      {{ title }}
    </template>
    <template
      v-if="subtitle"
      #subtitle>
      {{ subtitle }}
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card } from 'primevue'

interface Props {
  title?: string
  subtitle?: string
}

defineProps<Props>()
</script>

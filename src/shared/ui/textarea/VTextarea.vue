<template>
  <Textarea
    v-model="text"
    id="notes"
    rows="3" />
</template>

<script setup lang="ts">
import { Textarea } from 'primevue'

const text = defineModel<Nullable<string>>({ default: null })
</script>

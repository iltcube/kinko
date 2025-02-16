<template>
  <InputText
    v-model="inputText"
    :placeholder />
</template>

<script setup lang="ts">
import { InputText } from 'primevue'

interface Props {
  placeholder?: string
}

defineProps<Props>()

const inputText = defineModel<Nullable<string>>({ default: null })
</script>

<style scoped lang="scss"></style>

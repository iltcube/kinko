<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profileModel } from '@/entities/profile'
import { VPassword } from '@/shared/ui/password'
import type { ServiceCredentials } from '@/entities/profile/model/types'

import { Dialog, Password, Button, Textarea, InputText } from 'primevue'

import { useUniversalClipboard } from './clipboard'

const { copyToClipboard, resetAfterDelay, isCopied } = useUniversalClipboard()

const copy = async (text: string) => {
  if (text) {
    await copyToClipboard(text)
    if (isCopied.value) {
      resetAfterDelay(2000) // Сбросить состояние через 2 секунды
    }
  }
}

const route = useRoute()
const router = useRouter()
const { currentPassword, getCredentials, deleteCredentials } = profileModel()
const credential = ref<ServiceCredentials | null>(null)
const loading = ref(false)
const showMasterPasswordDialog = ref(true)

const loadCredential = async () => {
  const id = route.params.id as UUIDv7
  if (!currentPassword.value) return
  try {
    loading.value = true
    credential.value = getCredentials(currentPassword.value, id)
  } catch (error) {
    console.error('Failed to load credential:', error)
    router.push({ name: 'credentialList' })
  } finally {
    loading.value = false
  }
}

onMounted(loadCredential)

const handleMasterPasswordSubmit = () => {
  showMasterPasswordDialog.value = false
  loadCredential()
}

// const copyToClipboard = async (text: string) => {
//   try {
//     await navigator.clipboard.writeText(text)
//     // Показать уведомление об успешном копировании
//   } catch (error) {
//     console.error('Failed to copy:', error)
//   }
// }

const handleDelete = async () => {
  try {
    const id = route.params.id as UUIDv7
    deleteCredentials(id)
    router.push({ name: 'credentialList' })
  } catch (error) {
    console.error('Failed to delete credential:', error)
  }
}

const navigateToEdit = () => {
  router.push({ name: 'credentialList' })
}
</script>

<template>
  <div class="card">
    isSupported - {{ isSupported }}
    <div
      v-if="credential"
      class="flex flex-column gap-4">
      <div class="flex justify-content-between align-items-center">
        <h1 class="title">{{ credential.serviceName }}</h1>
        <div
          v-if="false"
          class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            severity="info"
            @click="navigateToEdit" />
          <Button
            icon="pi pi-trash"
            severity="danger"
            @click="handleDelete" />
        </div>
      </div>

      <div class="grid">
        <div class="field">
          <label>Login</label>
          <div class="p-inputgroup">
            <InputText
              :value="credential.login"
              readonly />
            <Button
              icon="pi pi-copy"
              @click="copy(credential.login)" />
          </div>
        </div>

        <div class="field">
          <label>Password</label>
          <div class="p-inputgroup">
            <VPassword
              v-model:password="credential.password"
              toggleMask
              readonly />
            <Button
              icon="pi pi-copy"
              @click="copy(credential.password)" />
          </div>
        </div>

        <div
          v-if="credential.url"
          class="field">
          <label>URL</label>
          <div class="p-inputgroup">
            <InputText
              :value="credential.url"
              readonly />
            <Button
              icon="pi pi-external-link"
              @click="
                () => {
                  //   window.open(credential.url, '_blank')
                }
              " />
          </div>
        </div>

        <div
          v-if="credential.notes"
          class="field">
          <label>Notes</label>
          <Textarea
            :value="credential.notes"
            rows="3"
            readonly />
        </div>
        <Button
          label="Back"
          @click="router.push({ name: 'credentialList' })"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  text-align: center;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.p-inputgroup {
  display: flex;
  gap: 1rem;
}

.p-inputtext {
  flex-grow: 1;
}

.p-password {
  width: 100%;
}
</style>

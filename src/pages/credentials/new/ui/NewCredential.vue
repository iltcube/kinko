<template>
  <div class="card">
    <h1 class="title">Add New Credentials</h1>
    <div class="fields">
      <div class="field">
        <label for="serviceName">Service Name</label>
        <InputString
          v-model="newCredential.serviceName"
          id="serviceName" />
      </div>
      <div class="field">
        <label for="login">Login</label>
        <InputString
          v-model="newCredential.login"
          id="login" />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <VPassword
          v-model:password="newCredential.password"
          id="password"
          toggleMask />
      </div>
      <div class="field">
        <label for="url">URL (optional)</label>
        <InputString
          v-model="newCredential.url"
          id="url" />
      </div>
      <div class="field">
        <label for="notes">Notes (optional)</label>
        <VTextarea
          v-model="newCredential.notes"
          id="notes"
          rows="3" />
      </div>
      <div class="buttons">
        <VButton
          label="Cancel"
          severity="secondary"
          @click="handleCancel" />
        <VButton
          label="Save"
          @click="handleSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { ServiceCredentials } from '@/entities/profile'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { profileModel } from '@/entities/profile'
import { isNull } from '@/shared/lib/typeguards'
import { InputString } from '@/shared/ui/inputString'
import { VPassword } from '@/shared/ui/password'
import { VButton } from '@/shared/ui/button'
import { VTextarea } from '@/shared/ui/textarea'

type NewCredential = NullableProperties<Omit<ServiceCredentials, 'id' | 'createdAt' | 'updatedAt'>>

const newCredential: Ref<NewCredential> = ref({
  serviceName: null,
  login: null,
  password: null,
  url: null,
  notes: null
})

const isNewCredentialValid = (
  credential: NewCredential
): credential is Omit<ServiceCredentials, 'id' | 'createdAt' | 'updatedAt'> =>
  !isNull(credential.serviceName) && !isNull(credential.login) && !isNull(credential.password)

const newCredentialMap = (
  credential: NewCredential
): Omit<ServiceCredentials, 'id' | 'createdAt' | 'updatedAt'> => {
  if (!isNewCredentialValid(credential))
    throw new Error('Invalid credential: required fields are null')

  return {
    serviceName: credential.serviceName,
    login: credential.login,
    password: credential.password,
    url: credential.url ?? undefined,
    notes: credential.notes ?? undefined
  }
}

const router = useRouter()
const { currentPassword, addCredentials } = profileModel()

const handleSave = () => {
  if (isNull(currentPassword.value)) throw new Error('Invalid credential: master password is null')

  addCredentials(currentPassword.value, newCredentialMap(newCredential.value))
  router.push({ name: 'credentialList' })
}

const handleCancel = () => {
  router.push({ name: 'credentialList' })
}
</script>

<style scoped lang="scss">
.title {
  text-align: center;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.password {
  &.p-password {
    .p-inputtext {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="header">
    <div class="title">
      <h1>Kinko</h1>
    </div>
    <InputString
      v-model="searchQuery"
      placeholder="Search credentials..." />
  </div>
  <VTable :credentials="filteredCredentials" />
  <VButton
    icon="pi pi-plus"
    label="Add New Credential"
    class="createCredentials"
    @click="router.push({ name: 'newCredential' })" />
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { ServiceCredentials } from '@/entities/profile'

import { ref, shallowRef, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { profileModel } from '@/entities/profile'
import { isNull } from '@/shared/lib/typeguards'
import { InputString } from '@/shared/ui/inputString'
import { VButton } from '@/shared/ui/button'
import VTable from './VTable.vue'

const router = useRouter()

const credentials: Ref<Array<ServiceCredentials>> = shallowRef([])

const searchQuery: Ref<Nullable<string>> = ref(null)
const filteredCredentials: Ref<Array<ServiceCredentials>> = computed(() => {
  if (!searchQuery.value) return credentials.value

  const query = searchQuery.value.toLowerCase()

  return credentials.value.filter(
    (cred) =>
      cred.serviceName.toLowerCase().includes(query) ||
      cred.login.toLowerCase().includes(query) ||
      (cred.url && cred.url.toLowerCase().includes(query))
  )
})

const { currentPassword, getAllCredentials } = profileModel()
const loadCredentials = async () => {
  if (isNull(currentPassword.value)) throw new Error('Password is required to access credentials')

  const result = getAllCredentials(currentPassword.value)

  credentials.value = [...result].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

onMounted(loadCredentials)
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;

  i {
    font-size: 1.8rem;
    color: var(--primary-color);
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.createCredentials {
  margin: auto 0 2rem;
  width: 100%;
}

@media screen and (max-width: 576px) {
  .title {
    i {
      font-size: 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>

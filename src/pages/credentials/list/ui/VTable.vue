<template>
  <DataTable
    :value="credentials"
    :paginator="credentials.length > PAGE_SIZE"
    :rows="PAGE_SIZE"
    dataKey="id"
    selectionMode="single"
    class="table"
    @rowSelect="rowSelectHandler">
    <template #empty>
      <div class="empty">
        <i class="pi pi-lock text-6xl" />
        <h3>No credentials found</h3>
        <p>Add your first password to get started</p>
      </div>
    </template>
    <Column
      field="index"
      header="#">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column
      field="serviceName"
      header="Service">
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <div class="info">
            <span class="name">{{ data.serviceName }}</span>
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="createdAt"
      header="Created">
      <template #body="{ data }">
        {{ useDateFormat(data.createdAt, 'DD.MM.YY') }}
      </template>
    </Column>
    <Column
      field="updatedAt"
      header="Updated">
      <template #body="{ data }">
        {{ useDateFormat(data.updatedAt, 'DD.MM.YY') }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { ServiceCredentials } from '@/entities/profile'

import { useRouter } from 'vue-router'
import { DataTable, Column } from 'primevue'
import { useDateFormat } from '@/shared/lib/forrmat'

interface Props {
  credentials: Array<ServiceCredentials>
}

defineProps<Props>()

const PAGE_SIZE = 10

const router = useRouter()
const rowSelectHandler = (event: { data: ServiceCredentials }) => {
  router.push({ name: 'credentialDetail', params: { id: event.data.id } })
}
</script>

<style scoped lang="scss">
.table {
  overflow: hidden;
  border-radius: 12px;
}

.info {
  display: flex;
  flex-direction: column;

  .name {
    font-weight: 600;
    color: var(--text-color);
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  i {
    color: var(--surface-300);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    margin: 0 0 1.5rem 0;
  }
}
</style>

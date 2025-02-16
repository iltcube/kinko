import type { Ref } from 'vue'
import type { RemovableRef } from '@vueuse/core'
import type { ServiceCredentials, EncryptedServiceCredentials, Profile } from './types'

import { ref, computed } from 'vue'
import { useStorage } from '@/shared/lib/browser'
import { isNull } from '@/shared/lib/typeguards'
import { useCrypto } from '@/shared/lib/crypto'
import { getUniqueId } from '@/shared/lib/uuid'

interface ProfileStore {
  profile: RemovableRef<Nullable<Profile>>
  currentPassword: Ref<Nullable<string>>
  isAuthuthenticated: Ref<boolean>
  isAuthorized: Ref<boolean>
  addCredentials: (
    masterPassword: string,
    credentials: Omit<ServiceCredentials, 'id' | 'updatedAt' | 'createdAt'>
  ) => void
  getCredentials: (masterPassword: string, id: UUIDv7) => Nullable<ServiceCredentials>
  getAllCredentials: (masterPassword: string) => Array<ServiceCredentials>
  updateCredentials: (
    masterPassword: string,
    id: UUIDv7,
    credentials: Partial<Omit<ServiceCredentials, 'id' | 'updatedAt' | 'createdAt'>>
  ) => void
  deleteCredentials: (id: UUIDv7) => void
}

const readHandler = (profile: unknown): Nullable<Profile> => {
  if (typeof profile === 'string') {
    try {
      const parsed = JSON.parse(profile) as Profile

      if (Object.keys(parsed).length === 0) return null

      return parsed
    } catch {
      return null
    }
  }
  return null
}

const writeHandler = (profile: unknown): string => {
  if (typeof profile === 'object' && profile !== null) {
    return JSON.stringify(profile)
  }
  return JSON.stringify({})
}

const profile: RemovableRef<Nullable<Profile>> = useStorage<Nullable<Profile>>(
  'profile',
  null,
  localStorage,
  {
    serializer: {
      read: readHandler,
      write: writeHandler
    }
  }
)

const currentPassword: Ref<Nullable<string>> = ref(null)

const isAuthuthenticated: Ref<boolean> = computed(() => !isNull(profile.value))

const isAuthorized: Ref<boolean> = computed(
  () => isAuthuthenticated.value && !isNull(currentPassword.value)
)

export const useProfileStore = (): ProfileStore => {
  const { encrypt, decrypt, getHash } = useCrypto()

  const getEncryptionKey = (masterPassword: string): string => {
    if (!profile.value) throw new Error('Profile not initialized')
    return getHash(masterPassword, profile.value.salt, 'standart')
  }

  const encryptCredentials = (
    data: ServiceCredentials,
    encryptionKey: string
  ): EncryptedServiceCredentials => {
    return {
      id: data.id,
      encryptedData: encrypt(JSON.stringify(data), encryptionKey),
      updatedAt: data.updatedAt,
      createdAt: data.createdAt
    }
  }

  const decryptCredentials = (
    data: EncryptedServiceCredentials,
    encryptionKey: string
  ): ServiceCredentials => {
    const decryptedData = decrypt(data.encryptedData, encryptionKey)
    return JSON.parse(decryptedData)
  }

  const addCredentials = (
    masterPassword: string,
    credentials: Omit<ServiceCredentials, 'id' | 'updatedAt' | 'createdAt'>
  ): void => {
    if (!profile.value) throw new Error('Profile not initialized')

    const encryptionKey = getEncryptionKey(masterPassword)
    const now = new Date().toISOString() as DateUTC

    const fullCredentials: ServiceCredentials = {
      ...credentials,
      id: getUniqueId(),
      updatedAt: now,
      createdAt: now
    }

    const encryptedCredentials = encryptCredentials(fullCredentials, encryptionKey)

    profile.value.credentials.push(encryptedCredentials)
  }

  const getCredentials = (masterPassword: string, id: UUIDv7): Nullable<ServiceCredentials> => {
    if (!profile.value) throw new Error('Profile not initialized')
    if (!profile.value.credentials.length) return null

    const encryptionKey = getEncryptionKey(masterPassword)
    const encryptedCredentials = profile.value.credentials.find((cred) => cred.id === id)

    if (!encryptedCredentials) return null

    return decryptCredentials(encryptedCredentials, encryptionKey)
  }

  const getAllCredentials = (masterPassword: string): Array<ServiceCredentials> => {
    if (!profile.value) throw new Error('Profile not initialized')
    if (!profile.value.credentials.length) return []

    const encryptionKey = getEncryptionKey(masterPassword)

    return profile.value.credentials.map((encryptedCred) =>
      decryptCredentials(encryptedCred, encryptionKey)
    )
  }

  const updateCredentials = (
    masterPassword: string,
    id: UUIDv7,
    credentials: Partial<Omit<ServiceCredentials, 'id' | 'updatedAt' | 'createdAt'>>
  ): void => {
    if (!profile.value) throw new Error('Profile not initialized')
    if (!profile.value.credentials.length) throw new Error('No credentials found')

    const encryptionKey = getEncryptionKey(masterPassword)
    const index = profile.value.credentials.findIndex((cred) => cred.id === id)

    if (index === -1) throw new Error('Credentials not found')

    const existing = decryptCredentials(profile.value.credentials[index], encryptionKey)
    const updated: ServiceCredentials = {
      ...existing,
      ...credentials,
      updatedAt: new Date().toISOString() as DateUTC
    }

    const encryptedUpdated = encryptCredentials(updated, encryptionKey)

    profile.value.credentials[index] = encryptedUpdated
  }

  const deleteCredentials = (id: UUIDv7): void => {
    if (!profile.value) throw new Error('Profile not initialized')
    if (!profile.value.credentials.length) throw new Error('No credentials found')

    profile.value.credentials = profile.value.credentials.filter((cred) => cred.id !== id)
  }

  return {
    profile,
    currentPassword,
    isAuthuthenticated,
    isAuthorized,
    addCredentials,
    getCredentials,
    getAllCredentials,
    updateCredentials,
    deleteCredentials
  }
}

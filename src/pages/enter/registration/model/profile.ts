import { profileModel } from '@/entities/profile'
import { isNull } from '@/shared/lib/typeguards'
import { useCrypto } from '@/shared/lib/crypto'
import { isPasswordValid, errorMessage } from '../lib'

interface SeedsGenerateSuccess {
  success: true
  seeds: string
  error?: never
}

interface SeedsGenerateFailure {
  success: false
  error: string
  seeds?: never
}

type SeedsGenerate = SeedsGenerateSuccess | SeedsGenerateFailure

interface CreationProfileStore {
  getSeeds: (masterPassword: Nullable<string>, confirmPassword: Nullable<string>) => SeedsGenerate
  createProfile: (masterPassword: string, seeds: string) => void
}

const { profile, currentPassword } = profileModel()
const { getSalt, getHash, generateSeeds, encrypt } = useCrypto()

export const useCreationProfileStore = (): CreationProfileStore => {
  const getSeeds = (
    masterPassword: Nullable<string>,
    confirmPassword: Nullable<string>
  ): SeedsGenerate => {
    if (isNull(masterPassword) || isNull(confirmPassword))
      return { success: false, error: 'Пароль не может быть пустым' }

    if (masterPassword !== confirmPassword) return { success: false, error: 'Пароли не совпадают' }

    if (!isPasswordValid(masterPassword))
      return { success: false, error: errorMessage.value ?? 'Пароль не валиден' }

    const generatedSeedPhrase = generateSeeds()

    return { success: true, seeds: generatedSeedPhrase }
  }

  const createProfile = (masterPassword: string, seeds: string): void => {
    const salt = getSalt()
    const hashedPassword = getHash(masterPassword, salt, 'strong')
    const encryptionKey = getHash(masterPassword, salt, 'standart')
    const encryptedSeed = encrypt(seeds, encryptionKey)

    profile.value = {
      hashedPassword,
      salt,
      encryptedSeed,
      credentials: [],
      created: new Date().toISOString() as DateUTC
    }

    currentPassword.value = masterPassword
  }

  return { getSeeds, createProfile }
}

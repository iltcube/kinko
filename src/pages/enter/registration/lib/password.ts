import type { Ref } from 'vue'

import { ref } from 'vue'

type ErrorMessageType<T extends boolean> = T extends true ? null : string

const MIN_LENGTH = 8

const hasUpperCase = (password: string) => /[A-Z]/.test(password)
const hasLowerCase = (password: string) => /[a-z]/.test(password)
const hasNumbers = (password: string) => /\d/.test(password)
const hasSpecialChar = (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password)

export const errorMessage: Ref<Nullable<string>> = ref(null)

export const isPasswordValid = (password: string): boolean => {
  if (password.length < MIN_LENGTH) {
    errorMessage.value = 'Пароль должен содержать минимум 8 символов'
    return false
  }

  if (!hasUpperCase(password) || !hasLowerCase(password)) {
    errorMessage.value = 'Пароль должен содержать заглавные и строчные буквы'
    return false
  }

  if (!hasNumbers(password)) {
    errorMessage.value = 'Пароль должен содержать цифры'
    return false
  }

  if (!hasSpecialChar(password)) {
    errorMessage.value = 'Пароль должен содержать специальные символы'
    return false
  }

  errorMessage.value = null
  return true
}

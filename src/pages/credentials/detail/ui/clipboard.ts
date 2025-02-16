import { ref } from 'vue'

export function useUniversalClipboard() {
  const isCopied = ref(false)
  const copyError = ref<string | null>(null)

  const copyToClipboard = async (text: string) => {
    // Сбрасываем состояние
    isCopied.value = false
    copyError.value = null

    try {
      // Пробуем современный Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        isCopied.value = true
        return true
      }

      // Запасной вариант для Safari: создаем временный элемент ввода
      const tempInput = document.createElement('input')
      tempInput.value = text
      document.body.appendChild(tempInput)

      // Выбираем текст для iOS
      tempInput.select()
      tempInput.setSelectionRange(0, 99999) // Для мобильных устройств

      // Пробуем вызвать команду копирования
      if (document.execCommand('copy')) {
        isCopied.value = true
      } else {
        copyError.value = 'Команда копирования не поддерживается'
      }

      // Удаляем временный элемент
      document.body.removeChild(tempInput)

      return isCopied.value
    } catch (error) {
      copyError.value = error instanceof Error ? error.message : 'Неизвестная ошибка'
      return false
    }
  }

  // Функция для сброса состояния после задержки
  const resetAfterDelay = (delay = 2000) => {
    setTimeout(() => {
      isCopied.value = false
    }, delay)
  }

  return {
    isCopied,
    copyError,
    copyToClipboard,
    resetAfterDelay
  }
}

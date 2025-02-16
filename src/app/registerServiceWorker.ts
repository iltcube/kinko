import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Регистрируем Service Worker
    const updateSW = registerSW({
      onNeedRefresh() {
        // Здесь можно показать пользователю сообщение о доступном обновлении
        if (confirm('Доступно обновление. Обновить?')) {
          updateSW()
        }
      },
      onOfflineReady() {
        console.log('Приложение готово к работе офлайн')
        // Можно показать уведомление пользователю
      }
    })
  }
}

import { createRouter, createWebHistory } from 'vue-router'
import { profileModel } from '@/entities/profile'
import { routes } from './routes'

const { isAuthorized, isAuthuthenticated } = profileModel()

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    return next({ name: isAuthorized.value ? 'credentials' : 'enter' })
  }

  if (
    isAuthorized.value &&
    (to.name === 'enter' || to.name === 'login' || to.name === 'registration')
  ) {
    return next({ name: 'credentials' })
  }

  if (
    !isAuthorized.value &&
    to.name !== 'enter' &&
    to.name !== 'login' &&
    to.name !== 'registration'
  ) {
    return next({ name: 'enter' })
  }

  if (to.name === 'enter') {
    const redirectName = isAuthuthenticated.value ? 'login' : 'registration'
    return next({ name: redirectName })
  }

  if (to.name === 'login' && !isAuthuthenticated.value) {
    return next({ name: 'registration' })
  }

  next()
})

export default router

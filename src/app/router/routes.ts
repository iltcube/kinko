import type { RouteRecordRaw } from 'vue-router'

import EnterLayout from '@/pages/enter/layout'
import LoginPage from '@/pages/enter/login'
import RegistrationPage from '@/pages/enter/registration'
import CredentialsLayout from '@/pages/credentials/layout'
import CredentialList from '@/pages/credentials/list'
import NewCredential from '@/pages/credentials/new'
import CredentialDetail from '@/pages/credentials/detail'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'enter',
    component: EnterLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage
      },
      {
        path: 'registration',
        name: 'registration',
        component: RegistrationPage
      }
    ]
  },
  {
    path: '/credentials',
    name: 'credentials',
    component: CredentialsLayout,
    children: [
      {
        path: '',
        name: 'credentialList',
        component: CredentialList
      },
      {
        path: 'new',
        name: 'newCredential',
        component: NewCredential
      },
      {
        path: ':id',
        name: 'credentialDetail',
        component: CredentialDetail
      }
    ]
  }
] as const

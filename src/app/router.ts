import { createRouter, createWebHistory } from 'vue-router'
import Posts from '@/pages/posts/index.vue'
import PostRead from '@/pages/post-read/index.vue'
import PostWrite from '@/pages/post-write/index.vue'
import Chats from '@/pages/chats/index.vue'
import Profile from '@/pages/profile/index.vue'
import Register from '@/pages/Register/index.vue'
import Login from '@/pages/Login/index.vue'
import { useUsersStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'posts',
      component: Posts,
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'post-read',
      component: PostRead,
      meta: { requiresAuth: true }
    },
    {
      path: '/post-write',
      name: 'post-write',
      component: PostWrite,
      meta: { requiresAuth: true }
    },
    {
      path: '/chats',
      name: 'chats',
      component: Chats,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useUsersStore()
  const isAuth = store.isAuthenticated

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuth) {
      return next('/login')
    }
  }

  if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (isAuth) {
      return next('/')
    }
  }
  next()
})

export default router

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from './postsStore'
import type { Ref } from 'vue'
import type { User, Profile } from '@/shared/types'
import type { FiltersType } from '@/shared/types'

export const useUsersStore = defineStore('usersStore', () => {
  const profile: Ref<Profile | null> = ref(null)
  const user: Ref<User | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const isAuth: Ref<boolean> = ref(false)
  const errorMessage: Ref<string> = ref('')
  const router = useRouter()

  const isAuthenticated = computed((): boolean => isAuth.value)

  const checkToken = (): string | null => {
    const token = localStorage.getItem('token')
    if (!token) {
      isAuth.value = false
      router.push('/register')
      console.error('No token found')
      return null
    }
    isAuth.value = true
    return token
  }

  const logout = (): void => {
    const confirmExit = confirm('Are you sure you want to exit?')

    if (!confirmExit) return
    isAuth.value = false
    router.push('/login')
    localStorage.clear('token')
  }

  const getMyInfo = async () => {
    try {
      const token = checkToken()

      const response = await fetch(`http://localhost:3000/api/info`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (response.status === 401) {
        isAuth.value = false
        router.push('/login')
        throw new Error('Failed to fetch your info')
      }

      const { user: userData } = await response.json()
      user.value = userData
      return user
    } catch (err) {
      return { error: err.message }
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (!response.ok) {
      return console.error('Registration failed:', await response.text())
    }

    const { token } = await response.json()
    localStorage.setItem('token', `Bearer ${token}`)
    await getMyInfo()
    router.push('/')
  }

  const register = async (email: string, name: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        password
      })
    })

    if (!response.ok) {
      return console.error('Registration failed:', await response.text())
    }
    const data = await response.json()

    router.push('/login')
  }

  const getUserInfo = async (id: number, filters?: FiltersType) => {
    try {
      const token = checkToken()

      const queryParams = new URLSearchParams({
        sortBy: filters?.sortBy ?? '',
        searchQuery: filters?.searchQuery ?? ''
      })

      const response = await fetch(`http://localhost:3000/api/profile/${id}?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }

      const data = await response.json()
      profile.value = data

      const postStore = usePostsStore()
      postStore.posts = data.posts
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const subscribeToUser = async (subscribed_to_id: number) => {
    try {
      const token = checkToken()

      const response = await fetch(`http://localhost:3000/api/subscriptions/${subscribed_to_id}`, {
        method: 'POST',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe on user')
      }

      const data = await response.json()
      if (profile.value) {
        profile.value.subscribers.push(data)
      }
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const deleteSubscription = async (subscribed_to_id: number) => {
    try {
      const token = checkToken()

      const response = await fetch(`http://localhost:3000/api/subscriptions/${subscribed_to_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe on user')
      }

      const data = await response.json()
      if (profile.value) {
        profile.value.subscribers = profile.value.subscribers.filter(
          (sub) => sub.subscriber_id !== data.subscriber_id
        )
      }
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const changeProfileImg = async (formData) => {
    try {
      const token = checkToken()

      const response = await fetch('http://localhost:3000/api/profile/img', {
        method: 'PATCH',
        headers: {
          Authorization: token
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to change img')
      }

      const data = await response.json()

      if (profile.value) {
        profile.value.user.img = data.user.img
      }
      if (user.value) {
        user.value.img = data.user.img
      }

      return data
    } catch (err) {
      err.value = err.message
    }
  }

  const deleteProfileImg = async (imageName: string) => {
    try {
      const token = checkToken()

      const response = await fetch('http://localhost:3000/api/profile/img', {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ img: imageName })
      })

      if (!response.ok) {
        throw new Error('Failed to change img')
      }

      const data = await response.json()

      if (profile.value) {
        profile.value.user.img = data.user.img
      }

      return data
    } catch (err) {
      err.value = err.message
    }
  }

  const deletePostFromProfile = (id: number): void => {
    if (profile.value && profile.value.posts) {
      profile.value.posts = profile.value.posts.filter((post) => post.id !== id)
    }
  }

  const checkCredential = (response) => {
    if (response && response.credential) {
      const credential = response.credential

      sendTokenToServer(credential)
    } else {
      console.error('No credential found in response:', response)
    }
  }

  const sendTokenToServer = async (credential: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credential })
      })

      const result = await response.json()
      if (result.usertToken) {
        localStorage.setItem('token', `Bearer ${result.usertToken}`)
        await getMyInfo()
        router.push('/')
      }
    } catch (error) {
      console.error('Error sending token to server:', error)
    }
  }

  return {
    user,
    errorMessage,
    loading,
    isAuthenticated,
    profile,
    getMyInfo,
    login,
    register,
    getUserInfo,
    subscribeToUser,
    deleteSubscription,
    changeProfileImg,
    logout,
    deletePostFromProfile,
    checkCredential,
    sendTokenToServer,
    deleteProfileImg
  }
})

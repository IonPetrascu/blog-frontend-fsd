import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
interface Chat {
  id: number
  postId: number
  content: string
}

export const useChatsStore = defineStore('chatsStore', () => {
  const chats: Ref<Chat[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  const getToken = (): string | null => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return null
    }
    return token
  }

  const getMyChats = async () => {
    try {
      const token = getToken()

      const response = await fetch('http://localhost:3000/chats', {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get post')
      }
      const chats = await response.json()
      return chats
    } catch (err) {
      err.value = err.message
    }
  }

  const createChat = async (other_user_id: number, chat_name: string) => {
    try {
      const token = getToken()

      const response = await fetch('http://localhost:3000/chats', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          other_user_id,
          chat_name
        })
      })

      switch (response.status) {
        case 200: {
          const existingChatData = await response.json()
          return { success: true, message: 'Chat already exists', chat: existingChatData.chat }
        }
        case 201: {
          const createdChatData = await response.json()
          return { success: true, message: 'Chat created', chat: createdChatData }
        }
        case 400: {
          const badRequestMessage = await response.text()
          return { success: false, message: badRequestMessage }
        }
        case 401: {
          return { success: false, message: 'Unauthorized' }
        }
        case 500: {
          console.log('Server error')
          return { success: false, message: 'Server error' }
        }
        default: {
          console.log('Unexpected status:', response.status)
          return { success: false, message: 'Unexpected error' }
        }
      }
    } catch (err) {
      console.log('Error creating chat:', err)
      return { success: false, message: 'Network or server error' }
    }
  }

  return {
    chats,
    loading,
    getMyChats,
    createChat
  }
})

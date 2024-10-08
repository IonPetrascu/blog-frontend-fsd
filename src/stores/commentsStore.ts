import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Comment {
  id: number
  postId: number
  content: string
}

export const useCommentsStore = defineStore('commentsStore', () => {
  const comments = ref<Comment[]>([])
  const loading = ref<boolean>(false)

  const commentCount = computed(() => comments.value.length)

  return {
    comments,
    loading,
    commentCount
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PostCard } from '@/shared/types'
import type { Ref } from 'vue'
import { useUsersStore } from './userStore'

export const usePostsStore = defineStore('postsStore', () => {
  const posts: Ref<PostCard[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  const getToken = (): string | null => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return null
    }
    return token
  }

  const getPosts = async () => {
    try {
      const token = getToken()

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get post')
      }
      posts.value = await response.json()
    } catch (err) {
      err.value = err.message
    }
  }

  const deletePost = async (post_id: number, imgName: string | null, videoName: string | null) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/posts/${post_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ img: imgName || '', video: videoName || '' })
      })

      if (!response.ok) {
        throw new Error('Failed delete post')
      }
      const data = await response.json()

      posts.value = posts.value.filter((post) => post.id !== post_id)

      const store = useUsersStore()
      store.deletePostFromProfile(post_id)
      return data
    } catch (err) {
      console.error(err)
      return err
    }
  }

  const addVote = async (entity_id: number, entity_type: string, vote_type: boolean) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/votes`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entity_id,
          entity_type,
          vote_type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add votes')
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const deleteVote = async (entity_id: number, entity_type: string) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/votes`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entity_id,
          entity_type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to delete votes')
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const addVoteToPost = async (is_like: boolean, target_id: number, entity_type: string) => {
    const newVote = is_like ? 1 : 0

    const findPost = posts.value.find((post) => post.id === target_id)

    if (!findPost) {
      console.error('Post not found')
      return
    }

    if (findPost.user_vote === newVote) {
      findPost.user_vote = null
      if (is_like) {
        findPost.likes_count -= 1
      } else {
        findPost.dislikes_count -= 1
      }
      await deleteVote(target_id, entity_type)
    } else {
      if (findPost.user_vote !== null) {
        if (is_like) {
          findPost.likes_count += 1
          findPost.dislikes_count -= 1
        } else {
          findPost.likes_count -= 1
          findPost.dislikes_count += 1
        }
      } else {
        if (is_like) {
          findPost.likes_count += 1
        } else {
          findPost.dislikes_count += 1
        }
      }

      findPost.user_vote = newVote
      await addVote(target_id, entity_type, is_like)
    }
  }

  const createPost = async (formData) => {
    try {
      const token = getToken()

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          Authorization: token
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to add post')
      }
      const post = await response.json()

      post.likes_count = 0
      post.dislikes_count = 0
      post.user_vote = null

      posts.value.unshift(post)
      return post
    } catch (err) {
      err.value = err.message
    }
  }

  const getSinglePost = async (id: number) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get post')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const getComments = async (id: number) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get comments')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  const addComment = async (postId: number, content: string, parent_comment_id: number | null) => {
    try {
      const token = getToken()

      const response = await fetch(`http://localhost:3000/api/comments`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          content,
          parent_comment_id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add comments')
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }
  return {
    posts,
    loading,
    getPosts,
    deletePost,
    addVote,
    deleteVote,
    addVoteToPost,
    createPost,
    getSinglePost,
    getComments,
    addComment
  }
})

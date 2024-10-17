interface BasePost {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  img: string | null
}

export interface PostCard extends BasePost {
  likes_count: number
  dislikes_count: number
  comments_count: number
  user_vote: number | null
  user_id: number
  user_email: string
  user_name: string
  user_img: number | null
  video: string | null
}
export interface PostFull extends BasePost {
  u_id: number
  u_email: string
  u_name: string
  u_img: number | null
  u_video: string | null
}

export type PopupType = {
  id: number
  title: string
}

export type Mode = 'light' | 'dark'
export type TypeSub = 'subscribers' | 'subscribtions'

export interface Comment {
  id: number
  content: string
  created_at: string
  updated_at: string
  like_count: number
  dislike_count: number
  user_id: number
  u_name: string
  u_img: string | null
  post_id: number
  parent_comment_id: number | null
  user_vote: boolean | null
  replies: Comment[]
}

export interface User {
  id: number
  img: string | null
  u_email: string
  u_name: string
}

export interface Subscriber {
  subscriber_id: number
  img: string | null
  u_email: string
  u_name: string
}

export interface Subscribtion {
  subscribed_to_id: number
  img: string | null
  u_email: string
  u_name: string
}

export interface Profile {
  posts: PostCard[]
  subscribers: Subscriber[]
  subscribtions: Subscribtion[]
  user: User
}

export type RespondType = {
  id: number
  userName: string
}

export type VoteType = {
  id: number
  type: string
  is_like: boolean
}

export type VoteComment = {
  is_like: boolean
  target_id: number
  entity_type: string
  user_vote: boolean
}

export interface ChatType {
  chat_id: number
  name: string
  user_id: number
  user_img: string | null
  user_name: string
  message_id: number
  last_message_content: string
  last_message_sent_at: string
}

export interface MessageType {
  user_id: number
  content: string
  sent_at: string
}

export interface FiltersType {
  sortBy: string
  searchQuery: string
}

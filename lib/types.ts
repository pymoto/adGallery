export interface Ad {
  id: string
  title: string
  company: string
  description: string
  image_url: string
  link_url?: string
  category: string
  tags: string[]
  views: number
  likes: number
  created_at: string
  user_id?: string
  likes_count?: number
  is_liked?: boolean
}

export interface User {
  id: string
  email: string
  created_at: string
}

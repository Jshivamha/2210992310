export interface User {
  id: string
  name: string
  avatar: string
  commentedPostsCount: number 
  totalCommentsReceived: number 
}

export interface Comment {
  id: string
  postId: string
  content: string
  createdAt: string 
}

export interface Post {
  id: string
  userId: string
  content: string
  imageUrl: string 
  createdAt: string 
  comments: Comment[]
  commentCount: number 
}

export type SortOption = "newest" | "oldest" | "mostComments"

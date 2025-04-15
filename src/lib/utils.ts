import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Post, User } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomDate(): string {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  return new Date(randomTime).toISOString()
}

export function getRandomPostImage(seed: string): string {
  const imageId = Math.abs(hashCode(seed)) % 1000
  return `https://picsum.photos/seed/${imageId}/800/600`
}

export function getRandomUserAvatar(seed: string): string {
  const avatarId = Math.abs(hashCode(seed)) % 100
  return `https://i.pravatar.cc/150?img=${avatarId}`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash 
  }
  return hash
}

export function findPostsWithMostComments(posts: Post[]): Post[] {
  if (!posts || posts.length === 0) return []

  let maxCommentCount = 0
  let result: Post[] = []

  for (const post of posts) {
    if (post.commentCount > maxCommentCount) {
      maxCommentCount = post.commentCount
      result = [post]
    } else if (post.commentCount === maxCommentCount) {
      result.push(post)
    }
  }

  return result
}

export function findTopUsers(users: User[], count = 5): User[] {
  if (!users || users.length === 0) return []

  const sortedUsers = [...users].sort((a, b) => {
    const commentDiff = b.commentedPostsCount - a.commentedPostsCount
    if (commentDiff !== 0) return commentDiff

    return b.totalCommentsReceived - a.totalCommentsReceived
  })

  return sortedUsers.slice(0, count)
}

export type SortOption = "newest" | "oldest" | "mostComments"

export function sortPosts(posts: Post[], sortBy: SortOption): Post[] {
  const sortedPosts = [...posts]

  switch (sortBy) {
    case "newest":
      return sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "oldest":
      return sortedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case "mostComments":
      return sortedPosts.sort((a, b) => b.commentCount - a.commentCount)
    default:
      return sortedPosts
  }
}

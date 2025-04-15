import type { Comment, Post, SortOption, User } from "./types"
import {
  findPostsWithMostComments,
  findTopUsers,
  generateRandomDate,
  getRandomPostImage,
  getRandomUserAvatar,
  sortPosts,
} from "./utils"

// API endpoints
const BASE_URL = "http://20.244.56.144/evaluation-service"
const USERS_API = `${BASE_URL}/users`
const POSTS_API = `${BASE_URL}/users/{userId}/posts`
const COMMENTS_API = `${BASE_URL}/posts/{postId}/comments`

// In-memory cache
let usersCache: User[] = []
let postsCache: Post[] = []
let lastFetchTime = 0
const CACHE_TTL = 60000 

export async function fetchUsers(accessToken: string): Promise<User[]> {
  try {
    // Use cache if available and fresh
    if (usersCache.length > 0 && Date.now() - lastFetchTime < CACHE_TTL) {
      return usersCache
    }

    const response = await fetch(USERS_API,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`)
    }

    const data = await response.json()
    const usersObj = data.users || {}

    // Transform the users object into an array of User objects
    const users: User[] = Object.entries(usersObj).map(([id, name]) => ({
      id,
      name: name as string,
      avatar: getRandomUserAvatar(id),
      commentedPostsCount: 0, // Will be calculated after fetching posts and comments
      totalCommentsReceived: 0, // Will be calculated after fetching posts and comments
    }))

    // Update cache
    usersCache = users

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return usersCache.length > 0 ? usersCache : [] // Return cached data if available
  }
}

export async function fetchAllPosts(accessToken: string, sort: SortOption = "newest"): Promise<Post[]> {
  try {
    if (postsCache.length > 0 && Date.now() - lastFetchTime < CACHE_TTL) {
      return sortPosts(postsCache, sort)
    }

    const users = await fetchUsers(accessToken)

    const allPosts: Post[] = []

    for (const user of users) {
      try {
        const userPosts = await fetchUserPosts(user.id, accessToken)
        allPosts.push(...userPosts)
      } catch (error) {
        console.error(`Error fetching posts for user ${user.id}:`, error)
      }
    }

    postsCache = allPosts
    lastFetchTime = Date.now()

    calculateUserStats(users, allPosts)

    return sortPosts(allPosts, sort)
  } catch (error) {
    console.error("Error fetching all posts:", error)
    return sortPosts(postsCache, sort) 
  }
}

async function fetchUserPosts(userId: string, accessToken: string): Promise<Post[]> {
  try {
    const url = POSTS_API.replace("{userId}", userId)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}: ${response.status}`)
    }

    const data = await response.json()
    const postsData = data.posts || []

    // Transform API response to our Post type
    const posts: Post[] = []

    for (const postData of postsData) {
      // Fetch comments for this post
      const comments = await fetchPostComments(postData.id.toString(), accessToken)

      // Create a Post object with the fetched data
      const post: Post = {
        id: postData.id.toString(),
        userId: postData.userid.toString(),
        content: postData.content,
        imageUrl: getRandomPostImage(postData.id.toString()),
        createdAt: generateRandomDate(), // Generate a random date
        comments,
        commentCount: comments.length,
      }

      posts.push(post)
    }

    return posts
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

async function fetchPostComments(postId: string, accessToken: string): Promise<Comment[]> {
  try {
    const url = COMMENTS_API.replace("{postId}", postId)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}: ${response.status}`)
    }

    const data = await response.json()
    const commentsData = data.comments || []

    return commentsData.map((commentData: any) => ({
      id: commentData.id.toString(),
      postId: commentData.postid.toString(),
      content: commentData.content,
      createdAt: generateRandomDate(), 
    }))
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

function calculateUserStats(users: User[], posts: Post[]): void {
  // Reset stats
  users.forEach((user) => {
    user.commentedPostsCount = 0
    user.totalCommentsReceived = 0
  })

  const userMap = new Map<string, User>()
  users.forEach((user) => userMap.set(user.id, user))

  posts.forEach((post) => {
    const user = userMap.get(post.userId)
    if (user && post.commentCount > 0) {
      user.commentedPostsCount++
      user.totalCommentsReceived += post.commentCount
    }
  })
}

export async function fetchTrendingPosts(accessToken: string): Promise<Post[]> {
  try {
    
    const allPosts = await fetchAllPosts(accessToken)

    return findPostsWithMostComments(allPosts)
  } catch (error) {
    console.error("Error fetching trending posts:", error)
    return []
  }
}

export async function fetchTopUsers(count = 5, accessToken: string): Promise<User[]> {
  try {
    
    await fetchAllPosts(accessToken)

    const users = await fetchUsers(accessToken)

    return findTopUsers(users, count)
  } catch (error) {
    console.error("Error fetching top users:", error)
    return []
  }
}

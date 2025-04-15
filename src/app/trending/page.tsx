"use client"

import { useEffect, useState } from "react"
import { fetchTrendingPosts } from "@/lib/api"
import type { Post } from "@/lib/types"
import PostCard from "@/components/post-card"
import { useAuth } from "@/contexts/Authcontext"

export default function TrendingPage() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maxCommentCount, setMaxCommentCount] = useState(0)
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map())
  const { accessToken } = useAuth();

  
  useEffect(() => {
    async function loadTrendingPosts() {
      try {
        setLoading(true)
        const posts = await fetchTrendingPosts(accessToken || "")
        setTrendingPosts(posts)

        
        const userMapping = new Map<string, string>()
        posts.forEach((post) => {
          if (!userMapping.has(post.userId)) {
            userMapping.set(post.userId, `User ${post.userId}`)
          }
        })
        setUserMap(userMapping)

        
        if (posts.length > 0) {
          setMaxCommentCount(posts[0].commentCount)
        }

        setError(null)
      } catch (err) {
        setError("Failed to load trending posts")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingPosts()

    const interval = setInterval(() => {
      loadTrendingPosts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <p className="mb-4 text-gray-600">
        Posts with the highest number of comments {maxCommentCount > 0 ? `(${maxCommentCount} comments)` : ""}
      </p>

      {loading && trendingPosts.length === 0 ? (
        <div className="py-20 text-center">
          <div className="animate-pulse text-gray-400">Loading trending posts...</div>
        </div>
      ) : trendingPosts.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No trending posts found</div>
      ) : (
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <PostCard key={post.id} post={post} userName={userMap.get(post.userId)} />
          ))}
        </div>
      )}
    </div>
  )
}

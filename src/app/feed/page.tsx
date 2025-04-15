"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchAllPosts } from "@/lib/api"
import type { SortOption, Post } from "@/lib/types"
import PostCard from "@/components/post-card"
import PostSort from "@/components/post-sort"
import { useAuth } from "@/contexts/Authcontext"

export default function FeedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSort = (searchParams.get("sort") as SortOption) || "newest"

  const [sortOption, setSortOption] = useState<SortOption>(initialSort)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map())
const { accessToken } = useAuth();
  // Fetch posts with the selected sort option
  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        const fetchedPosts = await fetchAllPosts(accessToken || "", sortOption)
        setPosts(fetchedPosts)

        // Extract user IDs and names from posts
        const userMapping = new Map<string, string>()
        fetchedPosts.forEach((post) => {
          if (!userMapping.has(post.userId)) {
            // This is a placeholder; we'll update with real names when available
            userMapping.set(post.userId, `User ${post.userId}`)
          }
        })
        setUserMap(userMapping)

        setError(null)
      } catch (err) {
        setError("Failed to load posts")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()

    // Set up polling for new posts every 10 seconds
    const interval = setInterval(() => {
      loadPosts()
    }, 10000)

    return () => clearInterval(interval)
  }, [sortOption])

  // Update URL when sort changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", sortOption)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [sortOption, router, searchParams])

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort)
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed</h1>
      <p className="mb-4 text-gray-600">Real-time posts with automatic updates</p>

      <PostSort onSortChange={handleSortChange} defaultSort={sortOption} />

      {loading && posts.length === 0 ? (
        <div className="py-20 text-center">
          <div className="animate-pulse text-gray-400">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No posts found</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} userName={userMap.get(post.userId)} />
          ))}
        </div>
      )}
    </div>
  )
}

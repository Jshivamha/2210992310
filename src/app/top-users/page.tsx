"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { fetchTopUsers } from "@/lib/api"
import type { User } from "@/lib/types"
import { useAuth } from "@/contexts/Authcontext"

export default function TopUsersPage() {
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortCriteria, setSortCriteria] = useState<"commentedPostsCount" | "totalCommentsReceived">(
    "commentedPostsCount",
  )
const { accessToken } = useAuth();
  // Fetch top users
  useEffect(() => {
    async function loadTopUsers() {
      try {
        setLoading(true)
        const users = await fetchTopUsers(5, accessToken || "")
        setTopUsers(users)
        setError(null)
      } catch (err) {
        setError("Failed to load top users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTopUsers()

    // Set up polling for top users every minute
    const interval = setInterval(() => {
      loadTopUsers()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Sort users based on selected criteria
  const sortedUsers = [...topUsers].sort((a, b) => b[sortCriteria] - a[sortCriteria])

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top 5 Users</h1>
      <p className="mb-4 text-gray-600">Users with the most commented posts</p>

      <div className="mb-4">
        <label htmlFor="sort-criteria" className="mr-2 font-medium">
          Sort by:
        </label>
        <select
          id="sort-criteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value as "commentedPostsCount" | "totalCommentsReceived")}
          className="p-2 border rounded-md"
        >
          <option value="commentedPostsCount">Number of Posts with Comments</option>
          <option value="totalCommentsReceived">Total Comments Received</option>
        </select>
      </div>

      {loading && topUsers.length === 0 ? (
        <div className="py-20 text-center">
          <div className="animate-pulse text-gray-400">Loading top users...</div>
        </div>
      ) : topUsers.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No users found</div>
      ) : (
        <div className="grid gap-4">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="border rounded-lg p-4 flex items-center bg-white shadow-sm">
              <div className="font-bold text-xl mr-4 w-8 text-center">#{index + 1}</div>
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <Image
                  src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg">{user.name}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                  <div>{user.commentedPostsCount} posts with comments</div>
                  <div>{user.totalCommentsReceived} total comments received</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

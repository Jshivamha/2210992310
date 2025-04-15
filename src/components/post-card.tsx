import Image from "next/image"
import type { Post } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
  userName?: string
}

export default function PostCard({ post, userName }: PostCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            src={`https://i.pravatar.cc/150?u=${post.userId}`}
            alt={userName || `User ${post.userId}`}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-medium">{userName || `User ${post.userId}`}</div>
          <div className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Post image */}
      <div className="relative w-full h-64">
        <Image
          src={post.imageUrl || `/placeholder.svg?height=400&width=600`}
          alt="Post image"
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <p className="mb-3">{post.content}</p>
        <div className="flex text-sm text-gray-500 mb-2">
          <div>{post.commentCount} comments</div>
        </div>
      </div>

      {post.comments.length > 0 && (
        <div className="border-t px-4 py-3 bg-gray-50">
          <div className="text-sm font-medium mb-2">Comments</div>
          {post.comments.slice(0, 2).map((comment) => (
            <div key={comment.id} className="text-sm mb-2">
              <div className="text-gray-700">{comment.content}</div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </div>
            </div>
          ))}
          {post.comments.length > 2 && (
            <div className="text-sm text-gray-500 mt-1">View all {post.comments.length} comments</div>
          )}
        </div>
      )}
    </div>
  )
}

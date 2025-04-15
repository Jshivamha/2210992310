"use client"

import { useState } from "react"
import type { SortOption } from "@/lib/types"

interface PostSortProps {
  onSortChange: (sort: SortOption) => void
  defaultSort?: SortOption
}

export default function PostSort({ onSortChange, defaultSort = "newest" }: PostSortProps) {
  const [sort, setSort] = useState<SortOption>(defaultSort)

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort)
    onSortChange(newSort)
  }

  return (
    <div className="mb-4">
      <label htmlFor="sort-select" className="mr-2 font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="p-2 border rounded-md"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="mostComments">Most Comments</option>
      </select>
    </div>
  )
}

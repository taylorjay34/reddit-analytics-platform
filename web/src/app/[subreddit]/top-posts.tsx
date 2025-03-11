"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { createClient } from '@supabase/supabase-js'

interface RedditPost {
  id: string
  title: string
  content: string
  score: number
  numComments: number
  url: string
  createdAt: Date
  permalink: string
}

interface TopPostsProps {
  subreddit: string
}

export default function TopPosts({ subreddit }: TopPostsProps) {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/reddit/${subreddit}/posts`)
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [subreddit])

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            <TableHead className="w-[100px] text-right">Score</TableHead>
            <TableHead className="w-[100px] text-right">Comments</TableHead>
            <TableHead className="w-[150px]">Posted</TableHead>
            <TableHead>Links</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="text-right">{post.score}</TableCell>
              <TableCell className="text-right">{post.numComments}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-red-600 hover:underline"
                  >
                    Post
                  </a>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-red-600 hover:underline"
                  >
                    Comments
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
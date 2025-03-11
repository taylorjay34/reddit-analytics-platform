import { NextResponse } from 'next/server'
import { fetchRecentPosts } from '@/lib/reddit/snoowrap'

export async function GET(
  request: Request,
  { params }: { params: { subreddit: string } }
) {
  try {
    const posts = await fetchRecentPosts(params.subreddit)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
} 
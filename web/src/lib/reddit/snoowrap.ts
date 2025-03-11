import Snoowrap from 'snoowrap'
import { getSubredditPosts, getOrCreateSubreddit, upsertRedditPosts } from '@/lib/supabase/operations'
import type { Database } from '@/lib/supabase/types'

// Define the structure of a Reddit post
export interface RedditPost {
  id: string
  title: string
  content: string
  score: number
  numComments: number
  url: string
  createdAt: Date
  permalink: string
}

// Initialize Snoowrap with Reddit API credentials
const initRedditClient = (): Snoowrap => {
  return new Snoowrap({
    userAgent: 'reddit-analytics-platform:v1.0.0',
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!
  })
}

/**
 * Fetch posts from a subreddit, using Supabase as a cache
 */
export const fetchRecentPosts = async (
  subredditName: string,
  limit: number = 100,
  forceRefresh: boolean = false
): Promise<RedditPost[]> => {
  try {
    console.log(`Fetching posts from r/${subredditName}...`)
    
    // First, try to get cached posts from Supabase
    const cachedPosts = await getSubredditPosts(subredditName, forceRefresh)
    if (cachedPosts.length > 0) {
      console.log(`Using cached posts for r/${subredditName}`)
      return cachedPosts.map((post: Database['public']['Tables']['reddit_posts']['Row']) => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        score: post.score,
        numComments: post.num_comments,
        url: post.url,
        createdAt: new Date(post.created_at),
        permalink: post.permalink
      }))
    }

    // If no cached posts or cache is stale, fetch from Reddit
    console.log(`Fetching fresh posts from Reddit for r/${subredditName}`)
    const reddit = initRedditClient()
    const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60
    
    const freshPosts = await reddit
      .getSubreddit(subredditName)
      .getNew({ limit })
      .then((submissions) => 
        submissions
          .filter((post) => post.created_utc > oneDayAgo)
          .map((post) => ({
            id: post.id,
            title: post.title,
            content: post.selftext,
            score: post.score,
            numComments: post.num_comments,
            url: post.url,
            createdAt: new Date(post.created_utc * 1000),
            permalink: `https://reddit.com${post.permalink}`
          }))
      )

    // Store fresh posts in Supabase
    const subreddit = await getOrCreateSubreddit(subredditName)
    if (subreddit && freshPosts.length > 0) {
      await upsertRedditPosts(subreddit.id, freshPosts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        score: post.score,
        num_comments: post.numComments,
        url: post.url,
        created_at: post.createdAt.toISOString(),
        permalink: post.permalink
      })))
    }
    
    console.log(`Successfully fetched ${freshPosts.length} posts from r/${subredditName}`)
    return freshPosts
  } catch (error) {
    console.error('Error fetching Reddit posts:', {
      subreddit: subredditName,
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
} 
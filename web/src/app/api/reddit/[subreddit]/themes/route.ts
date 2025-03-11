import { NextResponse } from 'next/server'
import { fetchRecentPosts } from '@/lib/reddit/snoowrap'
import { analyzePostThemes } from '@/lib/analysis'

export async function GET(
  request: Request,
  { params }: { params: { subreddit: string } }
) {
  // Log environment variables availability
  console.log('API Route Environment:', {
    hasHeliconeKey: !!process.env.HELICONE_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    subreddit: params.subreddit
  })

  try {
    const posts = await fetchRecentPosts(params.subreddit)
    console.log(`Analyzing ${posts.length} posts for themes...`)
    
    const themes = await analyzePostThemes(posts)
    console.log('Theme analysis complete:', themes.map(t => ({ id: t.id, postCount: t.posts.length })))
    
    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error analyzing themes:', {
      error: error instanceof Error ? error.message : error,
      subreddit: params.subreddit
    })
    return NextResponse.json(
      { error: 'Failed to analyze themes' },
      { status: 500 }
    )
  }
} 
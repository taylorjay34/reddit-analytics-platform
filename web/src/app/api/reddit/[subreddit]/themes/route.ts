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
    // Check for required API keys
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing. Please add it to your environment variables.')
    }

    // Fetch posts
    const posts = await fetchRecentPosts(params.subreddit)
    console.log(`Analyzing ${posts.length} posts for themes...`)
    
    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'No posts found for this subreddit' },
        { status: 404 }
      )
    }
    
    const themes = await analyzePostThemes(posts)
    console.log('Theme analysis complete:', themes.map(t => ({ id: t.id, postCount: t.posts.length })))
    
    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error analyzing themes:', {
      error: error instanceof Error ? error.message : error,
      subreddit: params.subreddit
    })
    
    // Return a more specific error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to analyze themes';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { fetchRecentPosts } from '@/lib/reddit/snoowrap'
import { analyzePostThemes, Theme } from '@/lib/analysis'

// Simple in-memory cache for theme analysis results
const themeCache = new Map<string, { data: Theme[], timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET(
  request: Request,
  { params }: { params: { subreddit: string } }
) {
  const subreddit = params.subreddit
  
  // Log environment variables availability
  console.log('API Route Environment:', {
    hasHeliconeKey: !!process.env.HELICONE_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    subreddit
  })

  try {
    // Check for required API keys
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing. Please add it to your environment variables.')
    }

    // Check cache first
    const cacheKey = `themes-${subreddit}`
    const cachedData = themeCache.get(cacheKey)
    const now = Date.now()
    
    if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
      console.log(`Using cached theme analysis for r/${subreddit}`)
      return NextResponse.json(cachedData.data)
    }

    // Set a timeout for the analysis
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timed out')), 25000) // 25 second timeout
    })

    // Fetch posts
    const posts = await fetchRecentPosts(subreddit)
    console.log(`Analyzing ${posts.length} posts for themes...`)
    
    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'No posts found for this subreddit' },
        { status: 404 }
      )
    }
    
    // Race the analysis against the timeout
    const themes = await Promise.race([
      analyzePostThemes(posts),
      timeoutPromise
    ]) as Theme[]
    
    console.log('Theme analysis complete:', themes.map((t: Theme) => ({ id: t.id, postCount: t.posts.length })))
    
    // Cache the results
    themeCache.set(cacheKey, { data: themes, timestamp: now })
    
    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error analyzing themes:', {
      error: error instanceof Error ? error.message : error,
      subreddit
    })
    
    // Return a more specific error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to analyze themes';
      
    // If it's a timeout, return a specific message
    if (errorMessage.includes('timed out')) {
      return NextResponse.json(
        { error: 'Analysis took too long. Please try again later.' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 
import OpenAI from 'openai'
import { RedditPost } from '@/lib/reddit/snoowrap'
import { savePostAnalysis, getPostAnalyses } from '@/lib/supabase/operations'

const HELICONE_API_KEY = process.env.HELICONE_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Debug logging for environment variables
console.log('Environment check:', {
  hasHeliconeKey: !!HELICONE_API_KEY,
  hasOpenAIKey: !!OPENAI_API_KEY,
  heliconeKeyLength: HELICONE_API_KEY?.length
})

// Only check for OpenAI API key, make Helicone optional
if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key - please check your .env.local file')
}

// Create OpenAI client with optional Helicone proxy
const openaiConfig: any = {
  apiKey: OPENAI_API_KEY,
}

// Only use Helicone if the API key is available
if (HELICONE_API_KEY) {
  openaiConfig.baseURL = "https://oai.helicone.ai/v1"
  openaiConfig.defaultHeaders = {
    "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
    "Helicone-Property-App": "reddit-analytics-platform",
    "Content-Type": "application/json"
  }
}

const openai = new OpenAI(openaiConfig)

// Log OpenAI configuration for debugging
console.log('OpenAI Configuration:', {
  baseURL: openai.baseURL || 'default OpenAI API URL',
  hasHeliconeAuth: !!HELICONE_API_KEY,
  heliconeAuthValue: HELICONE_API_KEY ? `Bearer ${HELICONE_API_KEY.slice(0, 10)}...` : 'Not configured',
  heliconeProperty: "reddit-analytics-platform"
})

export interface Theme {
  id: string
  name: string
  description: string
  posts: RedditPost[]
}

const DEFAULT_THEMES: Theme[] = [
  {
    id: "solution-requests",
    name: "Solution Requests",
    description: "Posts where users are explicitly seeking solutions to problems",
    posts: []
  },
  {
    id: "pain-and-anger",
    name: "Pain & Anger",
    description: "Posts expressing frustration, anger, or pain",
    posts: []
  },
  {
    id: "advice-requests",
    name: "Advice Requests",
    description: "Posts requesting suggestions or feedback",
    posts: []
  },
  {
    id: "money-talk",
    name: "Money Talk",
    description: "Posts discussing financial issues, costs, budgets, etc",
    posts: []
  }
]

async function categorizePost(post: RedditPost): Promise<string> {
  try {
    // First, check if we have a cached analysis
    const [existingAnalysis] = await getPostAnalyses([post.id])
    if (existingAnalysis) {
      return existingAnalysis.theme
    }

    // Use the configured OpenAI instance with Helicone
    const prompt = `
      Analyze this Reddit post and categorize it into one of these themes:
      - solution-requests: Posts seeking solutions for problems
      - pain-and-anger: Posts expressing frustration or anger
      - advice-requests: Posts seeking advice
      - money-talk: Posts discussing financial matters

      Title: ${post.title}
      Content: ${post.content}

      Respond with ONLY ONE of the theme IDs listed above that best matches this post.
      Just the ID, nothing else.
    `

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a post categorization assistant. Analyze the given Reddit post and respond with exactly one theme ID from the list."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.1,
      max_tokens: 10
    })

    const theme = completion.choices[0].message.content?.trim() || 'solution-requests'
    
    // Cache the analysis result
    await savePostAnalysis(post.id, theme)
    
    return theme
  } catch (error) {
    console.error('Error categorizing post:', error)
    return 'solution-requests' // Default fallback
  }
}

export async function analyzePostThemes(posts: RedditPost[]): Promise<Theme[]> {
  const themes = [...DEFAULT_THEMES]

  // Process posts in parallel, but in chunks to avoid rate limits
  const chunkSize = 5
  for (let i = 0; i < posts.length; i += chunkSize) {
    const chunk = posts.slice(i, i + chunkSize)
    const promises = chunk.map(async (post) => {
      const theme = await categorizePost(post)
      return { post, theme }
    })

    const results = await Promise.all(promises)
    
    // Add posts to their respective themes
    results.forEach(({ post, theme }) => {
      const themeObj = themes.find(t => t.id === theme)
      if (themeObj) {
        themeObj.posts.push(post)
      }
    })
  }

  return themes
} 
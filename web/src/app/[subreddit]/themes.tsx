"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Theme {
  id: string
  name: string
  description: string
  posts: RedditPost[]
}

interface RedditPost {
  id: string
  title: string
  content: string
  score: number
  numComments: number
  url: string
  createdAt: Date
  permalink: string
  theme?: string
}

interface ThemesProps {
  subreddit: string
}

const DEFAULT_THEMES = [
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

export default function Themes({ subreddit }: ThemesProps) {
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  async function fetchThemes() {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/reddit/${subreddit}/themes`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      setThemes(data)
    } catch (err) {
      console.error('Theme fetch error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred fetching themes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [subreddit])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-lg font-medium">Analyzing subreddit themes...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment as we process the posts</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Themes</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            This could be due to missing API keys or configuration issues.
          </p>
          <Button onClick={fetchThemes} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {themes.map((theme) => (
        <Sheet key={theme.id}>
          <SheetTrigger asChild>
            <Card 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedTheme(theme)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {theme.name}
                  <span className="text-sm font-normal text-muted-foreground">
                    {theme.posts.length} posts
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
              </CardContent>
            </Card>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{theme.name}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {theme.posts.map((post) => (
                <div key={post.id} className="space-y-2">
                  <h3 className="font-medium">{post.title}</h3>
                  {post.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                  )}
                  <div className="flex gap-2 text-sm">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Post
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <span>{post.score} points</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{post.numComments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
} 
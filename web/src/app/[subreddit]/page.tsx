'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TopPosts from "./top-posts"
import Themes from "./themes"

interface SubredditPageProps {
  params: {
    subreddit: string
  }
}

export default function SubredditPage({ params }: SubredditPageProps) {
  const { subreddit } = params

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">r/{subreddit}</h1>
      
      <Tabs defaultValue="top-posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="top-posts">
          <TopPosts subreddit={subreddit} />
        </TabsContent>
        
        <TabsContent value="themes">
          <Themes subreddit={subreddit} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 
'use client'

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

// Initial subreddits as per requirements
const DEFAULT_SUBREDDITS = [
  {
    name: "ollama",
    description: "Open source, local language models",
    color: "#FF4500"
  },
  {
    name: "openai",
    description: "OpenAI and ChatGPT discussions",
    color: "#0079D3"
  },
  {
    name: "programming",
    description: "Programming discussions and news",
    color: "#00D8B1"
  },
  {
    name: "webdev",
    description: "Web development community",
    color: "#FF6B6B"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function Home() {
  return (
    <div className="page-container">
      <div className="content-container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Reddit Analytics Platform
          </h1>
          <p className="text-xl text-foreground/80 float-animation">
            Analyze and understand Reddit communities through AI-powered insights ✨
          </p>
        </motion.div>
        
        <motion.div 
          className="grid-layout"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {DEFAULT_SUBREDDITS.map((subreddit, index) => (
            <motion.div key={subreddit.name} variants={item}>
              <Link href={`/${subreddit.name}`}>
                <Card className="subreddit-card group">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${subreddit.color}20, transparent)`
                    }}
                  />
                  <CardHeader>
                    <CardTitle>
                      <span className="subreddit-name">
                        r/{subreddit.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-foreground/80">
                      {subreddit.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-reddit-orange to-reddit-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

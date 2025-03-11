"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function NavBar() {
  const [subreddit, setSubreddit] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subreddit) {
      router.push(`/${subreddit}`)
      setSubreddit("")
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 supports-backdrop-blur:bg-white/60"
    >
      <div className="container flex h-16 items-center px-4">
        <Link 
          href="/" 
          className="mr-6 flex items-center space-x-2 group"
        >
          <motion.span 
            className="text-xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reddit Analytics
          </motion.span>
        </Link>

        <form 
          onSubmit={handleSubmit}
          className="flex-1 flex items-center justify-end"
        >
          <motion.div 
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-reddit-orange dark:text-reddit-orange font-medium">r/</span>
            <input
              type="text"
              placeholder="subreddit"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="w-[150px] bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <motion.button
              type="submit"
              className="inline-flex items-center justify-center rounded-full p-2 text-reddit-orange hover:text-reddit-hover focus:outline-none transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search subreddit</span>
            </motion.button>
          </motion.div>
        </form>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-reddit-orange via-reddit-blue to-reddit-orange bg-[length:200%_100%] animate-gradient" />
    </motion.nav>
  )
} 
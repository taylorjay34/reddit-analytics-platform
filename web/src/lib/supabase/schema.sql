-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the subreddits table
CREATE TABLE IF NOT EXISTS subreddits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the reddit_posts table
CREATE TABLE IF NOT EXISTS reddit_posts (
  id TEXT PRIMARY KEY,
  subreddit_id UUID REFERENCES subreddits(id),
  title TEXT NOT NULL,
  content TEXT,
  score INTEGER NOT NULL,
  num_comments INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  permalink TEXT NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the post_analysis table
CREATE TABLE IF NOT EXISTS post_analysis (
  analysis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id TEXT REFERENCES reddit_posts(id),
  theme TEXT NOT NULL,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subreddits_name ON subreddits(name);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit_id ON reddit_posts(subreddit_id);
CREATE INDEX IF NOT EXISTS idx_post_analysis_post_id ON post_analysis(post_id);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_fetched_at ON reddit_posts(fetched_at); 
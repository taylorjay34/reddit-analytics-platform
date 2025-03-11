# Reddit Analytics Platform - Ollama Subreddit Fetcher

This module fetches recent posts from the Ollama subreddit using the Reddit API via Snoowrap.

## Features

- Fetches posts from the Ollama subreddit from the past 24 hours
- Extracts key information: title, content, score, number of comments, URL, and creation date
- Provides a simple interface to access and analyze Reddit data

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Reddit API credentials:
   - Edit `src/lib/redditConfig.ts` with your Reddit API credentials
   - You need to create a Reddit app at https://www.reddit.com/prefs/apps to get these credentials

## Usage

1. Build the TypeScript code:
   ```
   npm run build
   ```

2. Run the example script:
   ```
   npm start
   ```

3. Or use the development script to build and run in one command:
   ```
   npm run dev
   ```

## API

### `fetchRecentPosts(subredditName: string, limit: number = 100): Promise<RedditPost[]>`

Fetches recent posts from a specified subreddit from the past 24 hours.

- `subredditName`: Name of the subreddit (e.g., "ollama")
- `limit`: Maximum number of posts to fetch (default: 100)

Returns a Promise that resolves to an array of RedditPost objects.

### `fetchOllamaPosts(): Promise<RedditPost[]>`

Convenience function to fetch posts specifically from the Ollama subreddit.

## RedditPost Interface

```typescript
interface RedditPost {
  id: string;
  title: string;
  content: string;
  score: number;
  numComments: number;
  url: string;
  createdAt: Date;
  permalink: string;
}
```

## License

ISC 
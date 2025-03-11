import Snoowrap from 'snoowrap';
import { redditConfig } from './redditConfig';

// Define the structure of a Reddit post
export interface RedditPost {
  id: string;
  title: string;
  content: string;
  score: number;
  numComments: number;
  url: string;
  createdAt: Date;
  permalink: string;
}

/**
 * Initialize the Snoowrap client with Reddit API credentials
 */
export const initRedditClient = (): Snoowrap => {
  return new Snoowrap({
    userAgent: redditConfig.userAgent,
    clientId: redditConfig.clientId,
    clientSecret: redditConfig.clientSecret,
    username: redditConfig.username,
    password: redditConfig.password
  });
};

/**
 * Fetch posts from a subreddit from the past 24 hours
 * @param subredditName - Name of the subreddit (e.g., "ollama")
 * @param limit - Maximum number of posts to fetch
 * @returns Array of Reddit posts
 */
export const fetchRecentPosts = async (
  subredditName: string,
  limit: number = 100
): Promise<RedditPost[]> => {
  try {
    const reddit = initRedditClient();
    
    // Calculate timestamp for 24 hours ago
    const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    
    // Fetch posts from the subreddit
    const posts = await reddit
      .getSubreddit(subredditName)
      .getNew({ limit })
      .then((submissions) => 
        submissions
          // Filter posts from the last 24 hours
          .filter((post) => post.created_utc > oneDayAgo)
          // Map to our RedditPost interface
          .map((post) => ({
            id: post.id,
            title: post.title,
            content: post.selftext,
            score: post.score,
            numComments: post.num_comments,
            url: post.url,
            createdAt: new Date(post.created_utc * 1000),
            permalink: `https://reddit.com${post.permalink}`
          }))
      );
    
    return posts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    throw error;
  }
};

/**
 * Example usage
 */
export const fetchOllamaPosts = async (): Promise<RedditPost[]> => {
  return fetchRecentPosts('ollama');
}; 
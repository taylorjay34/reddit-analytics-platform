import { supabase, isDataStale } from './client';
import type { Database } from './types';

type Subreddit = Database['public']['Tables']['subreddits']['Row'];
type RedditPost = Database['public']['Tables']['reddit_posts']['Row'];
type PostAnalysis = Database['public']['Tables']['post_analysis']['Row'];

export async function getOrCreateSubreddit(name: string): Promise<Subreddit | null> {
  // First try to get existing subreddit
  const { data: existingSubreddit } = await supabase
    .from('subreddits')
    .select()
    .eq('name', name)
    .single();

  if (existingSubreddit) {
    return existingSubreddit;
  }

  // If not found, create new subreddit
  const { data: newSubreddit, error } = await supabase
    .from('subreddits')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Error creating subreddit:', error);
    return null;
  }

  return newSubreddit;
}

export async function upsertRedditPosts(
  subredditId: string,
  posts: Array<{
    id: string;
    title: string;
    content: string | null;
    score: number;
    num_comments: number;
    url: string;
    permalink: string;
    created_at?: string;
  }>
): Promise<RedditPost[]> {
  const { data, error } = await supabase
    .from('reddit_posts')
    .upsert(
      posts.map(post => ({
        ...post,
        subreddit_id: subredditId,
        fetched_at: new Date().toISOString()
      }))
    )
    .select();

  if (error) {
    console.error('Error upserting posts:', error);
    return [];
  }

  return data || [];
}

export async function savePostAnalysis(
  postId: string,
  theme: string
): Promise<PostAnalysis | null> {
  const { data, error } = await supabase
    .from('post_analysis')
    .insert([{
      post_id: postId,
      theme,
      analysis_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving post analysis:', error);
    return null;
  }

  return data;
}

export async function getSubredditPosts(
  subredditName: string,
  forceRefresh = false
): Promise<RedditPost[]> {
  // Get subreddit
  const subreddit = await getOrCreateSubreddit(subredditName);
  if (!subreddit) return [];

  // Get posts
  const { data: posts } = await supabase
    .from('reddit_posts')
    .select('*')
    .eq('subreddit_id', subreddit.id)
    .order('fetched_at', { ascending: false });

  // Check if we need to refresh the data
  const shouldRefresh = forceRefresh || !posts?.length || 
    (posts[0] && isDataStale(posts[0].fetched_at));

  if (!shouldRefresh) {
    return posts || [];
  }

  // If we need fresh data, return empty array and let the caller fetch new data
  return [];
}

export async function getPostAnalyses(postIds: string[]): Promise<PostAnalysis[]> {
  const { data, error } = await supabase
    .from('post_analysis')
    .select('*')
    .in('post_id', postIds)
    .order('analysis_date', { ascending: false });

  if (error) {
    console.error('Error fetching post analyses:', error);
    return [];
  }

  return data || [];
} 
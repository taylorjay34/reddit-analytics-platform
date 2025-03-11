import { fetchOllamaPosts } from './lib/fetchRedditPosts';

/**
 * Main function to fetch and display Ollama subreddit posts
 */
async function main() {
  try {
    console.log('Fetching recent posts from r/ollama...');
    
    // Fetch posts from the Ollama subreddit
    const posts = await fetchOllamaPosts();
    
    console.log(`Found ${posts.length} posts from the past 24 hours`);
    
    // Display posts in a formatted way
    posts.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`);
      console.log(`Title: ${post.title}`);
      console.log(`Score: ${post.score}`);
      console.log(`Comments: ${post.numComments}`);
      console.log(`Created: ${post.createdAt.toLocaleString()}`);
      console.log(`URL: ${post.url}`);
      console.log(`Content: ${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}`);
    });
    
    // Sort posts by score and show top 5
    const topPosts = [...posts].sort((a, b) => b.score - a.score).slice(0, 5);
    
    console.log('\n\n--- Top 5 Posts by Score ---');
    topPosts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" - Score: ${post.score}, Comments: ${post.numComments}`);
    });
    
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the main function
main(); 
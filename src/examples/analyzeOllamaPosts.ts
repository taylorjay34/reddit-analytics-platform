import 'dotenv/config';
import OpenAI from 'openai';
import { fetchOllamaPosts } from '../lib/fetchRedditPosts';
import { analyzeRedditPosts } from '../lib/analyzeRedditPosts';

async function main() {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Fetching posts from r/ollama...');
    const posts = await fetchOllamaPosts();
    console.log(`Found ${posts.length} posts`);

    console.log('\nAnalyzing posts...');
    const analysis = await analyzeRedditPosts(openai, posts);

    // Display results for each post
    posts.forEach(post => {
      const categories = analysis.get(post.id);
      if (categories) {
        console.log(`\n--- ${post.title} ---`);
        console.log('Categories:');
        console.log('- Solution Request:', categories.solutionRequest);
        console.log('- Pain & Anger:', categories.painAndAnger);
        console.log('- Advice Request:', categories.adviceRequest);
        console.log('- Money Talk:', categories.moneyTalk);
      }
    });

    // Calculate category statistics
    const stats = {
      solutionRequest: 0,
      painAndAnger: 0,
      adviceRequest: 0,
      moneyTalk: 0
    };

    analysis.forEach(categories => {
      if (categories.solutionRequest) stats.solutionRequest++;
      if (categories.painAndAnger) stats.painAndAnger++;
      if (categories.adviceRequest) stats.adviceRequest++;
      if (categories.moneyTalk) stats.moneyTalk++;
    });

    console.log('\n--- Category Statistics ---');
    console.log(`Solution Requests: ${stats.solutionRequest} posts`);
    console.log(`Pain & Anger: ${stats.painAndAnger} posts`);
    console.log(`Advice Requests: ${stats.adviceRequest} posts`);
    console.log(`Money Talk: ${stats.moneyTalk} posts`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main(); 
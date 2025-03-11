import OpenAI from 'openai';
import { RedditPost } from './fetchRedditPosts';

// Define the structure for post category analysis
export interface PostCategoryAnalysis {
  solutionRequest: boolean;  // Posts seeking solutions for problems
  painAndAnger: boolean;    // Posts expressing pains or anger
  adviceRequest: boolean;   // Posts seeking advice
  moneyTalk: boolean;      // Posts about spending money
}

// Define the structure for OpenAI's response
interface OpenAIAnalysisResponse {
  categories: {
    solutionRequest: boolean;
    painAndAnger: boolean;
    adviceRequest: boolean;
    moneyTalk: boolean;
  };
}

/**
 * Analyze a Reddit post using OpenAI to categorize its content
 */
export async function analyzeRedditPost(
  openai: OpenAI,
  post: RedditPost
): Promise<PostCategoryAnalysis> {
  try {
    const prompt = `
      Analyze the following Reddit post and categorize it based on its content.
      Respond with a JSON object containing boolean values for each category.
      
      Title: ${post.title}
      Content: ${post.content}
      
      Categories to consider:
      - solutionRequest: Is the post seeking solutions for problems?
      - painAndAnger: Is the post expressing pain or anger?
      - adviceRequest: Is the post seeking advice?
      - moneyTalk: Is the post discussing spending money?
      
      Respond only with a JSON object in this exact format:
      {
        "categories": {
          "solutionRequest": boolean,
          "painAndAnger": boolean,
          "adviceRequest": boolean,
          "moneyTalk": boolean
        }
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a post categorization assistant. Analyze the given Reddit post and respond with the specified JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI response content is null');
    }

    // Parse the response
    const response = JSON.parse(content) as OpenAIAnalysisResponse;
    
    return response.categories;
  } catch (error) {
    console.error('Error analyzing Reddit post:', error);
    // Return all false if analysis fails
    return {
      solutionRequest: false,
      painAndAnger: false,
      adviceRequest: false,
      moneyTalk: false
    };
  }
}

/**
 * Analyze multiple Reddit posts concurrently
 */
export async function analyzeRedditPosts(
  openai: OpenAI,
  posts: RedditPost[]
): Promise<Map<string, PostCategoryAnalysis>> {
  const results = new Map<string, PostCategoryAnalysis>();
  
  // Process posts concurrently in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const analysisPromises = batch.map(post => analyzeRedditPost(openai, post));
    
    const batchResults = await Promise.all(analysisPromises);
    
    batch.forEach((post, index) => {
      results.set(post.id, batchResults[index]);
    });
  }
  
  return results;
}

// Example usage:
/*
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const posts = await fetchOllamaPosts();
const analysis = await analyzeRedditPosts(openai, posts);

// Get categories for a specific post
const postCategories = analysis.get(posts[0].id);
*/ 
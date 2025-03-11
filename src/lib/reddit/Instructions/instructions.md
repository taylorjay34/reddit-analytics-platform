# Project Requirements Document (PRD)

## 1. Project Overview
We are building a Reddit Analytics Platform that allows users to:

- Discover and analyze posts from various subreddits.
- Monitor top posts (based on score) in the last 24 hours.
- Classify these posts into themes (e.g., "Solution requests," "Pain & anger," "Advice requests," "Money talk," and any newly added themes).
- Ultimately, this tool should help end-users quickly understand the trends and topics circulating within any subreddit.

## 2. Key Goals
- Provide an intuitive dashboard that lists all tracked subreddits.
- Support adding new subreddits via a simple user flow (e.g., input the subreddit URL or name in a modal).
- Display top posts for each subreddit (last 24 hours) in a sortable table.
- Perform thematic categorization of posts using OpenAI, displayed in a tabbed interface.
- Allow adding new themes (cards) that trigger re-analysis of existing posts.
- Keep the codebase minimal and well-organized for maintainability.

## 3. Core Functionalities

### 3.1 Manage Subreddits
**List View (Homepage)**
- Display all subreddits in "cards." For example, we might have ollama, openai, etc.
- Each card shows the subreddit name (and possibly a short description or summary if desired).

**Add a New Subreddit**
- "Add Subreddit" button triggers a modal.
- User enters a subreddit URL or name.
- On submission, a new card is instantly added to the list.

### 3.2 Subreddit Page (Dynamic Route)
- Clicking a subreddit card navigates to a detail page (e.g., /[subreddit]).
- This detail page has two tabs:
  - Top posts
  - Themes

### 3.3 Top Posts (Last 24 hours)
- Show a sortable table of top posts (based on score).
- Data is fetched using Snoowrap (the official Reddit API wrapper for Node.js).
- Table columns:
  - Title
  - Score
  - Content (selftext)
  - URL
  - Created At (UTC)
  - Number of Comments
- Table can be sorted by score or other relevant columns.

### 3.4 Themes (Post Categorization)
- Posts fetched in Top Posts are sent to OpenAI for thematic analysis.
- Themes are (initially):
  - Solution requests: People explicitly seeking solutions to problems.
  - Pain & anger: Expressing frustration, anger, or pain.
  - Advice requests: Requesting suggestions or feedback.
  - Money talk: Discussing financial issues, costs, budgets, etc.
- Concurrent Processing:
  - The analysis should happen in parallel to speed up classification.
  - Each post is categorized into exactly one of the above themes (or multiple if you choose to support multi-label classification; that is up to the design).
- Display Themes:
  - "Themes" page shows a card for each category with:
    - Title
    - Description
    - Count of posts that fall under this category
  - Clicking on a theme card opens a side panel showing the posts belonging to that theme.

### 3.5 Adding New Cards (Themes)
- Users can add new themes (beyond the four default ones).
- Once a new theme is added, the system re-runs classification to check if any existing post qualifies for that new theme (depending on the design of the prompt logic).

## 4. Technical Stack
- Next.js 14: For the front-end & server-side rendering.
- Tailwind CSS + shadcn: For styling and UI components.
- Lucide Icons: For icons.
- Snoowrap: For fetching Reddit data.
- OpenAI: For thematic analysis of post content.

## 5. Minimal File Structure
Below is a minimal Next.js 13/14 file structure that balances clarity and maintainability:

```
reddit-analytics-platform/
└── web/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx            // Homepage: lists subreddits & "Add Subreddit" modal
    │   │   └── [subreddit]/
    │   │       ├── page.tsx        // Subreddit details: 2 tabs (Top Posts & Themes)
    │   │       ├── top-posts.tsx   // (Optional) Separate file for top posts tab
    │   │       └── themes.tsx      // (Optional) Separate file for themes tab
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── card.tsx        // Reusable card component
    │   │   │   ├── modal.tsx       // Generic modal (used for "Add Subreddit")
    │   │   │   ├── table.tsx       // Table for "Top Posts"
    │   │   │   └── ...
    │   │   └── subreddit-card.tsx  // Custom card for displaying a subreddit on homepage
    │   └── lib/
    │       ├── reddit/
    │       │   └── snoowrap.ts     // Snoowrap initialization & fetch logic
    │       └── analysis.ts         // OpenAI logic for categorizing posts
    └── node_modules/
```

Notes:
- The app/ directory handles routing, pages, and layout.
- The components/ directory hosts reusable React components.
- The lib/ directory holds business logic (Reddit fetching + OpenAI analysis).
- The public/ directory contains static files (images, icons, etc.).

## 6. Documentation

### 6.1 Snoowrap Usage
The following sample code shows how we might fetch posts from Reddit. This snippet is also useful as a reference. The actual implementation will live in src/lib/reddit/snoowrap.ts.

```typescript
// FILE: snoowrap.ts (EXAMPLE ONLY, do not copy/paste as-is)

// 1. Import Snoowrap & config
import Snoowrap from 'snoowrap';
import { redditConfig } from './redditConfig';

// 2. Define the structure of a Reddit post
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
 * Initialize Snoowrap with Reddit API credentials
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
 * @param subredditName - e.g., "ollama"
 * @param limit - how many posts to fetch
 */
export const fetchRecentPosts = async (
  subredditName: string,
  limit: number = 100
): Promise<RedditPost[]> => {
  try {
    const reddit = initRedditClient();
    
    const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    
    const posts = await reddit
      .getSubreddit(subredditName)
      .getNew({ limit })
      .then((submissions) => 
        submissions
          .filter((post) => post.created_utc > oneDayAgo)
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
```

This code snippet demonstrates how to:
- Initialize a Snoowrap client with the user's Reddit credentials.
- Fetch new posts from a subreddit.
- Filter them to only include posts from the last 24 hours.
- Map them to a consistent format.

### 6.2 OpenAI / Thematic Analysis
In src/lib/analysis.ts, we will define a function (e.g. categorizePost()) that:
- Receives a post's title and content.
- Sends it to OpenAI with a prompt instructing the model to categorize the post into one of the recognized themes.
- Returns the category as a string or object.

For concurrency, consider using Promise.all() or similar approaches in Next.js server-side code to quickly process multiple posts.

## 7. Detailed Implementation Notes

**Homepage (app/page.tsx):**
- Renders a list of subreddits (cards).
- "Add Subreddit" button triggers a modal (in components/ui/modal.tsx) to input a subreddit URL.
- On submit:
  - The new subreddit is saved (in memory, a local store, or your DB).
  - The list re-renders to show the new subreddit card.

**Subreddit Page (app/[subreddit]/page.tsx):**
- Tab 1: Top Posts
  - Renders a table of posts (fetched via fetchRecentPosts).
  - Allows sorting by "score" or other columns.
- Tab 2: Themes
  - For each post retrieved, call analysis.ts to categorize.
  - Show cards for each theme with the count of how many posts match.
  - Clicking a card opens a side panel listing all posts under that theme.

**Adding New Themes:**
- We have four default categories:
  - "Solution requests," "Pain & anger," "Advice requests," "Money talk."
- A user can add a new theme. Upon addition:
  - We re-run classification for all posts or handle this logic in real time with the new theme.
  - The new theme appears as a card in the "Themes" tab.

## 8. Acceptance Criteria

**Subreddit Management**
- ✓ Users can see at least one default subreddit (e.g., "ollama" or "openai").
- ✓ Clicking "Add Subreddit" reveals a modal.
- ✓ Upon submission, a new subreddit card is created.

**Top Posts**
- ✓ Displays fetched posts from the past 24 hours.
- ✓ Sorts the table by score.
- ✓ Each post includes title, score, content, URL, creation time, and comment count.

**Themes**
- ✓ Each post is categorized into one of four default themes.
- ✓ Theme cards show the number of posts categorized there.
- ✓ Clicking a theme card opens a panel listing posts in that category.

**Add New Theme**
- ✓ Adding a theme triggers re-analysis (or partial analysis) of posts.
- ✓ Newly added theme appears on the "Themes" tab with accurate counts.

## 9. Next Steps & Considerations
- API Credentials: Store Snoowrap and OpenAI credentials securely (e.g., environment variables).
- Caching: For performance, consider caching responses from Snoowrap & analysis results.
- Error Handling: Build out user-friendly error states if a subreddit is invalid or the analysis fails.
- Pagination: If needed for large subreddits, handle more than 100 posts with pagination.
- Rate Limits: Respect Reddit's and OpenAI's usage limits (throttling, concurrency, etc.).

## 10. Conclusion
This PRD outlines the complete specification, file structure, and references for building a minimal Reddit Analytics Platform using Next.js 14, Tailwind, shadcn, Lucide Icons, Snoowrap, and OpenAI. The above functionalities and architecture should give developers a clear roadmap to implement the project efficiently while keeping code maintainable.

No further code is provided here, only the structure and examples needed to proceed with the implementation.
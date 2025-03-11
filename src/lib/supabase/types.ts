export type Database = {
  public: {
    Tables: {
      subreddits: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reddit_posts: {
        Row: {
          id: string;
          subreddit_id: string;
          title: string;
          content: string | null;
          score: number;
          num_comments: number;
          url: string;
          created_at: string;
          permalink: string;
          fetched_at: string;
        };
        Insert: {
          id: string;
          subreddit_id: string;
          title: string;
          content?: string | null;
          score: number;
          num_comments: number;
          url: string;
          created_at?: string;
          permalink: string;
          fetched_at?: string;
        };
        Update: {
          id?: string;
          subreddit_id?: string;
          title?: string;
          content?: string | null;
          score?: number;
          num_comments?: number;
          url?: string;
          created_at?: string;
          permalink?: string;
          fetched_at?: string;
        };
      };
      post_analysis: {
        Row: {
          analysis_id: string;
          post_id: string;
          theme: string;
          analysis_date: string;
        };
        Insert: {
          analysis_id?: string;
          post_id: string;
          theme: string;
          analysis_date?: string;
        };
        Update: {
          analysis_id?: string;
          post_id?: string;
          theme?: string;
          analysis_date?: string;
        };
      };
    };
  };
}; 
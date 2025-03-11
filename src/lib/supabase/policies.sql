-- Enable Row Level Security for all tables
ALTER TABLE subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analysis ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read all data
CREATE POLICY "Allow anonymous read subreddits" ON subreddits
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous read posts" ON reddit_posts
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous read analysis" ON post_analysis
  FOR SELECT TO anon USING (true);

-- Allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert subreddits" ON subreddits
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert posts" ON reddit_posts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert analysis" ON post_analysis
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous users to update data
CREATE POLICY "Allow anonymous update subreddits" ON subreddits
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous update posts" ON reddit_posts
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous update analysis" ON post_analysis
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
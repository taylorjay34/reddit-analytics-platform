-- Enable Row Level Security
ALTER TABLE subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for subreddits table
CREATE POLICY "Enable read access for all users" ON subreddits
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for service role" ON subreddits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for service role" ON subreddits
    FOR UPDATE USING (true);

-- Create policies for reddit_posts table
CREATE POLICY "Enable read access for all users" ON reddit_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for service role" ON reddit_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for service role" ON reddit_posts
    FOR UPDATE USING (true);

-- Create policies for post_analysis table
CREATE POLICY "Enable read access for all users" ON post_analysis
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for service role" ON post_analysis
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for service role" ON post_analysis
    FOR UPDATE USING (true);

-- Grant table permissions
GRANT SELECT ON subreddits TO anon;
GRANT SELECT, INSERT, UPDATE ON subreddits TO authenticated;
GRANT ALL ON subreddits TO service_role;

GRANT SELECT ON reddit_posts TO anon;
GRANT SELECT, INSERT, UPDATE ON reddit_posts TO authenticated;
GRANT ALL ON reddit_posts TO service_role;

GRANT SELECT ON post_analysis TO anon;
GRANT SELECT, INSERT, UPDATE ON post_analysis TO authenticated;
GRANT ALL ON post_analysis TO service_role; 
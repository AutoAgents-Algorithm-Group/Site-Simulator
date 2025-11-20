-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'error')),
  duration_ms INTEGER NOT NULL,
  tool_calls JSONB,
  workflow JSONB,
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on test_id for faster queries
CREATE INDEX idx_test_results_test_id ON test_results(test_id);
CREATE INDEX idx_test_results_category ON test_results(category);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_test_results_created_at ON test_results(created_at DESC);

-- Create reddit_activity_logs table
CREATE TABLE IF NOT EXISTS reddit_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'comment', 'submit', 'rate_limited')),
  comment_text TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'rate_limited', 'error')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on post_id and action_type for faster queries
CREATE INDEX idx_reddit_activity_post_id ON reddit_activity_logs(post_id);
CREATE INDEX idx_reddit_activity_action_type ON reddit_activity_logs(action_type);
CREATE INDEX idx_reddit_activity_created_at ON reddit_activity_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write (adjust for production)
CREATE POLICY "Allow public read access on test_results"
  ON test_results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on test_results"
  ON test_results FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access on reddit_activity_logs"
  ON reddit_activity_logs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on reddit_activity_logs"
  ON reddit_activity_logs FOR INSERT
  TO public
  WITH CHECK (true);


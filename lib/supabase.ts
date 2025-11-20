import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface TestResult {
  id?: string;
  test_id: string;
  test_name: string;
  category: string;
  status: 'success' | 'failure' | 'error';
  duration_ms: number;
  tool_calls?: any;
  workflow?: any;
  metrics?: any;
  created_at?: string;
}

export interface RedditActivityLog {
  id?: string;
  post_id: string;
  action_type: 'view' | 'comment' | 'submit' | 'rate_limited';
  comment_text?: string;
  status: 'success' | 'rate_limited' | 'error';
  metadata?: any;
  created_at?: string;
}

// Helper functions for logging
export async function logTestResult(result: Omit<TestResult, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('test_results')
    .insert([result])
    .select()
    .single();

  if (error) {
    console.error('Error logging test result:', error);
    throw error;
  }

  return data;
}

export async function logRedditActivity(
  activity: Omit<RedditActivityLog, 'id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('reddit_activity_logs')
    .insert([activity])
    .select()
    .single();

  if (error) {
    console.error('Error logging Reddit activity:', error);
    throw error;
  }

  return data;
}

export async function getRecentTests(limit: number = 50) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent tests:', error);
    throw error;
  }

  return data;
}

export async function getTestsByCategory(category: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching tests by category:', error);
    throw error;
  }

  return data;
}

export async function getRecentRedditActivity(limit: number = 100) {
  const { data, error } = await supabase
    .from('reddit_activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching Reddit activity:', error);
    throw error;
  }

  return data;
}

export async function getRedditActivityByPost(postId: string) {
  const { data, error } = await supabase
    .from('reddit_activity_logs')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activity by post:', error);
    throw error;
  }

  return data;
}


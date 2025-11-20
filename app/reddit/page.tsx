'use client';

import Link from 'next/link';
import { useState } from 'react';
import RedditStatsPanel from '@/components/RedditStatsPanel';
import { logRedditActivity } from '@/lib/supabase';

interface Post {
  id: number;
  title: string;
  author: string;
  upvotes: number;
  comments: number;
  time: string;
  flair: string;
}

export default function RedditListPage() {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: 'How to build a browser extension with modern JavaScript',
      author: 'dev_user',
      upvotes: 234,
      comments: 46,
      time: '2h ago',
      flair: 'Tutorial',
    },
    {
      id: 2,
      title: 'Best practices for web automation testing in 2024',
      author: 'qa_expert',
      upvotes: 189,
      comments: 32,
      time: '4h ago',
      flair: 'Discussion',
    },
    {
      id: 3,
      title: 'Understanding rate limiting in API development',
      author: 'backend_dev',
      upvotes: 156,
      comments: 28,
      time: '6h ago',
      flair: 'Technical',
    },
    {
      id: 4,
      title: 'My experience building autonomous web agents',
      author: 'ai_researcher',
      upvotes: 421,
      comments: 87,
      time: '8h ago',
      flair: 'Project',
    },
    {
      id: 5,
      title: 'CSS tricks for better user experience',
      author: 'frontend_ninja',
      upvotes: 312,
      comments: 54,
      time: '10h ago',
      flair: 'Tutorial',
    },
  ]);

  const handlePostView = async (postId: number) => {
    try {
      await logRedditActivity({
        post_id: postId.toString(),
        action_type: 'view',
        status: 'success',
        metadata: { timestamp: Date.now() },
      });
    } catch (error) {
      console.error('Failed to log post view:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-orange-600">r/webdev</h1>
              <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Mock Environment
              </span>
            </div>
            <Link
              href="/reddit/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Activity →
            </Link>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🧪 Test Environment:</span> This is a simulated Reddit
            page for automation testing. All actions are logged to Supabase.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Upvote Section */}
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <button className="hover:text-orange-600">▲</button>
                    <span className="text-sm font-semibold">{post.upvotes}</span>
                    <button className="hover:text-blue-600">▼</button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {post.flair}
                      </span>
                      <span className="text-xs text-gray-500">
                        Posted by u/{post.author} • {post.time}
                      </span>
                    </div>

                    <Link
                      href={`/reddit/${post.id}`}
                      data-testid="post-title"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-2"
                      onClick={() => handlePostView(post.id)}
                    >
                      {post.title}
                    </Link>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Link
                        href={`/reddit/${post.id}`}
                        data-testid="comments-button"
                        className="hover:bg-gray-100 px-3 py-1 rounded flex items-center gap-1"
                        onClick={() => handlePostView(post.id)}
                      >
                        <span>💬</span>
                        <span id={`comment-count-${post.id}`}>{post.comments}</span>
                        <span>Comments</span>
                      </Link>
                      <button className="hover:bg-gray-100 px-3 py-1 rounded">Share</button>
                      <button className="hover:bg-gray-100 px-3 py-1 rounded">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Load More Posts
          </button>
        </div>
      </main>

      {/* Stats Panel */}
      <RedditStatsPanel />
    </div>
  );
}


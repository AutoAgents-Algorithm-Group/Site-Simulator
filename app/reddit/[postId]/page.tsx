'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import RedditStatsPanel from '@/components/RedditStatsPanel';
import { logRedditActivity } from '@/lib/supabase';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  upvotes: number;
}

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  upvotes: number;
  time: string;
  flair: string;
}

export default function RedditDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const commentInputRef = useRef<HTMLDivElement>(null);

  const [post] = useState<Post>({
    id: parseInt(postId),
    title: 'How to build a browser extension with modern JavaScript',
    author: 'dev_user',
    content:
      "I've been working on browser extensions for a while now, and I wanted to share some insights about building them with modern JavaScript. The ecosystem has evolved significantly...",
    upvotes: 234,
    time: '2h ago',
    flair: 'Tutorial',
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'user123',
      text: 'Great post! Very helpful information.',
      timestamp: '1h ago',
      upvotes: 12,
    },
    {
      id: 2,
      author: 'coder456',
      text: 'Thanks for sharing. Looking forward to more content like this.',
      timestamp: '45m ago',
      upvotes: 8,
    },
  ]);

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const RATE_LIMIT_COOLDOWN = 3000; // 3 seconds
  const PROCESSING_DELAY = 1500; // 1.5 seconds simulated processing

  useEffect(() => {
    // Update cooldown timer
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 100));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [cooldownRemaining]);

  const updateStats = (updates: Partial<any>) => {
    const event = new CustomEvent('statsUpdate', {
      detail: {
        commentsPosted: comments.length,
        rateLimitHits: 0,
        lastAction: 'Posted',
        cooldownStatus: cooldownRemaining > 0 ? 'cooling' : 'ready',
        botStatus: 'clean',
        ...updates,
      },
    });
    window.dispatchEvent(event);
  };

  const handleCommentClick = () => {
    commentInputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      setStatusMessage('❌ Comment cannot be empty');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;

    // Check rate limit
    if (timeSinceLastSubmit < RATE_LIMIT_COOLDOWN) {
      const remaining = Math.ceil((RATE_LIMIT_COOLDOWN - timeSinceLastSubmit) / 1000);
      setStatusMessage(`⏱️ Rate limited! Please wait ${remaining}s`);
      setCooldownRemaining(RATE_LIMIT_COOLDOWN - timeSinceLastSubmit);

      // Log rate limit hit
      await logRedditActivity({
        post_id: postId,
        action_type: 'rate_limited',
        comment_text: commentText,
        status: 'rate_limited',
        metadata: { cooldownRemaining: remaining },
      });

      updateStats({
        rateLimitHits: 1,
        lastAction: 'Rate Limited',
        cooldownStatus: 'limited',
      });

      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('⏳ Processing...');

    // Log comment attempt
    await logRedditActivity({
      post_id: postId,
      action_type: 'submit',
      comment_text: commentText,
      status: 'success',
      metadata: { commentLength: commentText.length },
    });

    // Simulate processing delay
    setTimeout(() => {
      const newComment: Comment = {
        id: comments.length + 1,
        author: 'automation_test',
        text: commentText,
        timestamp: 'just now',
        upvotes: 1,
      };

      setComments([newComment, ...comments]);
      setCommentText('');
      setLastSubmitTime(now);
      setCooldownRemaining(RATE_LIMIT_COOLDOWN);
      setStatusMessage('✅ Comment posted successfully!');
      setIsSubmitting(false);

      // Update stats
      updateStats({
        commentsPosted: comments.length + 1,
        lastAction: 'Posted',
        cooldownStatus: 'cooling',
      });

      setTimeout(() => setStatusMessage(''), 3000);
    }, PROCESSING_DELAY);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/reddit"
              id="btn-back"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>←</span>
              <span>Back to r/webdev</span>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-orange-600">r/webdev</h1>
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Mock
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
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

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <p className="text-gray-700 leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <button
                  onClick={handleCommentClick}
                  data-testid="comments-button"
                  className="hover:bg-gray-100 px-3 py-1 rounded flex items-center gap-1"
                >
                  <span>💬</span>
                  <span id={`comment-count-detail-${post.id}`}>{comments.length}</span>
                  <span>Comments</span>
                </button>
                <button className="hover:bg-gray-100 px-3 py-1 rounded">Share</button>
                <button className="hover:bg-gray-100 px-3 py-1 rounded">Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="text-sm text-gray-700 mb-2">Comment as automation_test</div>
          <div
            ref={commentInputRef}
            contentEditable
            data-testid="comment-input"
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onInput={(e) => setCommentText(e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {statusMessage && (
                <span
                  className={`text-sm font-medium ${
                    statusMessage.includes('✅')
                      ? 'text-green-600 status-success'
                      : statusMessage.includes('❌')
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {statusMessage}
                </span>
              )}
              {cooldownRemaining > 0 && (
                <span className="text-xs text-gray-500">
                  Cooldown: {(cooldownRemaining / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !commentText.trim()}
              data-testid="submit-button"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 text-gray-500 text-xs">
                  <button className="hover:text-orange-600">▲</button>
                  <span className="font-semibold">{comment.upvotes}</span>
                  <button className="hover:text-blue-600">▼</button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-900">u/{comment.author}</span>
                    <span className="text-xs text-gray-500">• {comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <button className="hover:text-blue-600">Reply</button>
                    <button className="hover:text-blue-600">Share</button>
                    <button className="hover:text-blue-600">Report</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Stats Panel */}
      <RedditStatsPanel />
    </div>
  );
}


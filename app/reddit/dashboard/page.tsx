'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getRecentRedditActivity, RedditActivityLog } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export default function RedditActivityDashboard() {
  const [activities, setActivities] = useState<RedditActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getRecentRedditActivity(200);
      setActivities(data);
    } catch (error) {
      console.error('Failed to load Reddit activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true;
    return activity.action_type === filter;
  });

  const stats = {
    total: activities.length,
    views: activities.filter((a) => a.action_type === 'view').length,
    comments: activities.filter((a) => a.action_type === 'comment').length,
    submits: activities.filter((a) => a.action_type === 'submit').length,
    rateLimited: activities.filter((a) => a.action_type === 'rate_limited').length,
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view':
        return 'bg-blue-100 text-blue-800';
      case 'comment':
        return 'bg-yellow-100 text-yellow-800';
      case 'submit':
        return 'bg-green-100 text-green-800';
      case 'rate_limited':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'rate_limited':
        return '⏱️';
      case 'error':
        return '❌';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reddit Activity Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/reddit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
              >
                Open Reddit Mock
              </Link>
              <button
                onClick={loadActivities}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Total Actions</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Views</div>
            <div className="text-3xl font-bold text-blue-600">{stats.views}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Comments</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.comments}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Submits</div>
            <div className="text-3xl font-bold text-green-600">{stats.submits}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Rate Limited</div>
            <div className="text-3xl font-bold text-red-600">{stats.rateLimited}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <label className="text-sm font-medium text-gray-700 mr-2">Filter by Action:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Actions</option>
            <option value="view">Views</option>
            <option value="comment">Comments</option>
            <option value="submit">Submits</option>
            <option value="rate_limited">Rate Limited</option>
          </select>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No Reddit activity found.</p>
              <p className="text-sm mt-2">
                Start interacting with the{' '}
                <Link href="/reddit" className="text-blue-600 hover:text-blue-800 underline">
                  Reddit Mock page
                </Link>{' '}
                to see activity here!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-2xl">{getStatusIcon(activity.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(activity.action_type)}`}>
                          {activity.action_type}
                        </span>
                        <span className="text-sm text-gray-500">Post #{activity.post_id}</span>
                        <span className="text-xs text-gray-400">
                          {activity.created_at && formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {activity.comment_text && (
                        <p className="text-sm text-gray-700 mt-2 italic">"{activity.comment_text}"</p>
                      )}
                      {activity.metadata && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View metadata
                          </summary>
                          <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Chart (simplified text-based) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Views</span>
                <span className="font-medium text-gray-900">
                  {stats.views} ({stats.total > 0 ? ((stats.views / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.views / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Comments</span>
                <span className="font-medium text-gray-900">
                  {stats.comments} ({stats.total > 0 ? ((stats.comments / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.comments / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Submits</span>
                <span className="font-medium text-gray-900">
                  {stats.submits} ({stats.total > 0 ? ((stats.submits / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.submits / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Rate Limited</span>
                <span className="font-medium text-gray-900">
                  {stats.rateLimited} ({stats.total > 0 ? ((stats.rateLimited / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.rateLimited / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

interface RedditStats {
  commentsPosted: number;
  rateLimitHits: number;
  lastAction: string;
  cooldownStatus: 'ready' | 'cooling' | 'limited';
  botStatus: 'clean' | 'suspicious' | 'flagged';
}

export default function RedditStatsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<RedditStats>({
    commentsPosted: 0,
    rateLimitHits: 0,
    lastAction: 'None',
    cooldownStatus: 'ready',
    botStatus: 'clean',
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('redditStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Listen for stat updates
    const handleStatsUpdate = (event: CustomEvent) => {
      setStats(event.detail);
      localStorage.setItem('redditStats', JSON.stringify(event.detail));
    };

    window.addEventListener('statsUpdate' as any, handleStatsUpdate);
    return () => {
      window.removeEventListener('statsUpdate' as any, handleStatsUpdate);
    };
  }, []);

  const exportTestData = () => {
    const data = {
      stats,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reddit-test-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetStats = () => {
    const newStats: RedditStats = {
      commentsPosted: 0,
      rateLimitHits: 0,
      lastAction: 'None',
      cooldownStatus: 'ready',
      botStatus: 'clean',
    };
    setStats(newStats);
    localStorage.setItem('redditStats', JSON.stringify(newStats));
  };

  const getBotStatusColor = () => {
    switch (stats.botStatus) {
      case 'clean':
        return 'text-green-600';
      case 'suspicious':
        return 'text-yellow-600';
      case 'flagged':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCooldownColor = () => {
    switch (stats.cooldownStatus) {
      case 'ready':
        return 'text-green-600';
      case 'cooling':
        return 'text-yellow-600';
      case 'limited':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`fixed top-20 right-0 bg-white shadow-lg border-l border-gray-200 transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Toggle Button */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-semibold text-sm ${isOpen ? 'block' : 'hidden'}`}>
          📊 Live Stats
        </span>
        <span className="text-lg">{isOpen ? '▶' : '◀'}</span>
      </div>

      {/* Stats Content */}
      {isOpen && (
        <div className="p-4 space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Comments Posted</div>
            <div className="text-2xl font-bold text-blue-600">{stats.commentsPosted}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Rate Limit Hits</div>
            <div className="text-2xl font-bold text-orange-600">{stats.rateLimitHits}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Last Action</div>
            <div className="text-sm font-medium text-gray-900">{stats.lastAction}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Cooldown</div>
            <div className={`text-sm font-semibold ${getCooldownColor()}`}>
              {stats.cooldownStatus.charAt(0).toUpperCase() + stats.cooldownStatus.slice(1)}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs text-gray-500 mb-1">Bot Status</div>
            <div className={`text-sm font-semibold ${getBotStatusColor()}`}>
              {stats.botStatus === 'clean' && '🟢 Clean'}
              {stats.botStatus === 'suspicious' && '🟡 Suspicious'}
              {stats.botStatus === 'flagged' && '🔴 Flagged'}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <button
              onClick={exportTestData}
              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              📥 Export Test Data
            </button>
            <button
              onClick={resetStats}
              className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              🔄 Reset Stats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


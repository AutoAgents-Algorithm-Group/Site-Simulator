import Link from 'next/link';
import TestRunner from '@/components/TestRunner';
import { getTestById } from '@/lib/test-config';

export default function RedditLoopTestPage() {
  const config = getTestById('showcase_02_reddit_loop');

  if (!config) {
    return <div>Test not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
            <Link
              href="/reddit"
              className="text-sm text-orange-600 hover:text-orange-800 font-medium"
            >
              Open Reddit Mock →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> This test simulates automated Reddit
            commenting with loop iteration, rate limiting, and anti-bot detection. Open the{' '}
            <Link href="/reddit" className="underline">
              Reddit Mock page
            </Link>{' '}
            in another tab to see the simulation in action.
          </p>
        </div>
        <TestRunner config={config} />
      </main>
    </div>
  );
}


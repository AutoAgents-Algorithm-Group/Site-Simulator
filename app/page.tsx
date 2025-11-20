import Link from 'next/link';
import TestCard from '@/components/TestCard';

export default function Home() {
  const featuredTests = [
    {
      id: 'showcase_01_basic_nav',
      title: 'Basic Navigation Test',
      description: 'Test basic navigation, form filling, and button interactions',
      category: 'Basic',
      link: '/tests/basic-nav',
      tags: ['navigation', 'forms', 'clicks'],
    },
    {
      id: 'showcase_02_reddit_loop',
      title: 'Reddit Comment Loop',
      description: 'Automated Reddit comment loop with rate limiting and anti-bot detection',
      category: 'Advanced',
      link: '/tests/reddit-loop',
      tags: ['loop', 'reddit', 'anti-bot'],
    },
    {
      id: 'showcase_05_form_interaction',
      title: 'Form Interaction',
      description: 'Complex form filling and validation testing',
      category: 'Basic',
      link: '/tests/form-test',
      tags: ['forms', 'validation'],
    },
    {
      id: 'showcase_03_selector_stability',
      title: 'Selector Stability',
      description: 'Test selector reliability across different element types',
      category: 'Advanced',
      link: '/tests/selector-test',
      tags: ['selectors', 'stability'],
    },
    {
      id: 'showcase_04_data_extraction',
      title: 'Data Extraction',
      description: 'Extract and parse data from web pages',
      category: 'Basic',
      link: '/tests/data-extraction',
      tags: ['data', 'extraction', 'parsing'],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Noma Evaluation Tool</h1>
              <p className="text-gray-600 mt-1">Reddit Auto-Comment Simulation & Testing</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Interactive Test Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of automated tests for Reddit simulation, form interactions,
            and web automation workflows. All tests are logged to Supabase for analysis.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/reddit"
            className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg text-white hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-2">Reddit Mock</h3>
            <p className="text-orange-100">Interactive Reddit simulation environment</p>
          </Link>
          <Link
            href="/reddit/dashboard"
            className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg text-white hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-2">Activity Logs</h3>
            <p className="text-blue-100">View all Reddit activity and statistics</p>
          </Link>
          <Link
            href="/dashboard"
            className="p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg text-white hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-2">Test Results</h3>
            <p className="text-green-100">Analyze test execution metrics</p>
          </Link>
        </div>

        {/* Featured Tests */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTests.map((test) => (
              <TestCard key={test.id} {...test} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            Noma Evaluation Tool - Reddit Automation Testing Suite
          </p>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';
import TestRunner from '@/components/TestRunner';
import { getTestById } from '@/lib/test-config';

export default function FormTestPage() {
  const config = getTestById('showcase_05_form_interaction');

  if (!config) {
    return <div>Test not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <TestRunner config={config} />
      </main>
    </div>
  );
}


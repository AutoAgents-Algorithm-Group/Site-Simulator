'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase, TestResult } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export default function TestDetailPage() {
  const params = useParams();
  const resultId = params.resultId as string;
  const [test, setTest] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestDetail();
  }, [resultId]);

  const loadTestDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('test_results').select('*').eq('id', resultId).single();

      if (error) throw error;
      setTest(data);
    } catch (error) {
      console.error('Failed to load test detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Test result not found</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{test.test_name}</h1>
          <p className="text-sm text-gray-500 mt-1">{test.test_id}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(test.status)}`}>
              {test.status.toUpperCase()}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Duration</div>
            <div className="text-2xl font-bold text-gray-900">{test.duration_ms}ms</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Executed</div>
            <div className="text-sm font-medium text-gray-900">
              {test.created_at && formatDistanceToNow(new Date(test.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Metrics */}
        {test.metrics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(test.metrics as Record<string, any>).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm text-gray-500 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool Calls / Actions */}
        {test.tool_calls && Array.isArray(test.tool_calls) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tool Calls ({test.tool_calls.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {test.tool_calls.map((action: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {action.step || index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{action.action}</span>
                      {action.result && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            action.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {action.result}
                        </span>
                      )}
                    </div>
                    {action.params && (
                      <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                        {JSON.stringify(action.params, null, 2)}
                      </pre>
                    )}
                    {action.duration && <div className="text-xs text-gray-500 mt-1">{action.duration}ms</div>}
                    {action.error && <div className="text-xs text-red-600 mt-1">Error: {action.error}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow */}
        {test.workflow && Array.isArray(test.workflow) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expected Workflow</h2>
            <div className="space-y-2">
              {test.workflow.map((step: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{step.action}</div>
                    {step.label && <div className="text-sm text-gray-600 mt-1">{step.label}</div>}
                    {step.description && <div className="text-xs text-gray-500 mt-1">{step.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


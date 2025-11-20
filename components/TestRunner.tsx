'use client';

import { useState } from 'react';
import { TestConfig } from '@/lib/test-config';
import { executeTest, TestTrajectory, evaluateResult } from '@/lib/execution-engine';

interface TestRunnerProps {
  config: TestConfig;
}

export default function TestRunner({ config }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [trajectory, setTrajectory] = useState<TestTrajectory | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleRunTest = async () => {
    setIsRunning(true);
    setEvaluation(null);
    setTrajectory(null);

    try {
      const result = await executeTest(
        config,
        (step: number, total: number, action: string) => {
          setCurrentStep(step);
          setTotalSteps(total);
          setCurrentAction(action);
        }
      );

      setTrajectory(result);
      const evalResult = evaluateResult(config, result);
      setEvaluation(evalResult);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'error':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.name}</h2>
        <p className="text-gray-600 mb-4">{config.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {config.category}
          </span>
          {config.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">User Intent:</h3>
          <p className="text-gray-700 text-sm">{config.user_intent}</p>
        </div>
      </div>

      {/* Run Test Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunTest}
          disabled={isRunning}
          className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isRunning ? '🔄 Running Test...' : '▶️ Run Test'}
        </button>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">Current action:</span> {currentAction}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {trajectory && evaluation && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Test Results</h3>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div className={`text-2xl font-bold ${getStatusColor(trajectory.status)}`}>
                {trajectory.status.toUpperCase()}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Score</div>
              <div className={`text-2xl font-bold ${evaluation.passed ? 'text-green-600' : 'text-red-600'}`}>
                {evaluation.score}/100
                {evaluation.passed && ' ✓'}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="text-2xl font-bold text-gray-900">{trajectory.totalDuration}ms</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Steps Completed</div>
              <div className="text-2xl font-bold text-gray-900">
                {evaluation.metrics.completedSteps}/{evaluation.metrics.totalSteps}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Detailed Metrics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Success Rate:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {evaluation.metrics.successRate.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Total Steps:</span>
                <span className="ml-2 font-medium text-gray-900">{evaluation.metrics.totalSteps}</span>
              </div>
              <div>
                <span className="text-gray-500">Completed Steps:</span>
                <span className="ml-2 font-medium text-gray-900">{evaluation.metrics.completedSteps}</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="ml-2 font-medium text-gray-900">{evaluation.metrics.duration}ms</span>
              </div>
            </div>
          </div>

          {/* Actions Timeline */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Actions Timeline</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trajectory.actions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {action.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{action.action}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          action.result === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {action.result}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {action.duration}ms
                      {action.error && <span className="ml-2 text-red-600">• {action.error}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Expected Workflow</h3>
        <div className="space-y-2">
          {config.expected_workflow.map((step, index) => (
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
    </div>
  );
}


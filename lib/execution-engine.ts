import { TestConfig, WorkflowStep } from './test-config';
import { logTestResult, logRedditActivity } from './supabase';

// Action types for trajectory recording
export interface ActionRecord {
  step: number;
  action: string;
  params: Record<string, any>;
  timestamp: number;
  result?: 'success' | 'failure' | 'error';
  error?: string;
  duration?: number;
}

export interface TestTrajectory {
  testId: string;
  actions: ActionRecord[];
  startTime: number;
  endTime?: number;
  totalDuration?: number;
  status: 'running' | 'completed' | 'failed' | 'error';
}

// Execution state
let currentTrajectory: TestTrajectory | null = null;

// Initialize a new test execution
export function initializeTest(testId: string): TestTrajectory {
  currentTrajectory = {
    testId,
    actions: [],
    startTime: Date.now(),
    status: 'running',
  };
  return currentTrajectory;
}

// Record an action in the trajectory
export async function recordAction(
  action: string,
  params: Record<string, any>,
  result: 'success' | 'failure' | 'error' = 'success',
  error?: string
): Promise<ActionRecord> {
  if (!currentTrajectory) {
    throw new Error('No active test trajectory');
  }

  const actionRecord: ActionRecord = {
    step: currentTrajectory.actions.length + 1,
    action,
    params,
    timestamp: Date.now(),
    result,
    error,
    duration: Date.now() - currentTrajectory.startTime,
  };

  currentTrajectory.actions.push(actionRecord);

  // Log Reddit-specific actions to Supabase
  if (action === 'comment' || action === 'submit') {
    try {
      await logRedditActivity({
        post_id: params.postId || 'unknown',
        action_type: action === 'comment' ? 'comment' : 'submit',
        comment_text: params.value || params.text,
        status: result,
        metadata: { step: actionRecord.step, params },
      });
    } catch (err) {
      console.error('Failed to log Reddit activity:', err);
    }
  }

  return actionRecord;
}

// Execute a single workflow step (simplified client-side version)
export async function executeStep(
  step: WorkflowStep,
  context: any = {}
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const { action, params } = step;

    // Simulate step execution (in real implementation, this would interact with the DOM)
    switch (action) {
      case 'navigate':
        await recordAction('navigate', params);
        return { success: true, data: { url: params.url } };

      case 'click':
        await recordAction('click', params);
        // Simulate click - would use querySelector and click() in real implementation
        return { success: true };

      case 'fill':
        await recordAction('fill', params);
        // Simulate fill - would set input value in real implementation
        return { success: true };

      case 'wait':
        await recordAction('wait', params);
        if (params.duration) {
          await new Promise((resolve) => setTimeout(resolve, params.duration));
        }
        return { success: true };

      case 'extract_data':
        await recordAction('extract_data', params);
        // Simulate data extraction
        return { success: true, data: { extracted: true } };

      case 'loop_elements':
        await recordAction('loop_elements', params);
        // Simulate loop - would iterate through elements in real implementation
        const iterations = params.maxIterations || 1;
        for (let i = 0; i < iterations; i++) {
          if (step.loop_actions) {
            for (const loopAction of step.loop_actions) {
              await executeStep(loopAction, { ...context, iterationIndex: i });
            }
          }
        }
        return { success: true, data: { iterations } };

      default:
        await recordAction(action, params);
        return { success: true };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await recordAction(step.action, step.params, 'error', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Execute a complete test
export async function executeTest(
  config: TestConfig,
  onProgress?: (step: number, total: number, action: string) => void
): Promise<TestTrajectory> {
  const trajectory = initializeTest(config.id);

  try {
    const steps = config.expected_workflow;
    const totalSteps = steps.length;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      onProgress?.(i + 1, totalSteps, step.action);

      const result = await executeStep(step);

      if (!result.success) {
        trajectory.status = 'failed';
        break;
      }
    }

    if (trajectory.status === 'running') {
      trajectory.status = 'completed';
    }
  } catch (error) {
    trajectory.status = 'error';
    console.error('Test execution error:', error);
  } finally {
    trajectory.endTime = Date.now();
    trajectory.totalDuration = trajectory.endTime - trajectory.startTime;

    // Save test result to Supabase
    try {
      await saveTestResult(config, trajectory);
    } catch (err) {
      console.error('Failed to save test result:', err);
    }
  }

  return trajectory;
}

// Evaluate test result 
export function evaluateResult(
  config: TestConfig,
  trajectory: TestTrajectory
): { score: number; passed: boolean; metrics: any } {
  const { expected_outcome, validation_rules } = config;
  let score = 0;
  let maxScore = 100;

  // Check if test completed
  if (trajectory.status === 'completed') {
    score += 40;
  }

  // Check duration
  if (expected_outcome.maxDuration && trajectory.totalDuration) {
    if (trajectory.totalDuration <= expected_outcome.maxDuration) {
      score += 30;
    }
  } else {
    score += 30; // No duration constraint
  }

  // Check tool calls
  const toolCalls = trajectory.actions.length;
  if (expected_outcome.minToolCalls && expected_outcome.maxToolCalls) {
    if (toolCalls >= expected_outcome.minToolCalls && toolCalls <= expected_outcome.maxToolCalls) {
      score += 30;
    }
  } else {
    score += 30; // No tool call constraint
  }

  // Apply validation rules
  validation_rules.forEach((rule) => {
    // Simplified validation - would be more complex in real implementation
    score += 0; // Placeholder
  });

  const passed = score >= 70; // 70% threshold for passing

  return {
    score,
    passed,
    metrics: {
      completedSteps: trajectory.actions.filter((a) => a.result === 'success').length,
      totalSteps: trajectory.actions.length,
      duration: trajectory.totalDuration,
      successRate: (trajectory.actions.filter((a) => a.result === 'success').length / trajectory.actions.length) * 100,
    },
  };
}

// Save test result to Supabase
async function saveTestResult(config: TestConfig, trajectory: TestTrajectory) {
  const evaluation = evaluateResult(config, trajectory);

  await logTestResult({
    test_id: config.id,
    test_name: config.name,
    category: config.category,
    status: trajectory.status === 'completed' ? 'success' : 'failure',
    duration_ms: trajectory.totalDuration || 0,
    tool_calls: trajectory.actions,
    workflow: config.expected_workflow,
    metrics: evaluation.metrics,
  });
}

// Get current trajectory
export function getCurrentTrajectory(): TestTrajectory | null {
  return currentTrajectory;
}

// Clear trajectory
export function clearTrajectory() {
  currentTrajectory = null;
}


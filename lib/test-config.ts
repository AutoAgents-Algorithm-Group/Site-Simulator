// Test Configuration Types 

export interface WorkflowStep {
  action: string;
  params: Record<string, any>;
  node_id?: string;
  label?: string;
  description?: string;
  loop_actions?: WorkflowStep[];
}

export interface ValidationRule {
  type: string;
  field: string;
  validator: string;
  value: any;
  description: string;
}

export interface ExpectedOutcome {
  success: boolean;
  minToolCalls?: number;
  maxToolCalls?: number;
  maxDuration?: number;
}

export interface TestConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  user_intent: string;
  test_page_url: string;
  expected_workflow: WorkflowStep[];
  expected_outcome: ExpectedOutcome;
  validation_rules: ValidationRule[];
  priority?: string;
  timeout?: number;
  tags?: string[];
}

// Test Configurations (10 showcase tests)
export const TEST_CONFIGS: TestConfig[] = [
  {
    id: 'showcase_01_basic_nav',
    name: 'Basic Navigation & Interaction',
    category: 'showcase',
    description: 'Tests basic navigation, typing, and clicking.',
    user_intent: 'Navigate to test page, fill search input, and click search button',
    test_page_url: '/tests/basic-nav',
    expected_workflow: [
      { action: 'navigate', params: { url: '/tests/basic-nav' } },
      { action: 'fill', params: { selector: "input[name='search']", value: 'Noma Showcase' } },
      { action: 'click', params: { selector: '#btn-search' } },
      { action: 'wait', params: { selector: '#results' } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'high',
    tags: ['basic', 'navigation'],
  },
  {
    id: 'showcase_02_reddit_loop',
    name: 'Reddit Mock Loop & Anti-Bot',
    category: 'showcase',
    description: 'Tests the loop component and anti-bot handling on a mock Reddit page with simulated rate limits.',
    user_intent: 'Loop through posts on the mock reddit page, open each post, leave comments, and respect rate limit.',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' }, node_id: 'nav-1', label: 'Navigate to Mock Reddit List' },
      { action: 'wait', params: { timeout: 1500 }, node_id: 'wait-load', label: 'Wait for Page Load' },
      {
        action: 'loop_elements',
        params: {
          selector: 'a[data-testid="post-title"]',
          maxIterations: 2,
          iteratorVariable: 'post',
          enableRateLimit: false,
        },
        node_id: 'loop-1',
        label: 'Loop Through Posts',
        loop_actions: [
          { action: 'click', params: { selector: 'a[data-testid="comments-button"]', waitForNavigation: true }, node_id: 'click-open-post', label: 'Open Post Detail Page' },
          { action: 'wait', params: { duration: 1000 }, node_id: 'wait-detail-load', label: 'Wait for Detail Page Load' },
          { action: 'click', params: { selector: 'div[data-testid="comment-input"]' }, node_id: 'click-input', label: 'Click Comment Input' },
          { action: 'fill', params: { selector: 'div[data-testid="comment-input"]', value: 'This is an automated test comment from Noma Extension!', simulateHuman: true }, node_id: 'fill-comment', label: 'Write Comment' },
          { action: 'wait', params: { duration: 500 }, node_id: 'wait-type', label: 'Wait After Typing' },
          { action: 'click', params: { selector: 'button[data-testid="submit-button"]' }, node_id: 'submit', label: 'Submit Comment' },
          { action: 'wait', params: { selector: '.status-success', timeout: 5000 }, node_id: 'wait-success', label: 'Wait for Success Message (Anti-Bot Check)' },
          { action: 'wait', params: { duration: 3500 }, node_id: 'wait-rate-limit', label: 'Wait for Rate Limit Cooling (Min 3s)' },
          { action: 'click', params: { selector: 'a[id="btn-back"]' }, node_id: 'back-to-list', label: 'Return to List Page' },
          { action: 'wait', params: { duration: 500 }, node_id: 'wait-list-load', label: 'Wait for List Page Load' },
        ],
      },
    ],
    expected_outcome: {
      success: true,
      minToolCalls: 15,
      maxToolCalls: 40,
      maxDuration: 120000,
    },
    validation_rules: [
      { type: 'custom', field: 'loop.iterations', validator: 'equals', value: 2, description: 'Loop executed 2 times' },
      { type: 'custom', field: 'comments_posted', validator: 'greaterThanOrEqual', value: 2, description: 'At least 2 comments posted' },
    ],
    priority: 'high',
    timeout: 150000,
    tags: ['showcase', 'loop', 'mock', 'reddit', 'anti-bot'],
  },
  {
    id: 'showcase_03_selector_stability',
    name: 'Selector Stability',
    category: 'showcase',
    description: 'Tests selector stability across different selector types.',
    user_intent: 'Test automation workflow with various selectors',
    test_page_url: '/tests/selector-test',
    expected_workflow: [
      { action: 'navigate', params: { url: '/tests/selector-test' } },
      { action: 'click', params: { selector: '.target-btn' }, description: 'Click using class' },
      { action: 'click', params: { selector: 'div.complex-selector button' }, description: 'Click using hierarchy' },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'medium',
    tags: ['selector', 'stability'],
  },
  {
    id: 'showcase_04_data_extraction',
    name: 'Data Extraction',
    category: 'showcase',
    description: 'Tests data extraction from page elements.',
    user_intent: 'Extract data from page elements',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' } },
      { action: 'extract_data', params: { selector: '.post-title', fields: ['innerText', 'href'] } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'medium',
    tags: ['data', 'extraction'],
  },
  {
    id: 'showcase_05_form_interaction',
    name: 'Form Interaction',
    category: 'showcase',
    description: 'Tests form filling and submission.',
    user_intent: 'Fill and submit a form',
    test_page_url: '/tests/form-test',
    expected_workflow: [
      { action: 'navigate', params: { url: '/tests/form-test' } },
      { action: 'fill', params: { selector: '#name', value: 'Test User' } },
      { action: 'fill', params: { selector: '#email', value: 'test@example.com' } },
      { action: 'click', params: { selector: '#submit-form' } },
      { action: 'wait', params: { selector: '.success-message', timeout: 3000 } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'medium',
    tags: ['form', 'input'],
  },
  {
    id: 'showcase_06_error_recovery',
    name: 'Error Recovery',
    category: 'showcase',
    description: 'Tests error handling and recovery mechanisms.',
    user_intent: 'Test error recovery in automation',
    test_page_url: '/tests/selector-test',
    expected_workflow: [
      { action: 'navigate', params: { url: '/tests/selector-test' } },
      { action: 'click', params: { selector: '#non-existent-element' }, description: 'Try to click non-existent element' },
      { action: 'wait', params: { duration: 1000 }, description: 'Wait after error' },
      { action: 'click', params: { selector: '.target-btn' }, description: 'Recover with valid click' },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'low',
    tags: ['error', 'recovery'],
  },
  {
    id: 'showcase_07_memory_usage',
    name: 'Memory Usage Test',
    category: 'showcase',
    description: 'Tests memory usage during extended operations.',
    user_intent: 'Monitor memory usage during test execution',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' } },
      { action: 'scroll', params: { direction: 'down', amount: 500 } },
      { action: 'wait', params: { duration: 1000 } },
      { action: 'scroll', params: { direction: 'down', amount: 500 } },
      { action: 'wait', params: { duration: 1000 } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'low',
    tags: ['performance', 'memory'],
  },
  {
    id: 'showcase_08_long_workflow',
    name: 'Long Workflow Test',
    category: 'showcase',
    description: 'Tests extended workflow with multiple steps.',
    user_intent: 'Execute a long sequence of actions',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' } },
      { action: 'wait', params: { duration: 500 } },
      { action: 'click', params: { selector: 'a[data-testid="post-title"]' } },
      { action: 'wait', params: { duration: 1000 } },
      { action: 'scroll', params: { direction: 'down', amount: 300 } },
      { action: 'wait', params: { duration: 500 } },
      { action: 'click', params: { selector: 'a[id="btn-back"]' } },
      { action: 'wait', params: { duration: 500 } },
    ],
    expected_outcome: { success: true, maxDuration: 10000 },
    validation_rules: [],
    priority: 'medium',
    tags: ['workflow', 'long'],
  },
  {
    id: 'showcase_09_concurrent_tabs',
    name: 'Concurrent Tabs Test',
    category: 'showcase',
    description: 'Tests handling of multiple tabs/windows.',
    user_intent: 'Test multi-tab operations',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' } },
      { action: 'click', params: { selector: 'a[data-testid="comments-button"]', openInNewTab: true } },
      { action: 'wait', params: { duration: 1000 } },
      { action: 'switch_tab', params: { tabIndex: 1 } },
      { action: 'wait', params: { duration: 500 } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'low',
    tags: ['tabs', 'concurrent'],
  },
  {
    id: 'showcase_10_ai_intent',
    name: 'AI Intent Understanding',
    category: 'showcase',
    description: 'Tests AI understanding of user intent.',
    user_intent: 'Find and comment on the most popular post about technology',
    test_page_url: '/reddit',
    expected_workflow: [
      { action: 'navigate', params: { url: '/reddit' } },
      { action: 'analyze', params: { task: 'find most popular post' } },
      { action: 'click', params: { selector: 'dynamic' } },
      { action: 'fill', params: { selector: 'div[data-testid="comment-input"]', value: 'AI-generated comment' } },
      { action: 'click', params: { selector: 'button[data-testid="submit-button"]' } },
    ],
    expected_outcome: { success: true },
    validation_rules: [],
    priority: 'high',
    tags: ['ai', 'intent'],
  },
];

export function getTestById(id: string): TestConfig | undefined {
  return TEST_CONFIGS.find((test) => test.id === id);
}

export function getTestsByCategory(category: string): TestConfig[] {
  return TEST_CONFIGS.filter((test) => test.category === category);
}

export function getTestsByTag(tag: string): TestConfig[] {
  return TEST_CONFIGS.filter((test) => test.tags?.includes(tag));
}


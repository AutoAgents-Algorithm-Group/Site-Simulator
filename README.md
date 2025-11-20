# Reddit Evaluation Tool - Next.js

A modern Reddit auto-comment simulation and testing tool built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. 

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Deployment**: Vercel
- **State Management**: Zustand

## ✨ Features

- 🎯 **5 Interactive Test Demos**: Ready-to-run test scenarios
- 🤖 **Reddit Mock Environment**: Complete Reddit simulation with rate limiting
- 📊 **Real-time Dashboards**: Test results and activity monitoring
- 🔍 **Trajectory Recording**: Complete action logging for analysis
- 🚀 **Client-side Execution**: Tests run entirely in the browser
- 💾 **Supabase Logging**: All tests and activities logged to database
- 📱 **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account ([vercel.com](https://vercel.com)) (for deployment)

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

Create a new Supabase project and run the migration:

```sql
-- Run the SQL from supabase/migrations/001_initial_schema.sql
-- in the Supabase SQL Editor
```

3. **Configure environment variables:**

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📦 Project Structure

```
reddit-eval-nextjs/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage with test links
│   ├── reddit/                   # Reddit mock pages
│   │   ├── page.tsx              # List view
│   │   ├── [postId]/page.tsx     # Detail view
│   │   └── dashboard/page.tsx    # Activity dashboard
│   ├── tests/                    # Test execution pages
│   │   ├── basic-nav/
│   │   ├── reddit-loop/
│   │   ├── form-test/
│   │   ├── selector-test/
│   │   └── data-extraction/
│   └── dashboard/                # Test results dashboard
│       ├── page.tsx
│       └── [resultId]/page.tsx
├── components/                   # React components
│   ├── TestCard.tsx
│   ├── TestRunner.tsx
│   └── RedditStatsPanel.tsx
├── lib/                          # Core libraries
│   ├── supabase.ts               # Database client
│   ├── test-config.ts            # 10 test configurations
│   ├── execution-engine.ts       # Test execution logic
│   └── evaluation.ts             # Result scoring
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── public/
```

## 🧪 Available Tests

1. **Basic Navigation** - Simple navigation and form interactions
2. **Reddit Comment Loop** - Automated commenting with rate limiting
3. **Form Interaction** - Complex form filling and validation
4. **Selector Stability** - Testing selector reliability
5. **Data Extraction** - Extracting data from pages

## 📊 Database Schema

### test_results

Stores test execution results:

- `id`: UUID primary key
- `test_id`: Test identifier
- `test_name`: Human-readable test name
- `category`: Test category
- `status`: success | failure | error
- `duration_ms`: Execution duration
- `tool_calls`: JSONB of all actions
- `workflow`: JSONB of expected workflow
- `metrics`: JSONB of evaluation metrics
- `created_at`: Timestamp

### reddit_activity_logs

Stores Reddit simulation activity:

- `id`: UUID primary key
- `post_id`: Reddit post ID
- `action_type`: view | comment | submit | rate_limited
- `comment_text`: Comment content (nullable)
- `status`: success | rate_limited | error
- `metadata`: JSONB additional data
- `created_at`: Timestamp

## 🌐 Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd reddit-eval-nextjs
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Import repository in Vercel dashboard
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically

## 🔧 Configuration

### Test Configurations

Edit `lib/test-config.ts` to add or modify test cases:

```typescript
const newTest: TestConfig = {
  id: 'my_test_01',
  name: 'My Custom Test',
  category: 'custom',
  description: 'Description of what this test does',
  user_intent: 'User intent in natural language',
  test_page_url: '/my-test-page',
  expected_workflow: [
    { action: 'navigate', params: { url: '/page' } },
    { action: 'click', params: { selector: '#button' } },
  ],
  expected_outcome: { success: true },
  validation_rules: [],
  tags: ['custom', 'test'],
};
```

### Supabase Row Level Security (RLS)

The initial schema includes basic RLS policies. For production, update these in the Supabase dashboard to restrict access as needed.

## 📚 Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: PostgreSQL database with real-time features
- **Vercel**: Deployment and hosting platform
- **date-fns**: Date formatting utilities

## 🎯 Key Features Explained

### Architecture

- **Configuration-driven tests**: Define tests in JSON-like configs
- **Trajectory recording**: Log every action for analysis
- **Evaluation harness**: Automated scoring of test results
- **Environment abstraction**: Reddit mock as test environment

### Rate Limiting Simulation

The Reddit mock implements realistic rate limiting:

- 3-second cooldown between comments
- Visual feedback for rate limit status
- Logged to database for analysis

### Real-time Updates

Supabase provides real-time subscriptions for:

- Test result updates
- Reddit activity streaming
- Live dashboard updates

## 🐛 Troubleshooting

### "Cannot connect to Supabase"

- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies allow public access (for development)

### "Tests not appearing in dashboard"

- Tests are logged asynchronously
- Refresh the dashboard page
- Check browser console for errors

### Build errors on Vercel

- Ensure all environment variables are set in Vercel dashboard
- Check build logs for specific errors
- Verify `package.json` dependencies are correct

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using Next.js and Supabase**

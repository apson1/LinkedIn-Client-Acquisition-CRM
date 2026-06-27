# Implementation Plan: LinkedIn Client-Acquisition CRM

## Build Strategy

Build the product as a Chrome Extension with a side panel and a companion Next.js dashboard. Use Supabase for auth, database, row-level security, and realtime sync.

The MVP should not inject UI into LinkedIn Messaging. The extension should work as a user-controlled companion tool.

## Architecture

### Apps

1. Chrome Extension
   - Built with Plasmo, React, TypeScript, and Tailwind CSS
   - Provides popup and side panel
   - Authenticates against Supabase
   - Reads and writes user-owned CRM data through Supabase APIs

2. Web Dashboard
   - Built with Next.js, React, TypeScript, and Tailwind CSS
   - Hosted on Vercel
   - Uses Supabase Auth and Supabase client
   - Provides pipeline, list, details, reminders, analytics, settings, and export

3. Supabase Backend
   - PostgreSQL database
   - Supabase Auth
   - Row-level security policies
   - Realtime subscriptions for prospect and status changes

4. Stripe Billing
   - Add after core CRM works
   - Use hosted checkout
   - Store subscription status in user profile table

## Repository Structure

Use a monorepo.

```text
linkedin-client-crm/
  apps/
    extension/
      src/
        components/
        popup/
        sidepanel/
        lib/
        styles/
      package.json
      plasmo.config.ts
    web/
      app/
      components/
      lib/
      styles/
      package.json
      next.config.js
  packages/
    shared/
      src/
        types.ts
        constants.ts
        validators.ts
  supabase/
    migrations/
    seed.sql
  docs/
    context.md
    implementation.md
    skill.md
  README.md
  package.json
```

## Environment Variables

### Web

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

### Extension

```text
PLASMO_PUBLIC_SUPABASE_URL=
PLASMO_PUBLIC_SUPABASE_ANON_KEY=
PLASMO_PUBLIC_WEB_APP_URL=
```

Never expose the Supabase service role key in the extension or browser client.

## Database Schema

Create these tables in Supabase.

### profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free',
  stripe_customer_id text,
  subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### statuses

```sql
create table public.statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text not null default '#64748b',
  sort_order integer not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### prospects

```sql
create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status_id uuid references public.statuses(id) on delete set null,
  full_name text not null,
  linkedin_profile_url text,
  linkedin_conversation_url text,
  company text,
  job_title text,
  priority text not null default 'medium',
  estimated_value numeric(12, 2),
  source text not null default 'linkedin',
  notes text,
  next_follow_up_date timestamptz,
  last_interaction_date timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### activities

```sql
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  type text not null,
  description text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

### reminders

```sql
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  due_date timestamptz not null,
  reminder_text text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### message_templates

```sql
create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  body text not null,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Row-Level Security

Enable RLS on every public table.

```sql
alter table public.profiles enable row level security;
alter table public.statuses enable row level security;
alter table public.prospects enable row level security;
alter table public.activities enable row level security;
alter table public.reminders enable row level security;
alter table public.message_templates enable row level security;
```

Basic policies:

```sql
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can manage own statuses"
on public.statuses for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own prospects"
on public.prospects for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own activities"
on public.activities for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own reminders"
on public.reminders for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own templates"
on public.message_templates for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## Default Status Seeding

After signup, create default statuses for the user:

1. New Lead
2. Contacted
3. Interested
4. Follow-up
5. Discovery Booked
6. Proposal Sent
7. Negotiating
8. Closed Won
9. Closed Lost
10. Nurture

Implement via a database trigger, server action, or post-signup API call.

## Shared TypeScript Types

Create shared types in `packages/shared/src/types.ts`.

```ts
export type Plan = 'free' | 'pro' | 'team'

export type Priority = 'low' | 'medium' | 'high'

export type Prospect = {
  id: string
  user_id: string
  status_id: string | null
  full_name: string
  linkedin_profile_url: string | null
  linkedin_conversation_url: string | null
  company: string | null
  job_title: string | null
  priority: Priority
  estimated_value: number | null
  source: string
  notes: string | null
  next_follow_up_date: string | null
  last_interaction_date: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

export type Status = {
  id: string
  user_id: string
  name: string
  color: string
  sort_order: number
  is_default: boolean
  created_at: string
  updated_at: string
}
```

## Chrome Extension Requirements

### Popup

The popup should show:

- Current auth status
- Sign in button if logged out
- Add prospect button
- Quick links to dashboard and side panel
- Count of overdue reminders

### Side Panel

The side panel should show:

- Search input
- Add prospect form
- Quick prospect list
- Status selector
- Notes field
- Reminder field
- Message templates
- Copy template button
- Open dashboard button

### Extension Permissions

Keep permissions minimal.

Recommended initial permissions:

```json
{
  "permissions": ["sidePanel", "storage", "notifications"],
  "host_permissions": ["https://www.linkedin.com/*"]
}
```

Use host permission only if needed to detect that the user is on LinkedIn or to support a user-triggered page URL capture feature. Do not use it to scrape or parse LinkedIn pages.

## Dashboard Pages

### `/login`

- Email/password login
- OAuth can be added later

### `/app`

- Main dashboard overview
- Due today reminders
- Overdue reminders
- Pipeline summary

### `/app/pipeline`

- Kanban board
- Drag and drop prospects between statuses
- Update status in database
- Create activity log entry when status changes

### `/app/prospects`

- Table view
- Search
- Filters
- Sort by follow-up date, created date, value, priority

### `/app/prospects/[id]`

- Prospect detail
- Notes
- Activity timeline
- Reminders
- Status updates
- Profile and conversation links

### `/app/reminders`

- Due today
- Overdue
- Upcoming
- Completed

### `/app/templates`

- Create templates
- Edit templates
- Delete templates
- Copy template text

### `/app/analytics`

MVP analytics:

- Prospects by stage
- Overdue follow-ups
- Closed Won count
- Closed Lost count
- Estimated pipeline value
- Average days in pipeline

### `/app/settings`

- Profile
- Status customization
- Export data
- Delete account placeholder

## Core Functions

### Create Prospect

Input:

- full_name
- linkedin_profile_url
- linkedin_conversation_url
- company
- job_title
- status_id
- priority
- estimated_value
- notes
- next_follow_up_date

Behavior:

- Insert prospect
- Create activity: `prospect_created`
- Create reminder if next_follow_up_date exists

### Update Status

Input:

- prospect_id
- new_status_id

Behavior:

- Update prospect.status_id
- Update prospect.updated_at
- Create activity: `status_changed`
- If status name is Closed Won or Closed Lost, set closed_at if not set

### Complete Reminder

Input:

- reminder_id

Behavior:

- Set completed to true
- Set completed_at to now
- Create activity: `reminder_completed`

### Export CSV

Export user prospects with:

- full_name
- company
- job_title
- status
- priority
- estimated_value
- linkedin_profile_url
- next_follow_up_date
- last_interaction_date
- created_at

## Plan Limits

Initial limits:

Free:

- 50 prospects
- 10 templates
- Basic reminders

Pro:

- Unlimited prospects
- Unlimited templates
- CSV export
- Analytics

Team:

- Later release

Enforce limits server-side where possible. The extension and dashboard can show upgrade prompts, but backend checks should protect the limit.

## Testing Plan

### Unit Tests

Test:

- Validation functions
- Date helpers
- Plan limit helpers
- Status ordering helpers

### Integration Tests

Test:

- Authenticated user can create prospect
- Authenticated user cannot access another user prospect
- Status update creates activity
- Reminder completion creates activity
- CSV export only includes current user data

### Manual QA

Test:

- Install extension locally
- Log in from extension
- Add prospect from side panel
- Confirm prospect appears in dashboard
- Update status in dashboard
- Confirm extension reflects change
- Create reminder
- Confirm reminder appears as due or upcoming
- Export CSV
- Log out

## Delivery Timeline

### Week 1

- Set up monorepo
- Set up Supabase project
- Create database schema
- Add RLS policies
- Build shared TypeScript types
- Set up Next.js app
- Set up Plasmo extension

### Week 2

- Implement Supabase Auth
- Create profile on signup
- Seed default statuses
- Build prospect CRUD API/client functions
- Build add prospect form in dashboard

### Week 3

- Build extension popup
- Build extension side panel
- Add prospect creation from side panel
- Add status update from side panel
- Add notes and reminders

### Week 4

- Build dashboard pipeline
- Add drag and drop
- Build prospect detail page
- Build activity timeline

### Week 5

- Build reminders page
- Build template manager
- Add copy-to-clipboard templates
- Add search and filters

### Week 6

- Add analytics
- Add CSV export
- Add plan limit checks
- Add Stripe placeholder or integration

### Week 7

- QA and bug fixes
- Improve onboarding
- Improve empty states
- Add privacy page and terms page

### Week 8

- Prepare beta release
- Package Chrome Extension
- Submit to Chrome Web Store if ready
- Deploy dashboard to Vercel
- Invite beta users

## Acceptance Criteria

The MVP is ready when:

- A new user can sign up
- Default statuses are created
- User can add a prospect in the dashboard
- User can add a prospect in the extension side panel
- User can assign and update statuses
- User can create notes
- User can set reminders
- User can view prospects in a Kanban pipeline
- User can search and filter prospects
- User can export CSV
- User data is protected by RLS
- Extension does not scrape LinkedIn
- Extension does not inject UI into LinkedIn pages
- Extension does not automate LinkedIn activity

## Future Phase 2

Add:

- Google Calendar reminders
- Gmail follow-up support
- Notion export
- HubSpot sync
- Zapier webhooks
- AI-generated next-action suggestions based only on user-entered notes
- Team workspaces
- Shared pipelines
- Role-based permissions

## Future Risk-Reviewed Experiments

Only after validation, consider scoped experiments:

- User-triggered page URL capture
- User-triggered profile metadata capture with explicit confirmation
- Side panel context detection

Avoid building the company around features that depend on modifying LinkedIn pages.

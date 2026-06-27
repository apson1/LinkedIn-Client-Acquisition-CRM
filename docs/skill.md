# Skill: Build LinkedIn Client-Acquisition CRM

## Purpose

Use this skill when working on the LinkedIn Client-Acquisition CRM project. The goal is to build a compliance-conscious Chrome Extension and web dashboard that helps users manage LinkedIn-sourced prospects with visual statuses, notes, reminders, and a sales pipeline.

## Operating Principles

1. Build the safer MVP first.
2. Do not scrape LinkedIn.
3. Do not automate LinkedIn actions.
4. Do not inject UI into LinkedIn pages for the MVP.
5. Keep user data separated by user_id.
6. Use Supabase Auth and row-level security.
7. Keep extension permissions minimal.
8. Favor simple, fast workflows over complex CRM features.
9. Optimize for freelancers and small outbound teams.
10. Make every feature support follow-up clarity and pipeline movement.

## Preferred Stack

- TypeScript
- React
- Plasmo for Chrome Extension
- Next.js for web dashboard
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime
- Stripe for payments
- Vercel for web deployment

## Project Context

The product is a lightweight CRM for users who sell through LinkedIn.

The user should be able to:

- Add a prospect manually
- Save LinkedIn profile and conversation links
- Assign a visual status
- Add notes
- Set follow-up reminders
- View a pipeline
- Move prospects across stages
- Track overdue follow-ups
- Export data

The MVP should provide a Chrome Extension side panel and a web dashboard. It should not place UI directly inside LinkedIn Messaging.

## Default Product Stages

Use these default stages unless asked to change them:

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

## Data Model

Use these core entities:

- profiles
- statuses
- prospects
- activities
- reminders
- message_templates

## Required Security Rules

Every user-owned table must include `user_id`.

Every user-owned table must use row-level security.

Policies must ensure:

- Users can only read their own records.
- Users can only create records assigned to their own user id.
- Users can only update their own records.
- Users can only delete their own records.

Never expose service role keys in client apps.

## Extension Rules

The extension may:

- Show a popup
- Show a side panel
- Store temporary local state
- Sync to Supabase
- Let the user manually add data
- Let the user copy templates to clipboard
- Let the user open saved LinkedIn links
- Show browser notifications for reminders

The extension must not:

- Scrape LinkedIn pages
- Parse LinkedIn messages automatically
- Send LinkedIn messages
- Send connection requests
- Inject badges into LinkedIn Messaging
- Modify LinkedIn page layout
- Store LinkedIn credentials
- Store LinkedIn cookies
- Use hidden background collection

## Coding Standards

- Use TypeScript everywhere.
- Use small components.
- Keep data access functions in a separate `lib` layer.
- Reuse shared types from `packages/shared`.
- Validate forms before writing to Supabase.
- Show loading, empty, success, and error states.
- Use accessible labels on form fields and buttons.
- Avoid complex state management unless needed.
- Prefer server-side checks for plan limits.

## UI Standards

Use a clean, professional SaaS style.

Recommended design choices:

- Tailwind CSS
- Rounded cards
- Clear status colors
- Simple icons
- White or neutral background
- Strong visual hierarchy
- Fast add-prospect flow
- Clear primary action button
- Compact side panel layout

## Dashboard UX Requirements

The dashboard should include:

- Dashboard overview
- Kanban pipeline
- Prospect list
- Prospect detail page
- Reminders page
- Templates page
- Analytics page
- Settings page

## Extension UX Requirements

The extension should include:

- Login state
- Add prospect flow
- Recent prospects
- Search
- Status selector
- Notes field
- Follow-up date field
- Copy template button
- Open dashboard button

## Common Tasks

### Create a New Feature

When creating a feature:

1. Identify the user problem.
2. Add or update shared types.
3. Add database fields or migrations if needed.
4. Add RLS policies if a new table is created.
5. Build data access functions.
6. Build UI components.
7. Add loading and error states.
8. Add basic tests or test steps.
9. Update documentation.

### Add a Database Table

When adding a table:

1. Include `id uuid primary key default gen_random_uuid()`.
2. Include `user_id uuid not null references public.profiles(id) on delete cascade` for user-owned records.
3. Include `created_at timestamptz not null default now()`.
4. Include `updated_at timestamptz not null default now()` when records can change.
5. Enable RLS.
6. Add owner-only policies.
7. Update shared TypeScript types.

### Add a Dashboard Page

When adding a page:

1. Protect it behind authentication.
2. Fetch only current user data.
3. Add empty state.
4. Add loading state.
5. Add error state.
6. Keep primary action visible.
7. Use shared components when possible.

### Add an Extension Feature

When adding an extension feature:

1. Check if the feature can work without LinkedIn page access.
2. Avoid content scripts unless absolutely necessary.
3. Avoid host permissions unless required.
4. Do not collect data in the background.
5. Make the user initiate every data capture action.
6. Sync only user-entered or user-confirmed data.

## Suggested Prompts for Antigravity

Use these prompts to guide implementation.

### Scaffold the Monorepo

```text
Create a TypeScript monorepo for a Chrome Extension and Next.js dashboard. Use apps/extension for a Plasmo React extension, apps/web for a Next.js app, packages/shared for shared types, and supabase/migrations for SQL migrations. Add basic package scripts for dev, build, lint, and typecheck.
```

### Create Supabase Schema

```text
Create Supabase SQL migrations for profiles, statuses, prospects, activities, reminders, and message_templates. Enable row-level security on every table and add policies so users can only manage their own records. Add default timestamp fields and foreign keys.
```

### Build Auth

```text
Implement Supabase Auth in the Next.js dashboard and the Plasmo extension. Add login, signup, logout, and protected routes. Ensure auth state works in the extension popup and side panel.
```

### Build Prospect CRUD

```text
Build prospect create, read, update, and delete functions using Supabase. Use shared TypeScript types. Add validation. Create a dashboard prospect list and an extension side-panel add-prospect form.
```

### Build Pipeline

```text
Create a Kanban pipeline page in the Next.js dashboard. Group prospects by status. Allow drag-and-drop status updates. When a prospect changes status, update the database and create an activity log record.
```

### Build Reminders

```text
Create reminder functionality for prospects. Add due today, overdue, upcoming, and completed views. Allow users to complete reminders. Create activity log entries when reminders are completed.
```

### Build Templates

```text
Create message template CRUD in the dashboard and extension. Add a copy-to-clipboard button. Do not automate sending messages.
```

### Build CSV Export

```text
Add CSV export for the current user's prospects. Export name, company, title, status, priority, estimated value, LinkedIn URL, next follow-up date, last interaction date, and created date. Ensure users can only export their own data.
```

## Definition of Done

A task is done when:

- It compiles without TypeScript errors.
- It passes lint checks.
- It handles loading, success, and error states.
- Data is protected by RLS.
- It does not introduce LinkedIn scraping, automation, or UI injection.
- It works in both local development and deployed environments when applicable.
- Documentation is updated if the task changes architecture or behavior.

## Red Flags

Stop and reconsider if proposed code:

- Uses LinkedIn cookies
- Reads LinkedIn DOM content automatically
- Parses LinkedIn messages
- Injects UI into LinkedIn Messaging
- Sends messages automatically
- Adds connection automation
- Adds bulk LinkedIn activity
- Bypasses user confirmation
- Adds broad extension permissions without a clear need
- Uses the Supabase service role key in client code

## Best Next Step

Start by scaffolding the monorepo, creating the Supabase schema, adding RLS policies, and building auth. Then build prospect CRUD in the dashboard and extension side panel.

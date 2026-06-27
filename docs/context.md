# Context: LinkedIn Client-Acquisition CRM

## Product Summary

Build a lightweight Chrome Extension and companion web dashboard that helps freelancers, solopreneurs, consultants, recruiters, and outbound sales teams organize LinkedIn-sourced sales conversations.

The product provides visual pipeline stages, status tags, notes, reminders, follow-up tracking, and basic analytics for prospects the user manages through LinkedIn.

## Core Positioning

Turn LinkedIn conversations into a clear client pipeline.

Users should know:

- Who is a new lead
- Who replied
- Who needs follow-up
- Who received a proposal
- Who is negotiating
- Who became a client
- Which conversations are stuck
- Which follow-ups are overdue

## Important Product Constraint

The MVP must avoid risky LinkedIn behavior.

Do not build features that:

- Scrape LinkedIn
- Automate LinkedIn activity
- Auto-send LinkedIn messages
- Auto-connect with LinkedIn users
- Read or copy LinkedIn message content without explicit user action
- Store LinkedIn passwords, cookies, or session tokens
- Use hidden background collection from LinkedIn
- Inject visual elements directly into LinkedIn Messaging for the MVP
- Modify LinkedIn page appearance for the MVP

The safer MVP should work through:

- Chrome Extension popup
- Chrome Extension side panel
- Companion web dashboard
- User-entered or user-confirmed prospect data
- Manual copy-to-clipboard workflows

## Why This Constraint Matters

LinkedIn states that third-party tools, including browser plug-ins and extensions, are not permitted when they scrape, modify the appearance of, or automate activity on LinkedIn. The MVP should reduce platform dependency and user account risk by avoiding LinkedIn page modification, scraping, and automation.

## Target Users

Primary users:

- Freelancers selling services through LinkedIn
- Solopreneurs managing warm leads
- B2B consultants
- Small agencies
- Recruiters
- Founder-led sales teams
- Solo SDRs and BDRs

Avoid enterprise sales teams in the MVP because they often require deeper CRM integrations, admin controls, security reviews, and procurement.

## Core Problem

LinkedIn Messaging becomes hard to manage when users have many active sales conversations. Users forget next steps, lose track of warm prospects, miss follow-ups, and lack a simple pipeline view.

## Core User Outcome

A user can open the extension while using LinkedIn, add or update a prospect in under 10 seconds, assign a visual status, set a follow-up reminder, and see the same data in a dashboard pipeline.

## MVP Scope

### Chrome Extension

Build a Chrome Extension that provides:

- Popup interface
- Side panel interface
- Add prospect form
- Status tag selector
- Custom status creation
- Color picker for statuses
- Notes field
- Next follow-up date
- Priority field
- Estimated value field
- Copy message template to clipboard
- Open saved LinkedIn profile URL
- Sync with backend

### Web Dashboard

Build a web dashboard that provides:

- Authentication
- Prospect list
- Kanban-style pipeline
- Prospect detail page
- Search
- Filters
- Reminder page
- Basic analytics
- CSV export
- Settings
- Billing page placeholder

### Backend

Build a backend using Supabase for:

- Authentication
- PostgreSQL database
- Row-level security
- Realtime sync
- Storage of user data

### Billing

Add Stripe in final MVP stage or as a placeholder if timeline is tight.

Planned pricing:

- Free: limited prospects and basic reminders
- Pro: unlimited prospects, templates, export, analytics
- Team: shared pipeline and team collaboration in a later release

## Out of Scope for MVP

Do not build these in the first version:

- Automated LinkedIn messages
- Automated LinkedIn connection requests
- LinkedIn message scraping
- LinkedIn profile scraping
- Inline badges inside LinkedIn Messaging
- Bulk LinkedIn actions
- AI status detection from LinkedIn messages
- Team workspaces
- HubSpot sync
- Salesforce sync
- Mobile app

## Product Stages

Default stages:

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

Users should be able to rename, reorder, recolor, and delete custom stages.

## Main User Flow

1. User signs up.
2. User installs Chrome Extension.
3. User opens LinkedIn.
4. User opens extension side panel.
5. User manually creates a prospect.
6. User adds LinkedIn profile URL.
7. User assigns a status.
8. User adds notes.
9. User sets next follow-up date.
10. User saves the record.
11. User opens dashboard.
12. User sees the prospect on a Kanban pipeline.
13. User drags the prospect to a new stage as the conversation moves forward.
14. User receives reminders for overdue or upcoming follow-ups.

## Success Metrics

Track these initial metrics:

- Number of prospects created
- Number of active users
- Number of reminders created
- Number of reminders completed
- Number of prospects moved between stages
- Number of prospects marked Closed Won
- Time from New Lead to Closed Won
- Number of overdue follow-ups
- Trial-to-paid conversion rate, when billing is enabled

## UX Principles

- Make prospect capture fast.
- Keep screens simple.
- Reduce data entry.
- Use clear visual status colors.
- Do not hide important actions in menus.
- Prioritize follow-up reminders and next actions.
- Keep the dashboard useful even if the extension is not open.

## Privacy Principles

- Collect the minimum data needed.
- Be transparent about permissions.
- Do not collect LinkedIn credentials.
- Do not collect browser cookies.
- Do not collect message content automatically.
- Let users delete their data.
- Use row-level security for every user-owned record.

## Recommended Tech Stack

- Extension: TypeScript, React, Plasmo
- Dashboard: Next.js, React, Tailwind CSS
- Backend: Supabase
- Database: PostgreSQL through Supabase
- Auth: Supabase Auth
- Realtime: Supabase Realtime
- Payments: Stripe
- Hosting: Vercel
- Extension distribution: Chrome Web Store

## Developer Notes

Build the MVP as a compliance-conscious side-panel CRM. Do not start by injecting UI into LinkedIn pages. If demand is validated, a later risk-reviewed version can explore deeper workflow enhancements.

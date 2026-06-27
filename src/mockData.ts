import { User, StatusStage, Prospect, Activity, Reminder, MessageTemplate } from './types';

export const mockUser: User = {
  id: 'usr_1',
  name: 'Alex Mercer',
  email: 'alex@mercerconsulting.com',
  plan_type: 'Pro',
  created_at: '2026-01-15T09:00:00Z',
};

export const defaultStatuses: StatusStage[] = [
  { id: 'st_1', user_id: 'usr_1', name: 'New Lead', color: 'bg-slate-100 text-slate-800 border-slate-300', sort_order: 1 },
  { id: 'st_2', user_id: 'usr_1', name: 'Outreach Sent', color: 'bg-blue-50 text-blue-800 border-blue-200', sort_order: 2 },
  { id: 'st_3', user_id: 'usr_1', name: 'In Discussion', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', sort_order: 3 },
  { id: 'st_4', user_id: 'usr_1', name: 'Meeting Booked', color: 'bg-purple-50 text-purple-800 border-purple-200', sort_order: 4 },
  { id: 'st_5', user_id: 'usr_1', name: 'Proposal Sent', color: 'bg-amber-50 text-amber-800 border-amber-200', sort_order: 5 },
  { id: 'st_6', user_id: 'usr_1', name: 'Closed - Won', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', sort_order: 6 },
  { id: 'st_7', user_id: 'usr_1', name: 'Nurture / Later', color: 'bg-rose-50 text-rose-800 border-rose-200', sort_order: 7 },
];

export const mockProspects: Prospect[] = [
  {
    id: 'pr_1',
    user_id: 'usr_1',
    full_name: 'Sarah Jenkins',
    linkedin_profile_url: 'https://www.linkedin.com/in/sarah-jenkins-marketing-expert/',
    company: 'TechFlow Solutions',
    job_title: 'VP of Growth & Marketing',
    status: 'In Discussion',
    priority: 'High',
    estimated_value: 4500,
    source: 'LinkedIn Search',
    notes: 'Responded to our automation case study. Looking to redesign their landing page and optimize conversion funnel. Wants to review budget before booking next sync.',
    next_follow_up_date: '2026-06-25', // Overdue (Today is 2026-06-26)
    created_at: '2026-06-10T10:30:00Z',
    updated_at: '2026-06-25T14:20:00Z',
  },
  {
    id: 'pr_2',
    user_id: 'usr_1',
    full_name: 'Alex Rivera',
    linkedin_profile_url: 'https://www.linkedin.com/in/alex-rivera-ceo/',
    company: 'Peak Performance Group',
    job_title: 'Chief Executive Officer',
    status: 'New Lead',
    priority: 'Medium',
    estimated_value: 8000,
    source: 'Mutual Connection',
    notes: 'Connected via Jordan Lee. Alex posted about hiring freelance React consultants. Need to send a warm personalized connection request introducing our previous enterprise work.',
    next_follow_up_date: '2026-06-27', // Tomorrow
    created_at: '2026-06-24T08:15:00Z',
    updated_at: '2026-06-24T08:15:00Z',
  },
  {
    id: 'pr_3',
    user_id: 'usr_1',
    full_name: 'David Chen',
    linkedin_profile_url: 'https://www.linkedin.com/in/david-chen-cto/',
    company: 'CloudNine Technologies',
    job_title: 'Co-Founder & CTO',
    status: 'Meeting Booked',
    priority: 'High',
    estimated_value: 12000,
    source: 'LinkedIn Post Comment',
    notes: 'Commented on our post about Node.js performance tuning. We messaged on LinkedIn and booked a discovery call for Tuesday, July 2nd at 11:00 AM EST.',
    next_follow_up_date: '2026-07-02', // Next week
    created_at: '2026-06-15T11:00:00Z',
    updated_at: '2026-06-26T16:45:00Z',
  },
  {
    id: 'pr_4',
    user_id: 'usr_1',
    full_name: 'Emma Watson',
    linkedin_profile_url: 'https://www.linkedin.com/in/emma-watson-talent-leader/',
    company: 'Apex Recruiters',
    job_title: 'Head of Talent Acquisition',
    status: 'Proposal Sent',
    priority: 'High',
    estimated_value: 6500,
    source: 'Outbound Campaign',
    notes: 'Sent a custom proposal for a 3-month consulting retainer to build their internal candidate sourcing dashboard. Emma said she would review with the CFO by Friday.',
    next_follow_up_date: '2026-06-26', // Today!
    created_at: '2026-06-05T09:20:00Z',
    updated_at: '2026-06-22T10:10:00Z',
  },
  {
    id: 'pr_5',
    user_id: 'usr_1',
    full_name: 'Marcus Aurelius',
    linkedin_profile_url: 'https://www.linkedin.com/in/marcus-aurelius-ops/',
    company: 'Rome Digital Studio',
    job_title: 'Operations Director',
    status: 'Closed - Won',
    priority: 'Medium',
    estimated_value: 15000,
    source: 'Inbound Inquiries',
    notes: 'Signed contract for UX Auditing + React components bundle. First invoice of $7,500 paid. Onboarding kickoff call completed. Project underway.',
    next_follow_up_date: '2026-07-15', // Future follow up
    created_at: '2026-05-20T14:00:00Z',
    updated_at: '2026-06-20T18:30:00Z',
  },
  {
    id: 'pr_6',
    user_id: 'usr_1',
    full_name: 'Sophia Lindqvist',
    linkedin_profile_url: 'https://www.linkedin.com/in/sophia-lindqvist-founder/',
    company: 'Vanguard SaaS',
    job_title: 'Founder & CEO',
    status: 'Outreach Sent',
    priority: 'Low',
    estimated_value: 3000,
    source: 'LinkedIn Search',
    notes: 'Sent connection request with template "SaaS Founders Outreach". She accepted yesterday but hasn\'t replied to the initial follow-up yet. Wait 3 more days before bumping.',
    next_follow_up_date: '2026-06-29', // In 3 days
    created_at: '2026-06-25T15:00:00Z',
    updated_at: '2026-06-26T09:00:00Z',
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    prospect_id: 'pr_1',
    user_id: 'usr_1',
    type: 'Cold Outreach',
    description: 'Sent connection request with a short note expressing admiration for TechFlow\'s recent Series A announcement.',
    created_at: '2026-06-10T10:35:00Z',
  },
  {
    id: 'act_2',
    prospect_id: 'pr_1',
    user_id: 'usr_1',
    type: 'Conversation',
    description: 'Sarah accepted the request and thanked us. Messaged her sharing our conversion optimization teardown.',
    created_at: '2026-06-12T14:10:00Z',
  },
  {
    id: 'act_3',
    prospect_id: 'pr_1',
    user_id: 'usr_1',
    type: 'Conversation',
    description: 'Sarah replied: "This is super relevant. Our landing page bounce rate has been high lately. What are your retainer rates?" We sent over our services overview.',
    created_at: '2026-06-15T09:30:00Z',
  },
  {
    id: 'act_4',
    prospect_id: 'pr_3',
    user_id: 'usr_1',
    type: 'Cold Outreach',
    description: 'Noticed David\'s post regarding high memory usage in Node.js clusters. Commented with three performance tuning checklist tips.',
    created_at: '2026-06-15T11:05:00Z',
  },
  {
    id: 'act_5',
    prospect_id: 'pr_3',
    user_id: 'usr_1',
    type: 'Conversation',
    description: 'David replied to the comment: "This was exactly what we needed. Solved our leak! Let\'s connect." Sent connection request, which was immediately accepted.',
    created_at: '2026-06-16T08:30:00Z',
  },
  {
    id: 'act_6',
    prospect_id: 'pr_3',
    user_id: 'usr_1',
    type: 'Call',
    description: 'Scheduled discovery call. Aligned on 45-minute sync next week to analyze their engineering bottlenecks.',
    created_at: '2026-06-26T16:45:00Z',
  },
  {
    id: 'act_7',
    prospect_id: 'pr_4',
    user_id: 'usr_1',
    type: 'Proposal Sent',
    description: 'Delivered the customized candidate sourcing dashboard consulting proposal via PDF attachment link. Set pricing at $6,500 total.',
    created_at: '2026-06-22T10:10:00Z',
  }
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem_1',
    user_id: 'usr_1',
    prospect_id: 'pr_1',
    due_date: '2026-06-25',
    reminder_text: 'Follow up with Sarah regarding the landing page conversion proposal and services guide.',
    completed: false,
    created_at: '2026-06-22T14:20:00Z',
  },
  {
    id: 'rem_2',
    user_id: 'usr_1',
    prospect_id: 'pr_4',
    due_date: '2026-06-26',
    reminder_text: 'Check in with Emma Watson on the contract signature progress before the weekend.',
    completed: false,
    created_at: '2026-06-22T10:15:00Z',
  },
  {
    id: 'rem_3',
    user_id: 'usr_1',
    prospect_id: 'pr_2',
    due_date: '2026-06-27',
    reminder_text: 'Send a personalized connection invitation to Alex Rivera referencing Jordan Lee\'s intro.',
    completed: false,
    created_at: '2026-06-24T08:16:00Z',
  }
];

export const mockTemplates: MessageTemplate[] = [
  {
    id: 'tp_1',
    user_id: 'usr_1',
    name: 'Value-First Connection Invite',
    category: 'Connection Request',
    body: 'Hi {first_name}, noticed you\'re managing growth at {company}. I recently did a conversion teardown for a similar SaaS and put together a 3-step checklist that boosted signup rates by 22%. Would love to connect and send it your way!',
    created_at: '2026-06-01T08:00:00Z',
  },
  {
    id: 'tp_2',
    user_id: 'usr_1',
    name: 'SaaS Founder Problem Hook',
    category: 'First Outreach',
    body: 'Hi {first_name},\n\nI love what you guys are building at {company}. I noticed that your platform has been scaling super fast!\n\nOften, fast-growing tech teams run into bottleneck issues with database query latencies or API sluggishness under heavy load. I specialize in backend performance tuning (just helped OptimizeCo reduce response times by 40%).\n\nIf you\'re open to it, I\'d love to share a brief screen recording of 2 minor speed improvements I spotted on your public signup routes. Let me know if that would be useful!',
    created_at: '2026-06-01T08:15:00Z',
  },
  {
    id: 'tp_3',
    user_id: 'usr_1',
    name: 'Friendly 3-Day Follow Up',
    category: 'Follow Up',
    body: 'Hey {first_name}, just wanted to bump this to the top of your inbox. I know things get chaotic at {company}! Let me know if you\'d like that conversion checklist, or if there is a specific tech bottleneck you\'re tackling today.',
    created_at: '2026-06-04T12:00:00Z',
  },
  {
    id: 'tp_4',
    user_id: 'usr_1',
    name: 'Discovery Sync Calendar Ask',
    category: 'Scheduling',
    body: 'Great chatting, {first_name}. It sounds like resolving {company}\'s React state lag is a top priority for Q3. \n\nLet\'s book a brief 15-minute diagnostic call. We can pull up the code together and pinpoint the exact re-rendering loops.\n\nHere is my calendar link: cal.com/alex-mercer/15min\n\nLooking forward to it!',
    created_at: '2026-06-05T09:00:00Z',
  }
];

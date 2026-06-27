export interface User {
  id: string;
  name: string;
  email: string;
  plan_type: 'Free' | 'Pro' | 'Enterprise';
  created_at: string;
}

export interface Prospect {
  id: string;
  user_id: string;
  full_name: string;
  linkedin_profile_url: string;
  company: string;
  job_title: string;
  status: string; // references status name or id
  priority: 'Low' | 'Medium' | 'High';
  estimated_value: number;
  source: string;
  notes: string;
  next_follow_up_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  prospect_id: string;
  user_id: string;
  type: 'Cold Outreach' | 'Follow Up' | 'Conversation' | 'Call' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost' | 'General Note';
  description: string;
  created_at: string;
}

export interface StatusStage {
  id: string;
  user_id: string;
  name: string;
  color: string; // hex or tailwind color class
  sort_order: number;
}

export interface Reminder {
  id: string;
  user_id: string;
  prospect_id: string;
  due_date: string; // YYYY-MM-DD
  reminder_text: string;
  completed: boolean;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  name: string;
  body: string;
  category: 'Connection Request' | 'First Outreach' | 'Follow Up' | 'Scheduling' | 'Post-Meeting';
  created_at: string;
}

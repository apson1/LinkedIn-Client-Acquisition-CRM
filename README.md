# LinkedIn Client-Acquisition CRM

A compliance-first, highly interactive visual pipeline companion CRM designed for freelancers, solopreneurs, B2B consultants, and outbound sales teams. This CRM turns scattered LinkedIn sales conversations into a clean, actionable visual funnel, helping you track leads, manage follow-ups, and hit your outreach goals without risking your LinkedIn account.

---

## 🚀 Key Features

* **Interactive Kanban Pipeline**: Drag and drop prospects across 10 custom stages (from *New Lead* to *Closed Won*).
* **Smart Reminders**: Separate dashboards for *Overdue*, *Due Today*, and *Upcoming* reminders, ensuring no warm prospect falls through the cracks.
* **Prospect Detail Page**: A complete timeline of outreach activities, conversation notes, priority levels, estimated deal values, and quick profile links.
* **Reusable Message Templates**: Organized by category (Connection Requests, Follow Ups, Scheduling) with one-click copy-to-clipboard functions.
* **Dashboard Analytics**: Real-time visibility into your pipeline's total value, average conversion rates, active lead counts, and sales velocity.
* **Data Portability**: Export your pipeline to CSV at any time for custom reporting or backups.
* **Pipeline Customization**: Create, rename, re-order, and color-code your own status stages to match your unique sales cycle.

---

## 🔒 Compliance & Safety Principles

LinkedIn strictly prohibits third-party browser plug-ins that scrape profiles, automate actions, or alter the LinkedIn user interface. **This project is built from the ground up to be 100% compliant and safe:**
* **Zero Automation**: No automated messaging, connection sending, or profile scanning.
* **Zero Scraping**: No automated background harvesting of user data or cookies.
* **User-Initiated Workflows**: All lead entries, profile links, and notes are manually input or confirmed by the user.
* **Secure Sandbox**: The CRM runs as a separate side companion, completely independent of LinkedIn's active web page DOM.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Motion (Framer Motion)](https://motion.dev/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Persistence**: LocalStorage with automatic state sync (pre-configured with rich mock data for immediate evaluation).

---

## 📂 Project Structure

```text
LinkedIn-Client-Acquisition-CRM/
├── docs/                      # Technical specification & product guides
│   ├── context.md             # Detailed product summary & MVP scope
│   ├── implementation.md     # Supabase backend schema & delivery roadmap
│   └── skill.md               # Guidelines & coding standards
├── src/
│   ├── components/            # UI Views
│   │   ├── AddProspectView.tsx       # Lead creation & edit modal
│   │   ├── AuthView.tsx             # Prototype signup/login screen
│   │   ├── DashboardView.tsx        # Charts, metrics & recent activities
│   │   ├── ExportView.tsx           # CSV generation & preview tool
│   │   ├── Navigation.tsx           # Responsive sidebar/header navigation
│   │   ├── PipelineBoardView.tsx    # Drag-and-drop Kanban pipeline board
│   │   ├── ProspectDetailView.tsx   # Lead profile page with activity timelines
│   │   ├── ProspectsListView.tsx    # Filterable & searchable lead table
│   │   ├── RemindersView.tsx        # Due, upcoming & completed task list
│   │   ├── SettingsView.tsx         # Account limits & custom stage editors
│   │   └── TemplatesView.tsx        # Message template library
│   ├── App.tsx                # Main state controller & router
│   ├── index.css              # Core Tailwind & custom CSS variables
│   ├── main.tsx               # App mounting entry point
│   ├── mockData.ts            # Realistic CRM sandbox data seeds
│   └── types.ts               # Shared TypeScript schemas
├── package.json               # Package scripts & dependencies
└── tsconfig.json              # TypeScript compilation setup
```

---

## 📦 Data Schema

The CRM organizes data into the following core structures (defined in [`src/types.ts`](file:///c:/Git%20Repo/LinkedIn-Client-Acquisition-CRM/src/types.ts)):

### 1. `Prospect`
Tracks client metadata and current pipeline stage:
```typescript
export interface Prospect {
  id: string;
  user_id: string;
  full_name: string;
  linkedin_profile_url: string;
  company: string;
  job_title: string;
  status: string; // References status name or ID
  priority: 'Low' | 'Medium' | 'High';
  estimated_value: number;
  source: string;
  notes: string;
  next_follow_up_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}
```

### 2. `Activity`
Logs touchpoints and modifications:
```typescript
export interface Activity {
  id: string;
  prospect_id: string;
  user_id: string;
  type: 'Cold Outreach' | 'Follow Up' | 'Conversation' | 'Call' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost' | 'General Note';
  description: string;
  created_at: string;
}
```

### 3. `Reminder`
Tracks specific actionable follow-ups:
```typescript
export interface Reminder {
  id: string;
  user_id: string;
  prospect_id: string;
  due_date: string; // YYYY-MM-DD
  reminder_text: string;
  completed: boolean;
  created_at: string;
}
```

---

## 💻 Getting Started

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or any alternative package manager (`yarn`, `pnpm`)

### 🔌 Installation

1. Clone the repository to your local machine.
2. Navigate into the directory and install dependencies:
   ```bash
   npm install
   ```

### ⚡ Running Locally

Start the Vite development server:
```bash
npm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your browser.

### 🏗️ Production Build

To compile the TypeScript project and generate the optimized production assets in the `/dist` folder:
```bash
npm run build
```
To preview the compiled production build locally:
```bash
npm run preview
```

---

## 🗺️ Implementation Roadmap

See the detailed product files inside the `docs/` directory for full specifications:
* [Product Context (`docs/context.md`)](file:///c:/Git%20Repo/LinkedIn-Client-Acquisition-CRM/docs/context.md) — Comprehensive product features, target users, and MVP scope details.
* [Database & Architecture (`docs/implementation.md`)](file:///c:/Git%20Repo/LinkedIn-Client-Acquisition-CRM/docs/implementation.md) — Database tables, row-level security (RLS) configurations, and Supabase integration guides.
* [Agent Skill Guides (`docs/skill.md`)](file:///c:/Git%20Repo/LinkedIn-Client-Acquisition-CRM/docs/skill.md) — Code formatting, style rules, and verification checklist.
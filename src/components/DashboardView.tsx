import { Prospect, Activity, Reminder } from '../types';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Activity as ActivityIcon,
  Plus, 
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  prospects: Prospect[];
  activities: Activity[];
  reminders: Reminder[];
  onNavigate: (tabId: string) => void;
  onSelectProspect: (prospectId: string) => void;
  onOpenAddModal: () => void;
}

export default function DashboardView({ 
  prospects, 
  activities, 
  reminders, 
  onNavigate, 
  onSelectProspect,
  onOpenAddModal
}: DashboardViewProps) {
  
  // Calculate stats
  const activeProspects = prospects.filter(p => p.status !== 'Closed - Won' && p.status !== 'Nurture / Later');
  const totalValue = activeProspects.reduce((sum, p) => sum + (p.estimated_value || 0), 0);
  const closedWon = prospects.filter(p => p.status === 'Closed - Won');
  const closedWonValue = closedWon.reduce((sum, p) => sum + (p.estimated_value || 0), 0);
  
  // Get active user-configured dates
  const todayStr = new Date('2026-06-26').toISOString().split('T')[0]; // Use current local time 2026-06-26
  
  const pendingReminders = reminders.filter(r => !r.completed);
  const overdueReminders = pendingReminders.filter(r => r.due_date < todayStr);
  const upcomingReminders = pendingReminders.filter(r => r.due_date >= todayStr).sort((a, b) => a.due_date.localeCompare(b.due_date));
  
  // High priority leads
  const highPriorityLeads = prospects.filter(p => p.priority === 'High' && p.status !== 'Closed - Won').slice(0, 4);

  // Conversion rates
  const totalOutreach = prospects.filter(p => p.status !== 'New Lead').length;
  const wonCount = closedWon.length;
  const winRate = totalOutreach > 0 ? Math.round((wonCount / totalOutreach) * 100) : 0;

  // Pipeline stage distribution
  const stageCounts: Record<string, number> = {};
  prospects.forEach(p => {
    stageCounts[p.status] = (stageCounts[p.status] || 0) + 1;
  });

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {/* Upper Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            LinkedIn CRM Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back! Here is an overview of your active LinkedIn acquisition funnel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Critical Overdue Followup Alert banner */}
      {overdueReminders.length > 0 && (
        <div className="flex items-start sm:items-center gap-3.5 bg-rose-50 border border-rose-100 p-4 rounded-2xl">
          <div className="p-2 rounded-xl bg-rose-500 text-white shadow-sm shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-rose-900">
              {overdueReminders.length} Overdue Follow-up Task{overdueReminders.length > 1 ? 's' : ''}!
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              You missed scheduled follow-ups. Keep outreach momentum alive by checking in with these warm contacts.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('reminders')}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 shrink-0 bg-white border border-rose-200 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
          >
            Resolve
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Analytical KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Prospects</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{activeProspects.length}</h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">{prospects.length} total</span>
              <span>leads logged</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline Value</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              ${totalValue.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-blue-600 font-bold">${closedWonValue.toLocaleString()}</span>
              <span>won deals</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overdue Tasks</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {overdueReminders.length}
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className={`${upcomingReminders.length > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                {upcomingReminders.length} upcoming
              </span>
              <span>reminders pending</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${overdueReminders.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Funnel Win Rate</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{winRate}%</h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">{closedWon.length} won</span>
              <span>out of {totalOutreach} touched</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pipeline Funnel Visual Distribution */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 font-display">Funnel Pipeline Status</h3>
              <button 
                onClick={() => onNavigate('pipeline')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Pipeline Board
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="space-y-3.5">
              {[
                { name: 'New Lead', color: 'bg-slate-400', count: stageCounts['New Lead'] || 0 },
                { name: 'Outreach Sent', color: 'bg-blue-500', count: stageCounts['Outreach Sent'] || 0 },
                { name: 'In Discussion', color: 'bg-indigo-500', count: stageCounts['In Discussion'] || 0 },
                { name: 'Meeting Booked', color: 'bg-purple-500', count: stageCounts['Meeting Booked'] || 0 },
                { name: 'Proposal Sent', color: 'bg-amber-500', count: stageCounts['Proposal Sent'] || 0 },
                { name: 'Closed - Won', color: 'bg-emerald-500', count: stageCounts['Closed - Won'] || 0 },
              ].map((stage) => {
                const percentage = prospects.length > 0 ? Math.round((stage.count / prospects.length) * 100) : 0;
                return (
                  <div key={stage.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600">{stage.name}</span>
                      <span className="text-slate-900 font-bold">{stage.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(percentage, stage.count > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Priority Warm Prospects */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 font-display">Priority Hot Leads</h3>
              <button 
                onClick={() => onNavigate('prospects')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All Prospects
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {highPriorityLeads.length > 0 ? (
                highPriorityLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => onSelectProspect(lead.id)}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{lead.full_name}</h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {lead.job_title} @ <span className="font-semibold">{lead.company}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">${lead.estimated_value.toLocaleString()}</span>
                        <span className="inline-flex items-center text-[10px] text-slate-400 font-semibold uppercase">{lead.source}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No high priority prospects left. Good job!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Reminders and Timeline */}
        <div className="space-y-6">
          
          {/* Action-Oriented Reminders panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-blue-600" />
                Next Follow-Ups
              </h3>
              <button 
                onClick={() => onNavigate('reminders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                View All
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {upcomingReminders.slice(0, 4).length > 0 ? (
                upcomingReminders.slice(0, 4).map((rem) => {
                  const prospect = prospects.find(p => p.id === rem.prospect_id);
                  return (
                    <div 
                      key={rem.id} 
                      onClick={() => prospect && onSelectProspect(prospect.id)}
                      className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-100 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-900 truncate max-w-[120px]">
                          {prospect ? prospect.full_name : 'Unknown Prospect'}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {rem.due_date === todayStr ? 'Today' : rem.due_date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {rem.reminder_text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-xs">All caught up!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">No upcoming follow-ups scheduled.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Outbound Activities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-display mb-4 flex items-center gap-1.5">
              <ActivityIcon className="h-4.5 w-4.5 text-blue-600" />
              Recent Activity
            </h3>

            <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-4">
              {activities.slice(0, 4).length > 0 ? (
                activities.slice(0, 4).map((act) => {
                  const prospect = prospects.find(p => p.id === act.prospect_id);
                  return (
                    <div key={act.id} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-6.5 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                      
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          onClick={() => prospect && onSelectProspect(prospect.id)}
                          className="font-bold text-slate-900 hover:underline cursor-pointer"
                        >
                          {prospect ? prospect.full_name : 'Prospect'}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400">
                          {new Date(act.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 mt-0.5 inline-block">{act.type}</span>
                      <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

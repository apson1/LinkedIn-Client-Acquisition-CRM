import React, { useState, useMemo } from 'react';
import { Prospect, Activity, Reminder, MessageTemplate } from '../types';
import { 
  X, 
  Linkedin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Activity as ActivityIcon, 
  FileText,
  Copy,
  Check,
  Send,
  Flag,
  User,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface ProspectDetailViewProps {
  prospect: Prospect;
  activities: Activity[];
  reminders: Reminder[];
  templates: MessageTemplate[];
  onClose: () => void;
  onAddActivity: (prospectId: string, type: Activity['type'], description: string) => void;
  onAddReminder: (prospectId: string, text: string, date: string) => void;
  onToggleReminder: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
}

export default function ProspectDetailView({
  prospect,
  activities,
  reminders,
  templates,
  onClose,
  onAddActivity,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}: ProspectDetailViewProps) {
  const [activityType, setActivityType] = useState<Activity['type']>('Cold Outreach');
  const [activityDescription, setActivityDescription] = useState('');
  
  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState('2026-06-29'); // Today is 2026-06-26

  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'reminders' | 'templates'>('timeline');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Filter activities and reminders specifically for this prospect
  const prospectActivities = useMemo(() => {
    return activities
      .filter((a) => a.prospect_id === prospect.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [activities, prospect.id]);

  const prospectReminders = useMemo(() => {
    return reminders.filter((r) => r.prospect_id === prospect.id);
  }, [reminders, prospect.id]);

  const firstName = useMemo(() => {
    return prospect.full_name.split(' ')[0] || prospect.full_name;
  }, [prospect.full_name]);

  // Compute live template with name replacement
  const compiledTemplateBody = useMemo(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return '';
    return template.body
      .replace(/{first_name}/g, firstName)
      .replace(/{company}/g, prospect.company);
  }, [templates, selectedTemplateId, firstName, prospect.company]);

  const handleCopyTemplate = () => {
    if (!compiledTemplateBody) return;
    navigator.clipboard.writeText(compiledTemplateBody);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDescription.trim()) return;
    onAddActivity(prospect.id, activityType, activityDescription.trim());
    setActivityDescription('');
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderText.trim() || !reminderDate) return;
    onAddReminder(prospect.id, reminderText.trim(), reminderDate);
    setReminderText('');
  };

  const handleQuickStatusLog = (statusName: string) => {
    onAddActivity(
      prospect.id, 
      'General Note', 
      `Manually updated conversation context notes. Current status is ${statusName}.`
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left column - Prospect core card detail profile */}
        <div className="md:w-2/5 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {prospect.full_name.charAt(0)}
              </div>
              <button 
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-display">{prospect.full_name}</h2>
                <a 
                  href={prospect.linkedin_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                  title="Manually visit LinkedIn inbox"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">{prospect.job_title}</p>
              <p className="text-xs text-slate-500 font-medium">@ <span className="text-slate-800 font-semibold">{prospect.company}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/80">
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Est. Deal Value</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 block">${prospect.estimated_value?.toLocaleString() || '0'}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Priority</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                  prospect.priority === 'High' 
                    ? 'bg-rose-50 text-rose-700' 
                    : prospect.priority === 'Medium'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {prospect.priority}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Status Stage</span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold border border-blue-100">
                  {prospect.status}
                </span>
              </div>

              <div className="text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Lead Source</span>
                <span className="font-semibold text-slate-700">{prospect.source}</span>
              </div>

              {prospect.next_follow_up_date && (
                <div className="text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Next Follow-Up Date</span>
                  <span className={`font-semibold inline-flex items-center gap-1.5 ${
                    prospect.next_follow_up_date < '2026-06-26' ? 'text-rose-600 font-bold' : 'text-slate-700'
                  }`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {prospect.next_follow_up_date === '2026-06-26' ? 'Today' : prospect.next_follow_up_date}
                    {prospect.next_follow_up_date < '2026-06-26' && '(Overdue!)'}
                  </span>
                </div>
              )}

              <div className="text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Outreach Notes</span>
                <div className="bg-white p-3 border border-slate-150 rounded-xl text-slate-600 text-xs leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {prospect.notes || 'No custom notes logged.'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 hidden md:block">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <span>Created</span>
              <span>{new Date(prospect.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right column - Tabs layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header tabs navigation */}
          <div className="px-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex space-x-4">
              {[
                { id: 'timeline', label: 'Timeline & Logs', icon: ActivityIcon },
                { id: 'reminders', label: 'Follow-up Reminders', icon: Clock },
                { id: 'templates', label: 'Copy Scripts', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 text-sm font-semibold flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            {/* Close action */}
            <button 
              onClick={onClose}
              className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sub-tab main scroll section */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Sub-tab 1: Timeline */}
            {activeSubTab === 'timeline' && (
              <div className="space-y-6">
                
                {/* Form to log activity */}
                <form onSubmit={handleAddActivitySubmit} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Log LinkedIn Outreach Activity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as any)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-xs focus:border-blue-500 focus:outline-none text-slate-700 font-bold"
                    >
                      <option value="Cold Outreach">📥 Cold Outreach</option>
                      <option value="Follow Up">🔔 Follow Up</option>
                      <option value="Conversation">💬 Conversation</option>
                      <option value="Call">📞 Call</option>
                      <option value="Proposal Sent">📄 Proposal Sent</option>
                      <option value="Closed Won">🎉 Closed Won</option>
                      <option value="Closed Lost">💔 Closed Lost</option>
                      <option value="General Note">📝 General Note</option>
                    </select>
                    
                    <input
                      type="text"
                      required
                      placeholder="What was said or accomplished? e.g. Accepted request"
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      className="sm:col-span-2 block w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs focus:border-blue-500 focus:outline-none text-slate-700"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                      <Send className="mr-1.5 h-3 w-3" />
                      Add Log
                    </button>
                  </div>
                </form>

                {/* Vertical activity timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prospect Touchpoint Logs</h3>
                  
                  <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-5">
                    {prospectActivities.length > 0 ? (
                      prospectActivities.map((act) => (
                        <div key={act.id} className="relative text-xs">
                          {/* Circle status dot icon */}
                          <span className="absolute -left-7.5 top-0.5 h-4 w-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold">
                            🔍
                          </span>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {act.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {new Date(act.created_at).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 mt-1.5 leading-relaxed bg-slate-50/55 p-2.5 rounded-lg border border-slate-100/50">
                            {act.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        No touchpoints logged yet. Record your initial LinkedIn activity above!
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2: Reminders */}
            {activeSubTab === 'reminders' && (
              <div className="space-y-6">
                
                {/* Form to log reminder */}
                <form onSubmit={handleAddReminderSubmit} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Schedule Follow-up Action</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Task: e.g. Bump message or email..."
                      value={reminderText}
                      onChange={(e) => setReminderText(e.target.value)}
                      className="sm:col-span-2 block w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      required
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Follow-Up
                    </button>
                  </div>
                </form>

                {/* List of active reminders */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Actions List</h3>
                  
                  {prospectReminders.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white overflow-hidden">
                      {prospectReminders.map((rem) => {
                        const overdue = !rem.completed && rem.due_date < '2026-06-26';
                        return (
                          <div key={rem.id} className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-start gap-2.5 min-w-0 pr-4">
                              <button
                                onClick={() => onToggleReminder(rem.id)}
                                className={`p-0.5 rounded-full mt-0.5 transition-colors cursor-pointer ${
                                  rem.completed 
                                    ? 'text-emerald-600 bg-emerald-50' 
                                    : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </button>
                              <div>
                                <p className={`text-xs font-medium ${rem.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                  {rem.reminder_text}
                                </p>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 ${
                                  overdue ? 'text-rose-600 animate-pulse' : 'text-slate-400'
                                }`}>
                                  <Calendar className="h-3 w-3" />
                                  Due: {rem.due_date} {overdue && '(OVERDUE!)'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => onDeleteReminder(rem.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete Reminder"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                      No follow-ups scheduled yet. Plan one above!
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-tab 3: Copy scripts */}
            {activeSubTab === 'templates' && (
              <div className="space-y-6">
                
                {/* Template picker selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Outreach Template Script Selector
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-700 font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select a copywriting template...</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.category} - {t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Compiled body preview box */}
                {selectedTemplateId ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider">Tailored Output Script Preview</span>
                      <button
                        onClick={handleCopyTemplate}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                      >
                        {copiedTemplate ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            Copied to Clipboard!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy tailored message
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-sans text-xs leading-relaxed whitespace-pre-wrap select-all max-h-72 overflow-y-auto border border-slate-800 shadow-inner">
                      {compiledTemplateBody}
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-800 leading-normal flex gap-1.5 items-start">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>Outbound Compliance Directive:</strong> This script contains dynamic replacements for name and company. Copy this text, open their LinkedIn profile in a new tab, and paste manually into your chat or connection request. No bots are running!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    Select a script template above to automatically replace and format variables.
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

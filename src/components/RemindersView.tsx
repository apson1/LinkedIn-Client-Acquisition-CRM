import React, { useState, useMemo } from 'react';
import { Reminder, Prospect } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Trash2, 
  AlertCircle, 
  User, 
  CheckCircle,
  Plus,
  Send,
  ExternalLink
} from 'lucide-react';

interface RemindersViewProps {
  reminders: Reminder[];
  prospects: Prospect[];
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onSelectProspect: (id: string) => void;
  onAddGeneralReminder: (prospectId: string, text: string, date: string) => void;
}

export default function RemindersView({
  reminders,
  prospects,
  onToggleReminder,
  onDeleteReminder,
  onSelectProspect,
  onAddGeneralReminder
}: RemindersViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'overdue' | 'completed'>('pending');
  
  // Quick reminder add form state
  const [targetProspectId, setTargetProspectId] = useState('');
  const [newText, setNewText] = useState('');
  const [newDate, setNewDate] = useState('2026-06-29'); // Current time: 2026-06-26

  const todayStr = '2026-06-26';

  // Memoize grouped categories
  const classifiedReminders = useMemo(() => {
    const pending = reminders.filter(r => !r.completed && r.due_date >= todayStr);
    const overdue = reminders.filter(r => !r.completed && r.due_date < todayStr);
    const completed = reminders.filter(r => r.completed);

    // Sort overdue first, then oldest to newest. Pending soonest first.
    overdue.sort((a, b) => a.due_date.localeCompare(b.due_date));
    pending.sort((a, b) => a.due_date.localeCompare(b.due_date));
    completed.sort((a, b) => b.due_date.localeCompare(a.due_date));

    return { pending, overdue, completed };
  }, [reminders]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newDate || !targetProspectId) return;
    onAddGeneralReminder(targetProspectId, newText.trim(), newDate);
    setNewText('');
    setTargetProspectId('');
  };

  return (
    <div id="reminders-view" className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Follow-up Task Manager
          </h1>
          <p className="text-sm text-slate-500">
            Keep pipeline relationships warm. Never lose touch with prospective clients.
          </p>
        </div>
      </div>

      {/* Main Grid: Add quick-action follow-up left side, List items right side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Create action-oriented follow-up */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-blue-600" />
            Schedule Follow-up
          </h3>

          <form onSubmit={handleQuickAdd} className="space-y-3.5">
            {/* Target prospect selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Target Prospect *
              </label>
              <select
                value={targetProspectId}
                required
                onChange={(e) => setTargetProspectId(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer text-slate-700 font-semibold"
              >
                <option value="">Select prospect...</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.company})
                  </option>
                ))}
              </select>
            </div>

            {/* Task description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Task Reminder *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bump message or email..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Due date */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Target Due Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
            >
              <Send className="mr-2 h-4 w-4" />
              Schedule Action
            </button>
          </form>
        </div>

        {/* Right Side: Tab lists showing reminders categorized */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          
          {/* List Headers subtabs */}
          <div className="px-4 sm:px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex space-x-4">
              {[
                { id: 'overdue', label: 'Overdue', count: classifiedReminders.overdue.length, color: 'text-rose-600 border-rose-500' },
                { id: 'pending', label: 'Pending', count: classifiedReminders.pending.length, color: 'text-blue-600 border-blue-500' },
                { id: 'completed', label: 'Completed', count: classifiedReminders.completed.length, color: 'text-slate-600 border-slate-500' },
              ].map((subTab) => {
                const isActive = activeSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveSubTab(subTab.id as any)}
                    className={`py-3.5 px-1 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600 font-black' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span>{subTab.label}</span>
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-extrabold ${
                      isActive 
                        ? subTab.id === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {subTab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core listed items area */}
          <div className="flex-1 p-4 sm:p-6">
            
            {/* Overdue View */}
            {activeSubTab === 'overdue' && (
              <div className="space-y-3">
                {classifiedReminders.overdue.length > 0 ? (
                  classifiedReminders.overdue.map((rem) => {
                    const prospect = prospects.find(p => p.id === rem.prospect_id);
                    return (
                      <div key={rem.id} className="p-4 bg-rose-50/45 border border-rose-100 rounded-xl flex items-center justify-between gap-4 hover:bg-rose-50/70 transition-colors">
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => onToggleReminder(rem.id)}
                            className="p-0.5 rounded-full mt-0.5 text-slate-300 hover:text-rose-600 hover:bg-rose-100 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-rose-950 leading-relaxed">
                              {rem.reminder_text}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {prospect && (
                                <button
                                  onClick={() => onSelectProspect(prospect.id)}
                                  className="inline-flex items-center gap-1 bg-white border border-rose-200 hover:border-rose-300 px-2 py-0.5 rounded-md text-[10px] font-bold text-rose-700 transition-colors cursor-pointer"
                                >
                                  <User className="h-2.5 w-2.5" />
                                  {prospect.full_name} ({prospect.company})
                                  <ExternalLink className="h-2 w-2" />
                                </button>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                                <AlertCircle className="h-3 w-3" />
                                Overdue: {rem.due_date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteReminder(rem.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors shrink-0"
                          title="Delete Reminder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                    <CheckCircle className="h-10 w-10 text-emerald-500/70 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">No Overdue Follow-ups!</p>
                    <p className="text-slate-400 mt-1">Excellent job keeping relationship pipelines clean.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending View */}
            {activeSubTab === 'pending' && (
              <div className="space-y-3">
                {classifiedReminders.pending.length > 0 ? (
                  classifiedReminders.pending.map((rem) => {
                    const prospect = prospects.find(p => p.id === rem.prospect_id);
                    return (
                      <div key={rem.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 hover:bg-slate-100/60 transition-colors">
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => onToggleReminder(rem.id)}
                            className="p-0.5 rounded-full mt-0.5 text-slate-300 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-relaxed">
                              {rem.reminder_text}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {prospect && (
                                <button
                                  onClick={() => onSelectProspect(prospect.id)}
                                  className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                  <User className="h-2.5 w-2.5" />
                                  {prospect.full_name} ({prospect.company})
                                  <ExternalLink className="h-2 w-2" />
                                </button>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                Due: {rem.due_date === todayStr ? 'Today' : rem.due_date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteReminder(rem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Delete Reminder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                    <CheckCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">All Caught Up!</p>
                    <p className="text-slate-400 mt-1">No upcoming follow-up schedules. Plan your outbound calendar on the left panel!</p>
                  </div>
                )}
              </div>
            )}

            {/* Completed View */}
            {activeSubTab === 'completed' && (
              <div className="space-y-3">
                {classifiedReminders.completed.length > 0 ? (
                  classifiedReminders.completed.map((rem) => {
                    const prospect = prospects.find(p => p.id === rem.prospect_id);
                    return (
                      <div key={rem.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between gap-4 opacity-75">
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => onToggleReminder(rem.id)}
                            className="p-0.5 rounded-full mt-0.5 text-emerald-600 bg-emerald-50 cursor-pointer"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500 line-through leading-relaxed">
                              {rem.reminder_text}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {prospect && (
                                <button
                                  onClick={() => onSelectProspect(prospect.id)}
                                  className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                                >
                                  <User className="h-2.5 w-2.5" />
                                  {prospect.full_name}
                                  <ExternalLink className="h-2 w-2" />
                                </button>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <CheckCircle className="h-3 w-3 text-emerald-500" />
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteReminder(rem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                          title="Delete Reminder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
                    No completed follow-ups logged yet. Check things off your checklist!
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

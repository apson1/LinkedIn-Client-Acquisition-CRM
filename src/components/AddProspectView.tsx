import React, { useState, useEffect } from 'react';
import { Prospect, StatusStage } from '../types';
import { 
  X, 
  Linkedin, 
  DollarSign, 
  Calendar, 
  Save, 
  FileText, 
  MapPin, 
  HelpCircle,
  Briefcase,
  Layers,
  Flag
} from 'lucide-react';

interface AddProspectViewProps {
  prospectToEdit?: Prospect | null;
  statuses: StatusStage[];
  onSave: (prospect: Omit<Prospect, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  onClose: () => void;
}

export default function AddProspectView({
  prospectToEdit,
  statuses,
  onSave,
  onClose
}: AddProspectViewProps) {
  const [fullName, setFullName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [estimatedValue, setEstimatedValue] = useState('2500');
  const [source, setSource] = useState('LinkedIn Search');
  const [notes, setNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('2026-06-29'); // Relative to today (2026-06-26)

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prospectToEdit) {
      setFullName(prospectToEdit.full_name);
      setLinkedinUrl(prospectToEdit.linkedin_profile_url);
      setCompany(prospectToEdit.company);
      setJobTitle(prospectToEdit.job_title);
      setStatus(prospectToEdit.status);
      setPriority(prospectToEdit.priority);
      setEstimatedValue(prospectToEdit.estimated_value ? String(prospectToEdit.estimated_value) : '0');
      setSource(prospectToEdit.source);
      setNotes(prospectToEdit.notes);
      setNextFollowUpDate(prospectToEdit.next_follow_up_date || '');
    } else {
      // Set default status to first status if available
      if (statuses.length > 0) {
        setStatus(statuses[0].name);
      }
    }
  }, [prospectToEdit, statuses]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = 'Full Name is required';
    
    if (!linkedinUrl.trim()) {
      tempErrors.linkedinUrl = 'LinkedIn URL is required';
    } else if (!linkedinUrl.toLowerCase().includes('linkedin.com/')) {
      tempErrors.linkedinUrl = 'Must be a valid LinkedIn URL (e.g. linkedin.com/in/username)';
    }

    if (!company.trim()) tempErrors.company = 'Company is required';
    if (!jobTitle.trim()) tempErrors.jobTitle = 'Job title is required';
    if (!status) tempErrors.status = 'Pipeline stage is required';
    if (isNaN(Number(estimatedValue)) || Number(estimatedValue) < 0) {
      tempErrors.estimatedValue = 'Value must be a positive number';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: prospectToEdit?.id,
      full_name: fullName.trim(),
      linkedin_profile_url: linkedinUrl.trim(),
      company: company.trim(),
      job_title: jobTitle.trim(),
      status,
      priority,
      estimated_value: Number(estimatedValue),
      source,
      notes: notes.trim(),
      next_follow_up_date: nextFollowUpDate,
    });
  };

  // Helper to prefill details when pasting a URL (simulating intelligent assist)
  const handleUrlBlur = () => {
    if (!linkedinUrl) return;
    
    // Simple URL parse to extract some prefill details for premium UI look if name/company is empty
    if (!fullName) {
      const parts = linkedinUrl.replace(/\/$/, '').split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart !== 'in' && !lastPart.includes('?')) {
        const guessedName = lastPart
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/[0-9]/g, '');
        setFullName(guessedName);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Form Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-slate-950 font-display">
            {prospectToEdit ? 'Edit LinkedIn Prospect' : 'Add New LinkedIn Prospect'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* LinkedIn Profile URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Linkedin className="h-3.5 w-3.5 text-blue-600" />
              LinkedIn Profile URL *
            </label>
            <input
              type="text"
              required
              placeholder="https://www.linkedin.com/in/prospect-username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              onBlur={handleUrlBlur}
              className={`block w-full rounded-xl border py-2.5 px-3 text-sm placeholder-slate-400 focus:outline-none transition-all ${
                errors.linkedinUrl 
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' 
                  : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
              }`}
            />
            {errors.linkedinUrl ? (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.linkedinUrl}</p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                Paste URL here. Leaving the input guess-fills the prospect's full name.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`block w-full rounded-xl border py-2 px-3 text-sm placeholder-slate-400 focus:outline-none transition-all ${
                  errors.fullName 
                    ? 'border-rose-400 focus:border-rose-500' 
                    : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>}
            </div>

            {/* Estimated Value */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                Est. Deal Value ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="2500"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className={`block w-full rounded-xl border py-2 px-3 text-sm placeholder-slate-400 focus:outline-none transition-all font-mono ${
                  errors.estimatedValue 
                    ? 'border-rose-400 focus:border-rose-500' 
                    : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {errors.estimatedValue && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.estimatedValue}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                Company *
              </label>
              <input
                type="text"
                required
                placeholder="Google Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`block w-full rounded-xl border py-2 px-3 text-sm placeholder-slate-400 focus:outline-none transition-all ${
                  errors.company 
                    ? 'border-rose-400 focus:border-rose-500' 
                    : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {errors.company && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.company}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                placeholder="Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`block w-full rounded-xl border py-2 px-3 text-sm placeholder-slate-400 focus:outline-none transition-all ${
                  errors.jobTitle 
                    ? 'border-rose-400 focus:border-rose-500' 
                    : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {errors.jobTitle && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.jobTitle}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pipeline Stage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                Pipeline Status *
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority flag */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Flag className="h-3.5 w-3.5 text-slate-400" />
                Deal Priority *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-2 px-2 border rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${
                      priority === level
                        ? level === 'High'
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                          : level === 'Medium'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-400 bg-slate-50 text-slate-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Outreach Source */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Lead Source
              </label>
              <input
                type="text"
                placeholder="LinkedIn Search, Mutual Friend, etc."
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-700 font-medium"
              />
            </div>

            {/* Next Follow Up Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Follow-up Date
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-mono text-slate-700"
              />
            </div>
          </div>

          {/* Context Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              Notes / Outreach Context
            </label>
            <textarea
              placeholder="Record context notes, pain points mentioned, details discussed during outreach..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

        </form>

        {/* Form Footer Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-150 hover:text-slate-800 rounded-xl border border-slate-200 bg-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Prospect
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { User, StatusStage } from '../types';
import { 
  Settings, 
  User as UserIcon, 
  Layers, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Save, 
  Sparkles,
  Award
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  statuses: StatusStage[];
  onAddStatus: (name: string, colorClass: string) => void;
  onDeleteStatus: (id: string) => void;
  onResetData: () => void;
}

export default function SettingsView({
  user,
  onUpdateUser,
  statuses,
  onAddStatus,
  onDeleteStatus,
  onResetData
}: SettingsViewProps) {
  
  // Profile settings state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [planType, setPlanType] = useState(user.plan_type);

  // New stage/status state
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('bg-blue-50 text-blue-800 border-blue-200');

  const [savedMessage, setSavedMessage] = useState('');

  const colorPresets = [
    { label: 'Slate Grey', value: 'bg-slate-100 text-slate-800 border-slate-300' },
    { label: 'Outbound Blue', value: 'bg-blue-50 text-blue-800 border-blue-200' },
    { label: 'Warm Indigo', value: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { label: 'Lead Purple', value: 'bg-purple-50 text-purple-800 border-purple-200' },
    { label: 'Warm Amber', value: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Client Emerald', value: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Archive Rose', value: 'bg-rose-50 text-rose-800 border-rose-200' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      plan_type: planType
    });
    setSavedMessage('Profile settings updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleAddStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    onAddStatus(newStageName.trim(), newStageColor);
    setNewStageName('');
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
          Account & Pipeline Settings
        </h1>
        <p className="text-sm text-slate-500">
          Personalize outbound stage sequences, update profile details, or reload simulation data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Profile & Plans (1 Column) */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Profile form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserIcon className="h-4 w-4 text-blue-600" />
              User Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {savedMessage && (
                <div className="p-2 bg-emerald-50 border border-emerald-150 rounded-lg text-[11px] text-emerald-700 font-bold">
                  {savedMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Active Plan</label>
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanType('Free')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide ${
                        planType === 'Free'
                          ? 'border-slate-400 bg-slate-50 text-slate-700 font-black'
                          : 'border-slate-250 text-slate-400 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanType('Pro')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide flex items-center justify-center gap-1 ${
                        planType === 'Pro'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-black'
                          : 'border-slate-250 text-slate-400 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <Award className="h-3 w-3" />
                      Pro
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Update Profile
              </button>
            </form>
          </div>

          {/* Reset App simulation */}
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
              Danger Zone
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal">
              Resetting deletes all local changes, customized stages, activity logs, and restores initial mock data.
            </p>

            <button
              onClick={() => {
                if(confirm("Are you sure you want to restore initial demo data? Your current prospects and logs will be overwritten!")) {
                  onResetData();
                }
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-rose-150 shadow-sm"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset App Data
            </button>
          </div>

        </div>

        {/* Right Side: Stages Configurator (2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-blue-600" />
              Deal Stage Pipelines
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              These stages define the columns on your Kanban pipeline board. Modify them to align with your specific outbound sequence.
            </p>

            {/* List of current statuses */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Current Pipeline Stages</label>
              
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-slate-50/20 overflow-hidden">
                {statuses.map((status, idx) => (
                  <div key={status.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-slate-400 font-mono">#{idx+1}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color} border`}>
                        {status.name}
                      </span>
                    </div>

                    <button
                      disabled={statuses.length <= 1}
                      onClick={() => onDeleteStatus(status.id)}
                      className={`p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                        statuses.length <= 1 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      title={statuses.length <= 1 ? "Cannot delete the last stage" : "Delete stage"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add stage form */}
            <form onSubmit={handleAddStageSubmit} className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-blue-600" />
                Add Custom Pipeline Column Stage
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stage Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Contract review"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs focus:border-blue-500 focus:outline-none text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color Theme *</label>
                  <select
                    value={newStageColor}
                    onChange={(e) => setNewStageColor(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 text-xs focus:border-blue-500 focus:outline-none cursor-pointer text-slate-700 font-bold"
                  >
                    {colorPresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Swatch Preview */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Color preview:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${newStageColor} border`}>
                  {newStageName || 'Preview Label'}
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-lg transition-all"
                >
                  Create Deal Stage
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

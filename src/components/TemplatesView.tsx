import React, { useState, useMemo } from 'react';
import { MessageTemplate, Prospect } from '../types';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  User, 
  HelpCircle,
  Folder,
  Send,
  AlertCircle
} from 'lucide-react';

interface TemplatesViewProps {
  templates: MessageTemplate[];
  prospects: Prospect[];
  onAddTemplate: (template: Omit<MessageTemplate, 'id' | 'user_id' | 'created_at'>) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function TemplatesView({
  templates,
  prospects,
  onAddTemplate,
  onDeleteTemplate
}: TemplatesViewProps) {
  
  // New template form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<MessageTemplate['category']>('Connection Request');

  // Interactive Live Compiler State
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedProspectId, setSelectedProspectId] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Group templates by category
  const categories: MessageTemplate['category'][] = [
    'Connection Request',
    'First Outreach',
    'Follow Up',
    'Scheduling',
    'Post-Meeting'
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBody.trim()) return;

    onAddTemplate({
      name: newName.trim(),
      body: newBody.trim(),
      category: newCategory
    });

    setNewName('');
    setNewBody('');
    setShowAddForm(false);
  };

  // Compile selected template with selected prospect
  const compiledText = useMemo(() => {
    const template = templates.find(t => t.id === selectedTemplateId);
    const prospect = prospects.find(p => p.id === selectedProspectId);

    if (!template) return 'Select a message template above...';
    if (!prospect) return 'Select a target prospect to preview personalized variables...';

    const firstName = prospect.full_name.split(' ')[0] || prospect.full_name;
    return template.body
      .replace(/{first_name}/g, firstName)
      .replace(/{company}/g, prospect.company);
  }, [templates, prospects, selectedTemplateId, selectedProspectId]);

  const handleCopy = () => {
    if (!compiledText || selectedTemplateId === '' || selectedProspectId === '') return;
    navigator.clipboard.writeText(compiledText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div id="templates-view" className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            LinkedIn Messaging Templates
          </h1>
          <p className="text-sm text-slate-500">
            Write, categorize, and compile personalized copy scripts. Boost outbound productivity with zero bots.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showAddForm ? 'Close Editor' : 'New Template'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Template Manager on the left/top, Interactive live compiler on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Template Library Manager (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Add Form Collapse */}
          {showAddForm && (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Create Copy Script</h3>
              
              <form onSubmit={handleCreate} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 Sales Pitch Connect"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Outreach Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer text-slate-700 font-semibold"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">
                      Message Body *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Placeholders: <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{"{first_name}"}</code>, <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{"{company}"}</code>
                    </span>
                  </div>
                  <textarea
                    required
                    placeholder="Hi {first_name}, noticed you are growing {company}..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    rows={6}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Save Template
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Catalog of categories and templates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
              <Folder className="h-4.5 w-4.5 text-blue-600" />
              Template Library
            </h3>

            {categories.map((category) => {
              const catTemplates = templates.filter(t => t.category === category);
              if (catTemplates.length === 0) return null;

              return (
                <div key={category} className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    {category} ({catTemplates.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {catTemplates.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => { setSelectedTemplateId(t.id); }}
                        className={`p-3.5 border rounded-xl transition-all cursor-pointer relative group flex flex-col justify-between ${
                          selectedTemplateId === t.id 
                            ? 'border-blue-500 bg-blue-50/20' 
                            : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">{t.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                            {t.body}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-150/55">
                          <span className="text-[9px] font-bold uppercase text-slate-400">Preview copy</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTemplate(t.id); }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete template"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Live Outbound Script Compiler (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Live Outreach Compiler</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Synthesize and customize copy templates in real-time. Simply select a script template and a target LinkedIn prospect below.
            </p>

            <div className="space-y-3.5">
              {/* Select script */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  1. Choose Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer font-semibold text-slate-700"
                >
                  <option value="">Choose template...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.category} - {t.name}</option>
                  ))}
                </select>
              </div>

              {/* Select target prospect */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  2. Choose Target Prospect
                </label>
                <select
                  value={selectedProspectId}
                  onChange={(e) => setSelectedProspectId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer font-semibold text-slate-700"
                >
                  <option value="">Choose prospect...</option>
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.company})</option>
                  ))}
                </select>
              </div>

              {/* Compiler Display Output */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-400 uppercase">
                    3. Live Tailored Outreach Text
                  </label>
                  {selectedTemplateId && selectedProspectId && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Text
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs leading-relaxed font-sans min-h-[140px] whitespace-pre-wrap select-all border border-slate-900 shadow-inner max-h-80 overflow-y-auto">
                  {compiledText}
                </div>

                {selectedTemplateId && selectedProspectId && (
                  <div className="p-3 bg-blue-50/55 border border-blue-100/50 rounded-xl text-[10px] text-blue-800 leading-normal flex gap-2 items-start mt-2">
                    <AlertCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Manual Workflow compliance:</strong> Copy this compiled message to your clipboard, click on their LinkedIn profile, click "Connect" or "Message", and paste manually. No LinkedIn API flags!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

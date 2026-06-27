import React, { useState } from 'react';
import { Prospect, Activity, Reminder, MessageTemplate, StatusStage } from '../types';
import { 
  Download, 
  Upload, 
  Database, 
  FileSpreadsheet, 
  RefreshCw, 
  Link, 
  ExternalLink,
  Check,
  AlertCircle,
  FileCode,
  Chrome
} from 'lucide-react';

interface ExportViewProps {
  prospects: Prospect[];
  activities: Activity[];
  reminders: Reminder[];
  templates: MessageTemplate[];
  statuses: StatusStage[];
  onImportBackup: (backup: {
    prospects: Prospect[];
    activities: Activity[];
    reminders: Reminder[];
    templates: MessageTemplate[];
    statuses: StatusStage[];
  }) => void;
}

export default function ExportView({
  prospects,
  activities,
  reminders,
  templates,
  statuses,
  onImportBackup
}: ExportViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Client-side CSV Exporter
  const handleExportCSV = () => {
    if (prospects.length === 0) return;

    const headers = [
      'Full Name',
      'LinkedIn Profile URL',
      'Company',
      'Job Title',
      'Status Stage',
      'Priority',
      'Estimated Value',
      'Source',
      'Next Follow-up Date',
      'Notes',
      'Created At'
    ];

    const rows = prospects.map((p) => [
      `"${p.full_name.replace(/"/g, '""')}"`,
      `"${p.linkedin_profile_url}"`,
      `"${p.company.replace(/"/g, '""')}"`,
      `"${p.job_title.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.priority}"`,
      p.estimated_value,
      `"${p.source}"`,
      p.next_follow_up_date,
      `"${p.notes.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      p.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `linkedin_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side full JSON Backup Exporter
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      data: {
        prospects,
        activities,
        reminders,
        templates,
        statuses
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `crm_complete_backup_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side JSON Backup Importer
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data || !parsed.data.prospects || !parsed.data.statuses) {
          throw new Error('Invalid backup schema. Missing critical database objects.');
        }
        
        onImportBackup({
          prospects: parsed.data.prospects,
          activities: parsed.data.activities || [],
          reminders: parsed.data.reminders || [],
          templates: parsed.data.templates || [],
          statuses: parsed.data.statuses
        });
        
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 4000);
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText('https://api.incrm.io/v1/webhooks/linkedin/leads?token=mercer_78234');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div id="export-sync-view" className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
          Export & Cloud Synchronization
        </h1>
        <p className="text-sm text-slate-500">
          Secure spreadsheet database downloads, database recovery files, and manual pipeline integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: File Exports (CSV & JSON) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
            <Database className="h-4.5 w-4.5 text-blue-600" />
            File Backups & Exports
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Download your manual CRM database locally. You can download a standard CSV for spreadsheets, or a JSON configuration backup to copy onto other browsers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* CSV Download */}
            <button
              onClick={handleExportCSV}
              disabled={prospects.length === 0}
              className={`p-4 border rounded-xl flex flex-col justify-between text-left transition-all ${
                prospects.length === 0 
                  ? 'opacity-40 border-slate-200 cursor-not-allowed' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mb-3 w-fit">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">Export to CSV</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Standard spreadsheet layout for Google Sheets or Microsoft Excel.
                </p>
              </div>
            </button>

            {/* JSON Download */}
            <button
              onClick={handleExportJSON}
              className="p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mb-3 w-fit">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">Backup Database (JSON)</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Complete database dump (stages, scripts, reminders, logs).
                </p>
              </div>
            </button>

          </div>

          {/* JSON Restore Import */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              Restore Database Backup
            </h4>

            {importError && (
              <div className="p-2.5 bg-rose-50 border border-rose-150 rounded-lg text-xs text-rose-700 font-medium">
                {importError}
              </div>
            )}
            {importSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-150 rounded-lg text-xs text-emerald-700 font-bold">
                Backup restored successfully! All data replaced.
              </div>
            )}

            <div className="relative border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileCode className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-700 block">Select Complete JSON Backup File</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Drag-and-drop or select locally</span>
            </div>
          </div>
        </div>

        {/* Box 2: Pro Synchronizations (HubSpot, Notion, Sidepanel) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
              <Link className="h-4.5 w-4.5 text-blue-600" />
              Professional Synchronizations
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Connect InCRM directly to external services or your browser side-panel to sync manual notes and templates instantly.
            </p>

            <div className="space-y-3">
              
              {/* Sync 1: HubSpot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#FF7A59]/10 text-[#FF7A59] flex items-center justify-center font-black text-xs">
                    HS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">HubSpot Contacts Sync</h4>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Not Connected</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Cloud CRM database required. Upgrade your trial inside settings to Pro to provision HubSpot connection.")}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Connect
                </button>
              </div>

              {/* Sync 2: Notion */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">
                    N
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Notion Workspace Sync</h4>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Not Connected</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Cloud CRM database required. Upgrade your trial inside settings to Pro to provision Notion connection.")}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Connect
                </button>
              </div>

              {/* Sync 3: Chrome Extension */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                    <Chrome className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Chrome Sidebar Extension</h4>
                    <span className="text-[9px] font-bold uppercase text-slate-500">Standalone Companion</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Chrome Extension package builds can be requested directly. Reach out in contact page!")}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Install
                </button>
              </div>

            </div>
          </div>

          {/* Webhook developer setup */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Outbound Webhook URL</h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://api.incrm.io/v1/webhooks/linkedin/leads?token=mercer_78234"
                className="flex-1 bg-slate-50 border border-slate-200 py-1.5 px-2.5 text-[10px] font-mono text-slate-500 rounded-lg focus:outline-none truncate"
              />
              <button
                onClick={handleCopyWebhook}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 shrink-0 bg-blue-50 rounded-lg"
              >
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Developer hook. Fire a POST request here to inject prospects directly into this browser's CRM.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

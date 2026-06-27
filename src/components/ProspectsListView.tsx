import React, { useState, useMemo } from 'react';
import { Prospect, StatusStage } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  ArrowUpDown, 
  Linkedin, 
  ChevronRight, 
  Trash2, 
  Edit2,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ProspectsListViewProps {
  prospects: Prospect[];
  statuses: StatusStage[];
  onSelectProspect: (id: string) => void;
  onEditProspect: (prospect: Prospect) => void;
  onDeleteProspect: (id: string) => void;
  onOpenAddModal: () => void;
}

type SortField = 'full_name' | 'company' | 'estimated_value' | 'next_follow_up_date' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function ProspectsListView({
  prospects,
  statuses,
  onSelectProspect,
  onEditProspect,
  onDeleteProspect,
  onOpenAddModal
}: ProspectsListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Multi-filter + Search logic
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const matchQuery = 
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === '' || p.status === statusFilter;
      const matchPriority = priorityFilter === '' || p.priority === priorityFilter;

      return matchQuery && matchStatus && matchPriority;
    });
  }, [prospects, searchQuery, statusFilter, priorityFilter]);

  // Sort logic
  const sortedProspects = useMemo(() => {
    const sorted = [...filteredProspects];
    sorted.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (sortField === 'estimated_value') {
        return sortOrder === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredProspects, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CSV Exporter client-side
  const handleExportCSV = () => {
    if (prospects.length === 0) return;

    const headers = [
      'Full Name',
      'LinkedIn Profile',
      'Company',
      'Job Title',
      'Status',
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
    link.setAttribute('download', 'linkedin_prospects_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="prospects-list-view" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Prospect Directory
          </h1>
          <p className="text-sm text-slate-500">
            Search, filter, and review your full prospect database. Download records as a clean CSV at any time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name, company, role, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="">All Pipeline Stages</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Priority filter dropdown */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="">All Priorities</option>
              <option value="High">🔥 High</option>
              <option value="Medium">⚡ Medium</option>
              <option value="Low">💤 Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>

        </div>

        {/* Filter Summary Tags */}
        {(statusFilter || priorityFilter || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Active Filters:</span>
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                Query: "{searchQuery}"
              </span>
            )}
            {statusFilter && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Stage: {statusFilter}
              </span>
            )}
            {priorityFilter && (
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                Priority: {priorityFilter}
              </span>
            )}
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter(''); setPriorityFilter(''); }}
              className="text-blue-600 hover:text-blue-800 font-bold ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Table & Deck View Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" onClick={() => toggleSort('full_name')} className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-1.5">
                    Prospect Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th scope="col" onClick={() => toggleSort('company')} className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-1.5">
                    Company & Role
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status Stage
                </th>
                <th scope="col" className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Priority
                </th>
                <th scope="col" onClick={() => toggleSort('estimated_value')} className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-1.5 font-mono">
                    Est. Value
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th scope="col" onClick={() => toggleSort('next_follow_up_date')} className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-1.5">
                    Next Follow-up
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedProspects.length > 0 ? (
                sortedProspects.map((p) => {
                  const isOverdue = p.next_follow_up_date && p.next_follow_up_date < '2026-06-26';
                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => onSelectProspect(p.id)}
                      className="hover:bg-slate-50/75 transition-colors cursor-pointer"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-900 text-sm">{p.full_name}</div>
                          <a 
                            href={p.linkedin_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                            title="Visit LinkedIn Profile"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700">{p.company}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{p.job_title}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                          p.priority === 'High' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : p.priority === 'Medium'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 font-mono">
                        ${p.estimated_value?.toLocaleString() || '0'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className={isOverdue ? 'text-rose-600 font-semibold' : ''}>
                            {p.next_follow_up_date === '2026-06-26' ? 'Today' : p.next_follow_up_date || 'No follow-up'}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditProspect(p)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Prospect"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProspect(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Prospect"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No prospects found matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card Stack View */}
        <div className="block md:hidden divide-y divide-slate-100 bg-white">
          {sortedProspects.length > 0 ? (
            sortedProspects.map((p) => {
              const isOverdue = p.next_follow_up_date && p.next_follow_up_date < '2026-06-26';
              return (
                <div 
                  key={p.id} 
                  onClick={() => onSelectProspect(p.id)}
                  className="p-4 active:bg-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer relative"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {p.full_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{p.job_title} @ <span className="font-semibold">{p.company}</span></p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      ${p.estimated_value?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3.5 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.status}
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                        p.priority === 'High' 
                          ? 'bg-rose-50 text-rose-700' 
                          : p.priority === 'Medium'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                        {p.next_follow_up_date || 'No date'}
                      </span>
                    </div>
                  </div>

                  {/* LinkedIn / edit controls */}
                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-2.5 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                    <a 
                      href={p.linkedin_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <Linkedin className="h-3 w-3" />
                      Profile
                    </a>
                    <button
                      onClick={() => onEditProspect(p)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProspect(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              No prospects found.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Prospect, StatusStage } from '../types';
import { 
  Plus, 
  Linkedin, 
  DollarSign, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PipelineBoardViewProps {
  prospects: Prospect[];
  statuses: StatusStage[];
  onMoveProspect: (prospectId: string, newStatus: string) => void;
  onSelectProspect: (prospectId: string) => void;
  onOpenAddModal: () => void;
}

export default function PipelineBoardView({
  prospects,
  statuses,
  onMoveProspect,
  onSelectProspect,
  onOpenAddModal
}: PipelineBoardViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Standard HTML5 Drag and Drop events
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, statusName: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onMoveProspect(id, statusName);
    }
    setDraggedId(null);
  };

  const moveLeft = (e: React.MouseEvent, prospect: Prospect, currentIndex: number) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onMoveProspect(prospect.id, statuses[currentIndex - 1].name);
    }
  };

  const moveRight = (e: React.MouseEvent, prospect: Prospect, currentIndex: number) => {
    e.stopPropagation();
    if (currentIndex < statuses.length - 1) {
      onMoveProspect(prospect.id, statuses[currentIndex + 1].name);
    }
  };

  // Check if follow up date is overdue (Today is 2026-06-26)
  const isOverdue = (dateStr: string) => {
    if (!dateStr) return false;
    return dateStr < '2026-06-26';
  };

  return (
    <div id="pipeline-board-view" className="h-full flex flex-col space-y-6 p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Board Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            LinkedIn Deal Pipeline
          </h1>
          <p className="text-sm text-slate-500">
            Drag cards between stages or use quick arrows to track conversation and proposal updates.
          </p>
        </div>
        <div>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Board Scroll Stage Columns Container */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-4 min-h-[500px] items-start pb-4">
          
          {statuses.map((status, index) => {
            const columnProspects = prospects.filter(p => p.status === status.name);
            const columnValueSum = columnProspects.reduce((sum, p) => sum + (p.estimated_value || 0), 0);

            return (
              <div
                key={status.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.name)}
                className="w-72 bg-slate-50 rounded-2xl border border-slate-200/60 p-3.5 flex flex-col shrink-0 max-h-[calc(100vh-210px)]"
              >
                {/* Stage Column Title & Metric Aggregations */}
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 truncate max-w-[130px]">{status.name}</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-200 text-slate-700">
                      {columnProspects.length}
                    </span>
                  </div>
                  {columnValueSum > 0 && (
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      ${columnValueSum.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Draggable Cards area */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnProspects.length > 0 ? (
                    columnProspects.map((prospect) => {
                      const overdue = isOverdue(prospect.next_follow_up_date);
                      return (
                        <div
                          key={prospect.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, prospect.id)}
                          onClick={() => onSelectProspect(prospect.id)}
                          className={`bg-white p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 relative group select-none ${
                            draggedId === prospect.id ? 'opacity-40 border-dashed border-blue-400' : 'border-slate-200/80 shadow-sm'
                          }`}
                        >
                          {/* Priority Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              prospect.priority === 'High' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                : prospect.priority === 'Medium'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {prospect.priority} Priority
                            </span>
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              ${prospect.estimated_value?.toLocaleString() || '0'}
                            </span>
                          </div>

                          {/* Prospect Name and Title info */}
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {prospect.full_name}
                          </h4>
                          <div className="flex items-center text-xs text-slate-500 mt-0.5 truncate">
                            <span className="truncate">{prospect.company}</span>
                          </div>

                          {/* Next Follow Up Indicator */}
                          {prospect.next_follow_up_date && (
                            <div className="flex items-center gap-1 mt-3 text-[10px] font-medium text-slate-400">
                              <Calendar className="h-3 w-3" />
                              <span className={overdue ? 'text-rose-600 font-semibold flex items-center gap-0.5' : 'text-slate-500'}>
                                {overdue && <AlertCircle className="h-2.5 w-2.5" />}
                                Next: {prospect.next_follow_up_date === '2026-06-26' ? 'Today' : prospect.next_follow_up_date}
                              </span>
                            </div>
                          )}

                          {/* Accessible Click-to-Move Controls (arrows) */}
                          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-slate-400 shrink-0">
                            <button
                              disabled={index === 0}
                              onClick={(e) => moveLeft(e, prospect, index)}
                              className={`p-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                index === 0 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title="Move Left"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            
                            <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                              Move Column
                            </span>

                            <button
                              disabled={index === statuses.length - 1}
                              onClick={(e) => moveRight(e, prospect, index)}
                              className={`p-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                index === statuses.length - 1 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title="Move Right"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          
                          {/* Anchor LinkedIn icon for compliance notification */}
                          <a 
                            href={prospect.linkedin_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-3.5 top-9 p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
                            title="Open LinkedIn Profile"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

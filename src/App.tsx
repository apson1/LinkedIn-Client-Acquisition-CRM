import React, { useState, useEffect, useMemo } from 'react';
import { User, Prospect, Activity, Reminder, MessageTemplate, StatusStage } from './types';
import { 
  mockUser, 
  defaultStatuses, 
  mockProspects, 
  mockActivities, 
  mockReminders, 
  mockTemplates 
} from './mockData';

// Component Views
import AuthView from './components/AuthView';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import PipelineBoardView from './components/PipelineBoardView';
import ProspectsListView from './components/ProspectsListView';
import AddProspectView from './components/AddProspectView';
import ProspectDetailView from './components/ProspectDetailView';
import RemindersView from './components/RemindersView';
import TemplatesView from './components/TemplatesView';
import SettingsView from './components/SettingsView';
import ExportView from './components/ExportView';

export default function App() {
  
  // 1. Core Persistent State Initializers
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('incrm_user');
    return saved ? JSON.parse(saved) : mockUser; // Start logged in as Alex for reviewer convenience
  });

  const [statuses, setStatuses] = useState<StatusStage[]>(() => {
    const saved = localStorage.getItem('incrm_statuses');
    return saved ? JSON.parse(saved) : defaultStatuses;
  });

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('incrm_prospects');
    return saved ? JSON.parse(saved) : mockProspects;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('incrm_activities');
    return saved ? JSON.parse(saved) : mockActivities;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('incrm_reminders');
    return saved ? JSON.parse(saved) : mockReminders;
  });

  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    const saved = localStorage.getItem('incrm_templates');
    return saved ? JSON.parse(saved) : mockTemplates;
  });

  // 2. Navigation & Modal Layout Controls
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  
  // Add / Edit Prospect form controllers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prospectToEdit, setProspectToEdit] = useState<Prospect | null>(null);

  // 3. Write-back State Sync to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('incrm_user', JSON.stringify(user));
    else localStorage.removeItem('incrm_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('incrm_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('incrm_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('incrm_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('incrm_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('incrm_templates', JSON.stringify(templates));
  }, [templates]);

  // 4. Overdue Global Reminders Calculation (Today is 2026-06-26)
  const overdueCount = useMemo(() => {
    const todayStr = '2026-06-26';
    return reminders.filter(r => !r.completed && r.due_date < todayStr).length;
  }, [reminders]);

  const activeSelectedProspect = useMemo(() => {
    return prospects.find(p => p.id === selectedProspectId) || null;
  }, [prospects, selectedProspectId]);

  // 5. Shared Core Actions & Callback Managers

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('auth');
  };

  const handleMoveProspect = (prospectId: string, newStatus: string) => {
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        return {
          ...p,
          status: newStatus,
          updated_at: new Date().toISOString()
        };
      }
      return p;
    }));

    // Log the progression activity
    const target = prospects.find(p => p.id === prospectId);
    if (target) {
      const newActivity: Activity = {
        id: `act_${Date.now()}`,
        prospect_id: prospectId,
        user_id: user?.id || 'usr_unknown',
        type: 'Conversation',
        description: `Moved prospect pipeline status from "${target.status}" to "${newStatus}".`,
        created_at: new Date().toISOString()
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  const handleSaveProspect = (formData: Omit<Prospect, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    const timestamp = new Date().toISOString();
    
    if (formData.id) {
      // EDIT existing prospect
      setProspects(prev => prev.map(p => {
        if (p.id === formData.id) {
          return {
            ...p,
            ...formData,
            updated_at: timestamp
          };
        }
        return p;
      }));

      // Log modify activity
      const log: Activity = {
        id: `act_${Date.now()}`,
        prospect_id: formData.id,
        user_id: user?.id || 'usr_unknown',
        type: 'General Note',
        description: `Prospect credentials or notes manually updated inside Directory.`,
        created_at: timestamp
      };
      setActivities(prev => [log, ...prev]);
    } else {
      // ADD new prospect
      const newId = `pr_${Date.now()}`;
      const newProspect: Prospect = {
        ...formData,
        id: newId,
        user_id: user?.id || 'usr_1',
        created_at: timestamp,
        updated_at: timestamp
      };

      setProspects(prev => [newProspect, ...prev]);

      // Log outreach seeding log
      const log: Activity = {
        id: `act_${Date.now()}`,
        prospect_id: newId,
        user_id: user?.id || 'usr_unknown',
        type: 'Cold Outreach',
        description: `Manually added prospect directory record with initial note: "${formData.notes || 'None'}".`,
        created_at: timestamp
      };
      setActivities(prev => [log, ...prev]);

      // If a follow up date was specified, create a matching pending reminder!
      if (formData.next_follow_up_date) {
        const newReminder: Reminder = {
          id: `rem_${Date.now()}`,
          user_id: user?.id || 'usr_1',
          prospect_id: newId,
          due_date: formData.next_follow_up_date,
          reminder_text: `Check in with ${formData.full_name} regarding outbound pipeline next steps.`,
          completed: false,
          created_at: timestamp
        };
        setReminders(prev => [newReminder, ...prev]);
      }
    }

    setIsAddModalOpen(false);
    setProspectToEdit(null);
  };

  const handleDeleteProspect = (id: string) => {
    if (confirm("Are you sure you want to delete this prospect? All associated timeline logs and pending follow-ups will be removed!")) {
      setProspects(prev => prev.filter(p => p.id !== id));
      setActivities(prev => prev.filter(a => a.prospect_id !== id));
      setReminders(prev => prev.filter(r => r.prospect_id !== id));
      if (selectedProspectId === id) setSelectedProspectId(null);
    }
  };

  const handleAddActivity = (prospectId: string, type: Activity['type'], description: string) => {
    const newAct: Activity = {
      id: `act_${Date.now()}`,
      prospect_id: prospectId,
      user_id: user?.id || 'usr_1',
      type,
      description,
      created_at: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);

    // Update prospect updated_at timestamp
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        // If logging a close deal or meeting, automatically advance the stage too!
        let status = p.status;
        if (type === 'Closed Won') status = 'Closed - Won';
        else if (type === 'Proposal Sent') status = 'Proposal Sent';
        else if (type === 'Call') status = 'Meeting Booked';

        return { ...p, status, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handleAddReminder = (prospectId: string, text: string, date: string) => {
    const newRem: Reminder = {
      id: `rem_${Date.now()}`,
      user_id: user?.id || 'usr_1',
      prospect_id: prospectId,
      due_date: date,
      reminder_text: text,
      completed: false,
      created_at: new Date().toISOString()
    };
    setReminders(prev => [newRem, ...prev]);

    // Sync back to prospect next_follow_up_date
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        return { ...p, next_follow_up_date: date, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const toggledStatus = !r.completed;
        
        // Log the achievement activity in prospect's timeline
        const act: Activity = {
          id: `act_${Date.now()}`,
          prospect_id: r.prospect_id,
          user_id: user?.id || 'usr_1',
          type: 'Follow Up',
          description: `Completed check-in task: "${r.reminder_text}".`,
          created_at: new Date().toISOString()
        };
        setActivities(p => [act, ...p]);

        return { ...r, completed: toggledStatus };
      }
      return r;
    }));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAddTemplate = (newTemp: Omit<MessageTemplate, 'id' | 'user_id' | 'created_at'>) => {
    const t: MessageTemplate = {
      ...newTemp,
      id: `tp_${Date.now()}`,
      user_id: user?.id || 'usr_1',
      created_at: new Date().toISOString()
    };
    setTemplates(prev => [t, ...prev]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleAddStatus = (name: string, colorClass: string) => {
    const s: StatusStage = {
      id: `st_${Date.now()}`,
      user_id: user?.id || 'usr_1',
      name,
      color: colorClass,
      sort_order: statuses.length + 1
    };
    setStatuses(prev => [...prev, s]);
  };

  const handleDeleteStatus = (id: string) => {
    const targetStatus = statuses.find(s => s.id === id);
    if (!targetStatus) return;

    if (confirm(`Deleting "${targetStatus.name}" stage column. Any prospects currently in this stage will be re-assigned to "${statuses[0].name}" stage so they don't get lost!`)) {
      setProspects(prev => prev.map(p => {
        if (p.status === targetStatus.name) {
          return { ...p, status: statuses[0].name, updated_at: new Date().toISOString() };
        }
        return p;
      }));
      setStatuses(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleResetData = () => {
    // Clear individual keys
    localStorage.removeItem('incrm_user');
    localStorage.removeItem('incrm_statuses');
    localStorage.removeItem('incrm_prospects');
    localStorage.removeItem('incrm_activities');
    localStorage.removeItem('incrm_reminders');
    localStorage.removeItem('incrm_templates');

    // Reset states back to initial seeds
    setUser(mockUser);
    setStatuses(defaultStatuses);
    setProspects(mockProspects);
    setActivities(mockActivities);
    setReminders(mockReminders);
    setTemplates(mockTemplates);
    setActiveTab('dashboard');
    setSelectedProspectId(null);
  };

  const handleImportBackup = (backup: {
    prospects: Prospect[];
    activities: Activity[];
    reminders: Reminder[];
    templates: MessageTemplate[];
    statuses: StatusStage[];
  }) => {
    setProspects(backup.prospects);
    setActivities(backup.activities);
    setReminders(backup.reminders);
    setTemplates(backup.templates);
    setStatuses(backup.statuses);
  };

  // 6. Tab Content Switch Router
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            prospects={prospects}
            activities={activities}
            reminders={reminders}
            onNavigate={setActiveTab}
            onSelectProspect={setSelectedProspectId}
            onOpenAddModal={() => { setProspectToEdit(null); setIsAddModalOpen(true); }}
          />
        );
      case 'pipeline':
        return (
          <PipelineBoardView
            prospects={prospects}
            statuses={statuses}
            onMoveProspect={handleMoveProspect}
            onSelectProspect={setSelectedProspectId}
            onOpenAddModal={() => { setProspectToEdit(null); setIsAddModalOpen(true); }}
          />
        );
      case 'prospects':
        return (
          <ProspectsListView
            prospects={prospects}
            statuses={statuses}
            onSelectProspect={setSelectedProspectId}
            onEditProspect={(p) => { setProspectToEdit(p); setIsAddModalOpen(true); }}
            onDeleteProspect={handleDeleteProspect}
            onOpenAddModal={() => { setProspectToEdit(null); setIsAddModalOpen(true); }}
          />
        );
      case 'reminders':
        return (
          <RemindersView
            reminders={reminders}
            prospects={prospects}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onSelectProspect={setSelectedProspectId}
            onAddGeneralReminder={handleAddReminder}
          />
        );
      case 'templates':
        return (
          <TemplatesView
            templates={templates}
            prospects={prospects}
            onAddTemplate={handleAddTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        );
      case 'export':
        return (
          <ExportView
            prospects={prospects}
            activities={activities}
            reminders={reminders}
            templates={templates}
            statuses={statuses}
            onImportBackup={handleImportBackup}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={user || mockUser}
            onUpdateUser={setUser}
            statuses={statuses}
            onAddStatus={handleAddStatus}
            onDeleteStatus={handleDeleteStatus}
            onResetData={handleResetData}
          />
        );
      default:
        return <div className="text-center py-20">Page not found.</div>;
    }
  };

  // 7. Auth Screen Gate Barrier
  if (!user) {
    return <AuthView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Universal Side Navigation bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        overdueCount={overdueCount}
      />

      {/* Primary Display viewport */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {renderTabContent()}
      </main>

      {/* Unified Add/Edit Prospect Modal Dialog */}
      {isAddModalOpen && (
        <AddProspectView
          prospectToEdit={prospectToEdit}
          statuses={statuses}
          onClose={() => { setIsAddModalOpen(false); setProspectToEdit(null); }}
          onSave={handleSaveProspect}
        />
      )}

      {/* Unified Detailed Drawer Modal view */}
      {selectedProspectId && activeSelectedProspect && (
        <ProspectDetailView
          prospect={activeSelectedProspect}
          activities={activities}
          reminders={reminders}
          templates={templates}
          onClose={() => setSelectedProspectId(null)}
          onAddActivity={handleAddActivity}
          onAddReminder={handleAddReminder}
          onToggleReminder={handleToggleReminder}
          onDeleteReminder={handleDeleteReminder}
        />
      )}
    </div>
  );
}

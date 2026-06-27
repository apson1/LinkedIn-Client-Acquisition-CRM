import { useState } from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Bell, 
  FileText, 
  Download, 
  Settings, 
  LogOut, 
  Linkedin, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  overdueCount: number;
}

export default function Navigation({ activeTab, setActiveTab, user, onLogout, overdueCount }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Board', icon: KanbanSquare },
    { id: 'prospects', label: 'Prospects List', icon: Users },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'templates', label: 'Message Templates', icon: FileText },
    { id: 'export', label: 'Export & Sync', icon: Download },
    { id: 'settings', label: 'Settings & Stages', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Linkedin className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg text-white">LinkedIn CRM</span>
        </div>
        <div className="flex items-center space-x-3">
          {overdueCount > 0 && (
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Side Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between z-40 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Linkedin className="h-4.5 w-4.5" />
              </div>
              <span className="font-display font-bold text-white">LinkedIn CRM</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
              <UserIcon className="h-4.5 w-4.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 uppercase tracking-wider">
                {user.plan_type}
              </span>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-rose-950/25 hover:text-rose-400 rounded-xl transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-950 border-r border-slate-800/80 p-5 h-screen sticky top-0 shrink-0">
        <div className="space-y-7">
          <div className="flex items-center space-x-3 py-1 px-1.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/15">
              <Linkedin className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg tracking-tight text-white leading-tight">
                InCRM
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Outbound CRM</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 px-1">
            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <div className="flex items-center mt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  {user.plan_type} Account
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-rose-950/25 hover:text-rose-400 rounded-xl transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

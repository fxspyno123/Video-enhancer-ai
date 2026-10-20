import React from 'react';
import { Home, Sliders, FolderKanban, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'dashboard' | 'workspace' | 'projects' | 'settings';
  setCurrentTab: (tab: 'dashboard' | 'workspace' | 'projects' | 'settings') => void;
  hasLoadedVideo: boolean;
}

interface TabItem {
  id: 'dashboard' | 'workspace' | 'projects' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  hasLoadedVideo,
}) => {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workspace', label: 'Workspace', icon: Sliders, badge: hasLoadedVideo },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 pb-safe">
      <div className="grid grid-cols-4 items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive ? 'text-[#F04438]' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F04438]" />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-semibold text-[#F04438]' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

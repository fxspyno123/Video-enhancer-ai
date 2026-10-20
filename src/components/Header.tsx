import React, { useState } from 'react';
import { Smartphone, Download, Sparkles, FolderKanban, Settings, Sliders, Menu, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: 'dashboard' | 'workspace' | 'projects' | 'settings';
  setCurrentTab: (tab: 'dashboard' | 'workspace' | 'projects' | 'settings') => void;
  hasLoadedVideo: boolean;
  onOpenMobileGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  hasLoadedVideo,
  onOpenMobileGuide,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F04438] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-[#FF8A00]" />
              </div>
              <span className="font-bold text-base tracking-tight text-zinc-900 whitespace-nowrap">
                EnhanceAI<span className="text-[#F04438] font-semibold">Studio</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-[#F04438] transition-colors whitespace-nowrap py-1 ${
                currentTab === 'dashboard' ? 'text-[#F04438] border-b-2 border-[#F04438] font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`hover:text-[#F04438] transition-colors whitespace-nowrap py-1 ${
                currentTab === 'workspace' ? 'text-[#F04438] border-b-2 border-[#F04438] font-semibold' : ''
              }`}
            >
              Workspace {hasLoadedVideo && <span className="w-1.5 h-1.5 rounded-full bg-[#F04438] inline-block mb-2 ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTab('projects')}
              className={`hover:text-[#F04438] transition-colors whitespace-nowrap py-1 ${
                currentTab === 'projects' ? 'text-[#F04438] border-b-2 border-[#F04438] font-semibold' : ''
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className={`hover:text-[#F04438] transition-colors whitespace-nowrap py-1 ${
                currentTab === 'settings' ? 'text-[#F04438] border-b-2 border-[#F04438] font-semibold' : ''
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Zone 3: Actions (PWA install, Android Mobile Guide, Mobile Menu) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Android Mobile Phone Guide Button */}
            <button
              onClick={onOpenMobileGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors min-h-[38px]"
              title="Android Mobile Dev & Testing Guide"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#F04438]" />
              <span className="hidden sm:inline">Mobile Guide</span>
            </button>

            {/* PWA Install Trigger */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#F04438] hover:bg-[#D92D20] rounded-lg shadow-xs transition-colors min-h-[38px]"
              >
                <Download className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Install App</span>
              </button>
            )}

            {isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors min-h-[38px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Home</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-200 px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                currentTab === 'dashboard' ? 'bg-red-50 text-[#F04438]' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F04438]" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentTab('workspace');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                currentTab === 'workspace' ? 'bg-red-50 text-[#F04438]' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#F04438]" />
              Video Workspace
            </button>
            <button
              onClick={() => {
                setCurrentTab('projects');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                currentTab === 'projects' ? 'bg-red-50 text-[#F04438]' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-[#F04438]" />
              My Projects
            </button>
            <button
              onClick={() => {
                setCurrentTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                currentTab === 'settings' ? 'bg-red-50 text-[#F04438]' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Settings className="w-4 h-4 text-[#F04438]" />
              Settings
            </button>
          </div>
        )}
      </header>

      {/* iOS Install Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-zinc-200">
            <h3 className="text-base font-semibold text-zinc-900">Install EnhanceAI on iOS</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              1. Tap the <strong className="text-zinc-900">Share</strong> icon in the Safari bottom toolbar.<br />
              2. Scroll down and choose <strong className="text-zinc-900">Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

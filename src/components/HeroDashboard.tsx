import React, { useRef, useState } from 'react';
import {
  Upload,
  Play,
  Sparkles,
  Maximize2,
  Film,
  SunMedium,
  Palette,
  FastForward,
  Clock,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  FolderKanban,
  FileVideo,
} from 'lucide-react';
import { EnhancementMode, ProjectRecord, VideoMetadata } from '../types';

interface HeroDashboardProps {
  onImportFile: (file: File) => void;
  onLoadSample: () => void;
  onSelectMode: (mode: EnhancementMode) => void;
  recentProjects: ProjectRecord[];
  onOpenProject: (project: ProjectRecord) => void;
  onNavigate: (tab: 'dashboard' | 'workspace' | 'projects' | 'settings') => void;
  onOpenMobileGuide: () => void;
  isLoadingSample: boolean;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  onImportFile,
  onLoadSample,
  onSelectMode,
  recentProjects,
  onOpenProject,
  onNavigate,
  onOpenMobileGuide,
  isLoadingSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImportFile(file);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name)) {
        onImportFile(file);
      }
    }
  };

  const features = [
    {
      id: 'upscale' as EnhancementMode,
      title: 'AI Upscaling',
      description: 'Super-resolution to 1080p, 2K & 4K UHD with edge detail reconstruction.',
      icon: Maximize2,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: 'Up to 4K',
    },
    {
      id: 'anime' as EnhancementMode,
      title: 'Anime Enhancer',
      description: 'Dedicated line-art sharpening, noise removal & vibrant color booster for AMVs.',
      icon: Film,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: 'Presets',
    },
    {
      id: 'restore' as EnhancementMode,
      title: 'Video Restoration',
      description: 'Low-light recovery, compression artifact reduction, and shadow lifting.',
      icon: SunMedium,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: 'AI Denoise',
    },
    {
      id: 'color' as EnhancementMode,
      title: 'Color Correction',
      description: 'Studio color grading: exposure, temperature, tint, contrast & saturation.',
      icon: Palette,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: '10 Sliders',
    },
    {
      id: 'interpolation' as EnhancementMode,
      title: 'Frame Interpolation',
      description: 'Temporal frame synthesis simulation targeting 60 FPS & 120 FPS high-motion.',
      icon: FastForward,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: '60/120 FPS',
    },
    {
      id: 'general' as EnhancementMode,
      title: 'Video Enhancer',
      description: 'All-in-one general fidelity tuning with split before-and-after view.',
      icon: Sparkles,
      accent: 'border-zinc-200 hover:border-[#F04438]',
      badge: 'Smart Master',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden real HTML file input configured for Android file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
        className="hidden"
      />

      {/* Hero Welcome Banner Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="text-[#FF8A00] font-semibold">Android Mobile Edition</span>
            <span>·</span>
            <span>Topaz-Style Video Enhancement</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            Upscale, restore & enhance video on your phone.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Professional AI-powered video enhancement in your mobile browser. Super-resolution, anime line-art enhancement, low-light recovery, and real canvas export without requiring a computer.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary Big Red Import Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-sm rounded-xl shadow-xs active:scale-[0.98] transition-all min-h-[48px]"
            >
              <Upload className="w-4 h-4 text-white" />
              <span>Import Video from Gallery</span>
            </button>

            {/* Secondary Action: Try Reference Clip */}
            <button
              onClick={onLoadSample}
              disabled={isLoadingSample}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-sm rounded-xl transition-all min-h-[48px] disabled:opacity-60"
            >
              <Play className="w-4 h-4 text-[#FF8A00]" />
              <span>{isLoadingSample ? 'Generating Sample Reel...' : 'Try Sample Reference Clip'}</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Dropzone for tablet/desktop & file requirements notice */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#F04438] bg-red-50/50'
              : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-600">
            <Upload className="w-5 h-5 text-[#F04438]" />
            <p className="text-xs sm:text-sm font-medium text-zinc-800">
              Tap to open Android files or drag & drop clip here
            </p>
            <p className="text-[11px] text-zinc-500">
              Supports MP4, WebM, MOV · Processed locally in your browser for 100% privacy
            </p>
          </div>
        </div>
      </div>

      {/* Mode Launchers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Enhancement Studios</h2>
            <p className="text-xs text-zinc-500">Select a specialized workflow to begin enhancing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectMode(item.id);
                  onNavigate('workspace');
                }}
                className={`bg-white rounded-2xl border ${item.accent} p-5 shadow-2xs hover:shadow-sm cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between group min-h-[140px]`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#F04438] group-hover:bg-[#F04438] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#FF8A00] tracking-tight">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#F04438] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center text-xs font-semibold text-[#F04438] gap-1">
                  <span>Open Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Recent Projects</h2>
            <p className="text-xs text-zinc-500">Your recent enhancement sessions on this device</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-[#F04438] hover:underline"
          >
            View All ({recentProjects.length})
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-2">
            <FolderKanban className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-medium text-zinc-700">No saved projects yet</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Import a video or test our sample reference clip to start your first enhancement session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentProjects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-[#F04438] transition-all cursor-pointer shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                    <FileVideo className="w-5 h-5 text-[#F04438]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{proj.name}</h4>
                    <p className="text-[11px] text-zinc-500 truncate">{proj.sourceMetadata.name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-100 pt-2">
                  <span>{proj.sourceMetadata.width}x{proj.sourceMetadata.height}</span>
                  <span>·</span>
                  <span>{proj.sourceMetadata.duration.toFixed(1)}s</span>
                  <span>·</span>
                  <span className="text-[#F04438] font-medium uppercase text-[10px]">{proj.activeMode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Android Mobile Developer Info Notice Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8A00] shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">Developed 100% on Android Mobile</h4>
            <p className="text-xs text-zinc-600">
              No computer required. View our step-by-step GitHub mobile update guide & Android Chrome testing checklist.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenMobileGuide}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-xl transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Open Mobile Guide
        </button>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroDashboard } from './components/HeroDashboard';
import { VideoWorkspace } from './components/VideoWorkspace';
import { ProjectsView } from './components/ProjectsView';
import { SettingsView } from './components/SettingsView';
import { ExportModal } from './components/ExportModal';
import { AndroidMobileGuideModal } from './components/AndroidMobileGuideModal';
import {
  EnhancementMode,
  VideoMetadata,
  ColorSettings,
  UpscaleSettings,
  AnimeSettings,
  RestorationSettings,
  InterpolationSettings,
  AspectRatioOption,
  FitMode,
  ProjectRecord,
} from './types';
import { extractVideoMetadata, generateSampleTestVideo } from './utils/videoProcessor';
import {
  getStoredProjects,
  saveProject,
  deleteProject,
  renameProject,
  getStoredSettings,
  saveSettings,
} from './utils/storage';

const INITIAL_COLOR_SETTINGS: ColorSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  fade: 0,
  exposure: 0,
};

const INITIAL_UPSCALE_SETTINGS: UpscaleSettings = {
  targetResolution: '1080p',
  detailRecovery: 25,
  edgeEnhancement: 25,
  noiseReduction: 20,
  artifactReduction: 25,
  sharpness: 20,
  model: 'adaptive-neural-edge',
};

const INITIAL_ANIME_SETTINGS: AnimeSettings = {
  preset: 'clean',
  lineArtEnhance: 25,
  vibrancy: 20,
  edgeSharpness: 20,
  noiseReduction: 40,
  contrastBoost: 15,
};

const INITIAL_RESTORATION_SETTINGS: RestorationSettings = {
  preset: 'clean',
  denoise: 30,
  artifactClean: 25,
  detailBoost: 20,
  shadowLift: 20,
  highlightRecovery: 10,
  stabilization: false,
};

const INITIAL_INTERPOLATION_SETTINGS: InterpolationSettings = {
  targetFps: 60,
  mode: 'motion-adaptive',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'workspace' | 'projects' | 'settings'>('dashboard');
  const [activeMode, setActiveMode] = useState<EnhancementMode>('upscale');

  // Video state
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Settings state
  const [colorSettings, setColorSettings] = useState<ColorSettings>(INITIAL_COLOR_SETTINGS);
  const [upscaleSettings, setUpscaleSettings] = useState<UpscaleSettings>(INITIAL_UPSCALE_SETTINGS);
  const [animeSettings, setAnimeSettings] = useState<AnimeSettings>(INITIAL_ANIME_SETTINGS);
  const [restorationSettings, setRestorationSettings] = useState<RestorationSettings>(INITIAL_RESTORATION_SETTINGS);
  const [interpolationSettings, setInterpolationSettings] = useState<InterpolationSettings>(INITIAL_INTERPOLATION_SETTINGS);

  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('original');
  const [fitMode, setFitMode] = useState<FitMode>('fit');

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMobileGuideOpen, setIsMobileGuideOpen] = useState(false);

  // Persistence
  const [projects, setProjects] = useState<ProjectRecord[]>(() => getStoredProjects());
  const [appSettings, setAppSettings] = useState(() => getStoredSettings());

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const activeProjectIdRef = useRef<string | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Handle file import
  const handleImportFile = async (file: File) => {
    try {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }

      const meta = await extractVideoMetadata(file);
      setMetadata(meta);
      setVideoUrl(meta.url);

      // Create new project record
      const newProjectId = 'proj_' + Date.now();
      activeProjectIdRef.current = newProjectId;

      const newProj: ProjectRecord = {
        id: newProjectId,
        name: file.name.replace(/\.[^/.]+$/, ''),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sourceMetadata: {
          name: meta.name,
          size: meta.size,
          duration: meta.duration,
          width: meta.width,
          height: meta.height,
        },
        activeMode,
        colorSettings,
        upscaleSettings,
        animeSettings,
        restorationSettings,
        interpolationSettings,
        exportSettings: {
          resolution: upscaleSettings.targetResolution,
          fps: interpolationSettings.targetFps,
          bitrate: '5mbps',
          format: 'mp4',
          aspectRatio,
          fitMode,
          preserveAudio: true,
          filename: file.name.replace(/\.[^/.]+$/, '') + '_enhanced',
        },
      };

      saveProject(newProj);
      setProjects(getStoredProjects());

      // Switch to workspace view
      setCurrentTab('workspace');
    } catch (err) {
      alert('Unable to load video file: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Generate synthetic sample reference video
  const handleLoadSample = async () => {
    setIsLoadingSample(true);
    try {
      const { file, metadata: sampleMeta } = await generateSampleTestVideo();
      setMetadata(sampleMeta);
      setVideoUrl(sampleMeta.url);

      const newProjectId = 'proj_sample_' + Date.now();
      activeProjectIdRef.current = newProjectId;

      const sampleProj: ProjectRecord = {
        id: newProjectId,
        name: 'Sample Reference Reel',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sourceMetadata: {
          name: sampleMeta.name,
          size: sampleMeta.size,
          duration: sampleMeta.duration,
          width: sampleMeta.width,
          height: sampleMeta.height,
        },
        activeMode: 'upscale',
        colorSettings: INITIAL_COLOR_SETTINGS,
        upscaleSettings: INITIAL_UPSCALE_SETTINGS,
        animeSettings: INITIAL_ANIME_SETTINGS,
        restorationSettings: INITIAL_RESTORATION_SETTINGS,
        interpolationSettings: INITIAL_INTERPOLATION_SETTINGS,
        exportSettings: {
          resolution: '1080p',
          fps: 30,
          bitrate: '5mbps',
          format: 'mp4',
          aspectRatio: 'original',
          fitMode: 'fit',
          preserveAudio: true,
          filename: 'sample_reference_enhanced',
        },
      };

      saveProject(sampleProj);
      setProjects(getStoredProjects());
      setCurrentTab('workspace');
    } catch (err) {
      console.error('Failed to generate sample reel:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Open existing project
  const handleOpenProject = (project: ProjectRecord) => {
    activeProjectIdRef.current = project.id;
    setActiveMode(project.activeMode);
    setColorSettings(project.colorSettings || INITIAL_COLOR_SETTINGS);
    setUpscaleSettings(project.upscaleSettings || INITIAL_UPSCALE_SETTINGS);
    setAnimeSettings(project.animeSettings || INITIAL_ANIME_SETTINGS);
    setRestorationSettings(project.restorationSettings || INITIAL_RESTORATION_SETTINGS);
    setInterpolationSettings(project.interpolationSettings || INITIAL_INTERPOLATION_SETTINGS);
    if (project.exportSettings) {
      setAspectRatio(project.exportSettings.aspectRatio || 'original');
      setFitMode(project.exportSettings.fitMode || 'fit');
    }
    setCurrentTab('workspace');
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(getStoredProjects());
  };

  const handleRenameProject = (id: string, newName: string) => {
    renameProject(id, newName);
    setProjects(getStoredProjects());
  };

  const handleResetAllSettings = () => {
    setColorSettings(INITIAL_COLOR_SETTINGS);
    setUpscaleSettings(INITIAL_UPSCALE_SETTINGS);
    setAnimeSettings(INITIAL_ANIME_SETTINGS);
    setRestorationSettings(INITIAL_RESTORATION_SETTINGS);
    setInterpolationSettings(INITIAL_INTERPOLATION_SETTINGS);
    setAspectRatio('original');
    setFitMode('fit');
  };

  const handleClearAllCache = () => {
    localStorage.removeItem('enhanceai_projects_v1');
    setProjects([]);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      {/* Top Bar Contract Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasLoadedVideo={!!metadata}
        onOpenMobileGuide={() => setIsMobileGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'dashboard' && (
          <HeroDashboard
            onImportFile={handleImportFile}
            onLoadSample={handleLoadSample}
            onSelectMode={setActiveMode}
            recentProjects={projects}
            onOpenProject={handleOpenProject}
            onNavigate={setCurrentTab}
            onOpenMobileGuide={() => setIsMobileGuideOpen(true)}
            isLoadingSample={isLoadingSample}
          />
        )}

        {currentTab === 'workspace' && (
          <VideoWorkspace
            metadata={metadata}
            videoUrl={videoUrl}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            colorSettings={colorSettings}
            setColorSettings={setColorSettings}
            upscaleSettings={upscaleSettings}
            setUpscaleSettings={setUpscaleSettings}
            animeSettings={animeSettings}
            setAnimeSettings={setAnimeSettings}
            restorationSettings={restorationSettings}
            setRestorationSettings={setRestorationSettings}
            interpolationSettings={interpolationSettings}
            setInterpolationSettings={setInterpolationSettings}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            fitMode={fitMode}
            setFitMode={setFitMode}
            onOpenExport={() => setIsExportModalOpen(true)}
            onResetAllSettings={handleResetAllSettings}
            onImportNewVideo={() => setCurrentTab('dashboard')}
            onLoadSample={handleLoadSample}
            videoElementRef={videoElementRef}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
            onNewProject={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={appSettings}
            onSaveSettings={(s) => {
              setAppSettings(s);
              saveSettings(s);
            }}
            onClearAllCache={handleClearAllCache}
            onOpenMobileGuide={() => setIsMobileGuideOpen(true)}
          />
        )}
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        videoElement={videoElementRef.current}
        sourceMetadata={
          metadata
            ? {
                name: metadata.name,
                duration: metadata.duration,
                width: metadata.width,
                height: metadata.height,
                size: metadata.size,
              }
            : null
        }
        colorSettings={colorSettings}
        upscaleSettings={upscaleSettings}
        animeSettings={animeSettings}
        restorationSettings={restorationSettings}
        interpolationSettings={interpolationSettings}
        aspectRatio={aspectRatio}
        fitMode={fitMode}
        onExportSuccess={(blob, filename) => {
          // Record export action in active project if exists
          if (activeProjectIdRef.current) {
            setProjects(getStoredProjects());
          }
        }}
      />

      {/* Android Mobile Phone Guide Modal */}
      <AndroidMobileGuideModal
        isOpen={isMobileGuideOpen}
        onClose={() => setIsMobileGuideOpen(false)}
      />

      {/* Fixed Bottom Tab Bar for Android & Mobile Screen Ergonomics */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasLoadedVideo={!!metadata}
      />
    </div>
  );
}

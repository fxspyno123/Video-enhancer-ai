import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  Crop,
  Layers,
  Info,
  Maximize2,
  Film,
  SunMedium,
  Palette,
  FastForward,
  Split,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';
import {
  EnhancementMode,
  VideoMetadata,
  ColorSettings,
  UpscaleSettings,
  AnimeSettings,
  RestorationSettings,
  InterpolationSettings,
  ExportSettings,
  AspectRatioOption,
  FitMode,
  AIAnalysisResult,
} from '../types';
import { computeCSSFilters } from '../utils/videoProcessor';
import { ColorCorrectionPanel } from './EnhancementPanels/ColorCorrectionPanel';
import { UpscalePanel } from './EnhancementPanels/UpscalePanel';
import { AnimeEnhancerPanel } from './EnhancementPanels/AnimeEnhancerPanel';
import { VideoRestorationPanel } from './EnhancementPanels/VideoRestorationPanel';
import { FrameInterpolationPanel } from './EnhancementPanels/FrameInterpolationPanel';

interface VideoWorkspaceProps {
  metadata: VideoMetadata | null;
  videoUrl: string | null;
  activeMode: EnhancementMode;
  setActiveMode: (mode: EnhancementMode) => void;
  colorSettings: ColorSettings;
  setColorSettings: React.Dispatch<React.SetStateAction<ColorSettings>>;
  upscaleSettings: UpscaleSettings;
  setUpscaleSettings: React.Dispatch<React.SetStateAction<UpscaleSettings>>;
  animeSettings: AnimeSettings;
  setAnimeSettings: React.Dispatch<React.SetStateAction<AnimeSettings>>;
  restorationSettings: RestorationSettings;
  setRestorationSettings: React.Dispatch<React.SetStateAction<RestorationSettings>>;
  interpolationSettings: InterpolationSettings;
  setInterpolationSettings: React.Dispatch<React.SetStateAction<InterpolationSettings>>;
  aspectRatio: AspectRatioOption;
  setAspectRatio: (ar: AspectRatioOption) => void;
  fitMode: FitMode;
  setFitMode: (mode: FitMode) => void;
  onOpenExport: () => void;
  onResetAllSettings: () => void;
  onImportNewVideo: () => void;
  onLoadSample?: () => void;
  videoElementRef: React.RefObject<HTMLVideoElement | null>;
}

export const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({
  metadata,
  videoUrl,
  activeMode,
  setActiveMode,
  colorSettings,
  setColorSettings,
  upscaleSettings,
  setUpscaleSettings,
  animeSettings,
  setAnimeSettings,
  restorationSettings,
  setRestorationSettings,
  interpolationSettings,
  setInterpolationSettings,
  aspectRatio,
  setAspectRatio,
  fitMode,
  setFitMode,
  onOpenExport,
  onResetAllSettings,
  onImportNewVideo,
  onLoadSample,
  videoElementRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloneVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [splitPosition, setSplitPosition] = useState(50); // percentage 0-100
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(true);

  // Video initialization and decoding state
  const [isInitializing, setIsInitializing] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // AI Inspection state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Manage video loading lifecycle, error detection, and proper hardware decoder & URL cleanup
  useEffect(() => {
    setIsInitializing(true);
    setVideoError(null);
    setIsBuffering(false);
    setIsPlaying(false);
    setCurrentTime(0);

    const video = videoElementRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsInitializing(true);
      setVideoError(null);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleLoadedData = () => {
      setIsInitializing(false);
      setVideoError(null);
    };

    const handleCanPlay = () => {
      setIsInitializing(false);
      setIsBuffering(false);
      setVideoError(null);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handleSeeking = () => {
      setIsBuffering(true);
    };

    const handleSeeked = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      let errMessage = 'Unable to decode or load video file.';
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errMessage = 'Video playback was aborted.';
            break;
          case 2:
            errMessage = 'A network error interrupted the video stream.';
            break;
          case 3:
            errMessage = 'Video decoding failed (codec or container format may be incompatible).';
            break;
          case 4:
            errMessage = 'The video format or codec is not supported by your mobile browser.';
            break;
        }
      }
      setVideoError(errMessage);
      setIsInitializing(false);
      setIsBuffering(false);
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // If video is already cached and ready
    if (video.readyState >= 2) {
      setIsInitializing(false);
      setDuration(video.duration || 0);
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);

      // Hardware decoder surface and memory cleanup
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {
        // ignore
      }

      const clone = cloneVideoRef.current;
      if (clone) {
        try {
          clone.pause();
          clone.removeAttribute('src');
          clone.load();
        } catch {
          // ignore
        }
      }
    };
  }, [videoUrl, videoElementRef]);

  // Synchronize clone video playback state
  useEffect(() => {
    const clone = cloneVideoRef.current;
    const main = videoElementRef.current;
    if (!clone || !main || isInitializing || videoError) return;

    if (isPlaying && clone.paused) {
      clone.play().catch(() => {});
    } else if (!isPlaying && !clone.paused) {
      clone.pause();
    }
  }, [isPlaying, isInitializing, videoError]);

  const togglePlay = () => {
    const video = videoElementRef.current;
    if (!video || isInitializing || videoError) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = time;
    }
    if (cloneVideoRef.current) {
      cloneVideoRef.current.currentTime = time;
    }
  };

  const handleRetry = () => {
    setIsInitializing(true);
    setVideoError(null);
    if (videoElementRef.current && videoUrl) {
      videoElementRef.current.src = videoUrl;
      videoElementRef.current.load();
    }
  };

  const toggleMute = () => {
    const video = videoElementRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Split handle dragging
  const handleSplitTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPosition(percent);
  };

  // Helper for formatting time MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute CSS filter for preview
  const enhancedFilterString = computeCSSFilters(
    colorSettings,
    upscaleSettings,
    animeSettings,
    restorationSettings
  );

  // Trigger Gemini AI Video Analysis
  const runAiAnalysis = async () => {
    const video = videoElementRef.current;
    if (!video || !metadata) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Capture a clear current frame from the video
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(video.videoWidth || 1280, 1280);
      canvas.height = Math.min(video.videoHeight || 720, 720);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          metadata: {
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
            name: metadata.name,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Analysis server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.analysis) {
        setAiResult(data.analysis);

        // Auto-apply intelligent suggestions if user wishes
        if (data.analysis.recommendedMode) {
          setActiveMode(data.analysis.recommendedMode as EnhancementMode);
        }

        if (data.analysis.suggestedSettings) {
          const s = data.analysis.suggestedSettings;
          if (s.brightness !== undefined) {
            setColorSettings((prev) => ({
              ...prev,
              brightness: s.brightness || 0,
              contrast: s.contrast || 10,
              saturation: s.saturation || 10,
              sharpness: s.sharpness || 30,
            }));
          }
          if (s.detailRecovery !== undefined) {
            setUpscaleSettings((prev) => ({
              ...prev,
              detailRecovery: s.detailRecovery || 30,
              noiseReduction: s.noiseReduction || 25,
              sharpness: s.sharpness || 35,
            }));
          }
          if (data.analysis.isAnime) {
            setAnimeSettings((prev) => ({
              ...prev,
              preset: 'sharp',
              lineArtEnhance: 45,
              vibrancy: 35,
              contrastBoost: 25,
            }));
          }
        }
      }
    } catch (err: unknown) {
      console.warn('AI analysis fallback:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Unable to complete AI inspection');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Aspect ratio container CSS
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square max-h-[460px]';
      case '9:16':
        return 'aspect-[9/16] max-h-[520px]';
      case '16:9':
        return 'aspect-video max-h-[420px]';
      case '4:5':
        return 'aspect-[4/5] max-h-[480px]';
      case 'original':
      default:
        return 'aspect-video max-h-[440px]';
    }
  };

  if (!videoUrl || !metadata) {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200 p-8 text-center space-y-4">
        <Sliders className="w-10 h-10 text-zinc-300 mx-auto" />
        <h3 className="text-base font-bold text-zinc-800">No Video Loaded</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Please import a video clip from your Android phone or try our test sample clip to enter the enhancement workspace.
        </p>
        <button
          onClick={onImportNewVideo}
          className="px-5 py-2.5 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-xs rounded-xl shadow-xs"
        >
          Import Video
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-zinc-900 truncate max-w-xs">{metadata.name}</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#F04438]">
              {metadata.width}x{metadata.height}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {formatTime(metadata.duration)} duration · {(metadata.size / (1024 * 1024)).toFixed(1)} MB · {metadata.aspectRatio}
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF8A00] border border-orange-200 text-xs font-semibold rounded-xl transition-colors min-h-[38px] disabled:opacity-60"
            title="Auto-inspect video with AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>{isAnalyzing ? 'Inspecting...' : 'AI Auto-Inspect'}</span>
          </button>

          <button
            onClick={onResetAllSettings}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-xl transition-colors min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-xs rounded-xl shadow-xs active:scale-[0.98] transition-all min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* AI Inspector Result Notification Card (if triggered) */}
      {aiResult && (
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8A00]" />
              <span className="text-xs font-bold text-zinc-900">AI Quality Inspection Report</span>
            </div>
            <span className="text-xs font-semibold text-[#FF8A00]">
              Score: {aiResult.qualityScore}/100
            </span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed">{aiResult.summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600 pt-1">
            <span>Type: <strong>{aiResult.isAnime ? 'Anime / Illustration' : 'Live-Action'}</strong></span>
            <span>·</span>
            <span>Noise: <strong>{aiResult.noiseLevel}</strong></span>
            <span>·</span>
            <span>Lighting: <strong>{aiResult.lightingCondition}</strong></span>
            <span>·</span>
            <span>Recommended Preset: <strong className="text-[#F04438]">{aiResult.recommendedPreset}</strong></span>
          </div>
        </div>
      )}

      {/* Video Viewport Container */}
      <div
        ref={containerRef}
        onMouseMove={handleSplitTouchMove}
        onTouchMove={handleSplitTouchMove}
        onMouseUp={() => setIsDraggingSplit(false)}
        onTouchEnd={() => setIsDraggingSplit(false)}
        className="relative bg-zinc-950 rounded-3xl overflow-hidden shadow-md flex items-center justify-center mx-auto w-full select-none"
      >
        <div className={`relative w-full ${getAspectRatioClasses()} overflow-hidden flex items-center justify-center bg-zinc-950`}>
          {/* Main underlying Video Element */}
          <video
            ref={videoElementRef}
            src={videoUrl || undefined}
            playsInline
            muted={isMuted}
            loop
            className={`w-full h-full ${
              fitMode === 'fill' ? 'object-cover' : 'object-contain'
            }`}
            style={{
              // If split slider is off, apply enhanced filter to full video
              filter: showBeforeAfter ? undefined : enhancedFilterString,
            }}
          />

          {/* Before & After Dual Layer Split (rendered only once video is loaded and ready) */}
          {showBeforeAfter && !isInitializing && !videoError && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                clipPath: `inset(0 0 0 ${splitPosition}%)`,
              }}
            >
              {/* Filtered clone layer on the right side */}
              <video
                ref={cloneVideoRef}
                src={videoUrl || undefined}
                playsInline
                muted
                loop
                className={`w-full h-full ${
                  fitMode === 'fill' ? 'object-cover' : 'object-contain'
                }`}
                style={{
                  filter: enhancedFilterString,
                }}
              />
            </div>
          )}

          {/* Interactive Split Divider Handle (active when ready) */}
          {showBeforeAfter && !isInitializing && !videoError && (
            <div
              className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center pointer-events-auto"
              style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={() => setIsDraggingSplit(true)}
              onTouchStart={() => setIsDraggingSplit(true)}
            >
              {/* Vertical hairline divider */}
              <div className="w-0.5 h-full bg-white shadow-md" />
              {/* Draggable thumb pill */}
              <div className="absolute w-7 h-7 rounded-full bg-white text-[#F04438] shadow-md border-2 border-[#F04438] flex items-center justify-center cursor-grab active:cursor-grabbing">
                <Split className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          )}

          {/* Before & After Labels */}
          {showBeforeAfter && !isInitializing && !videoError && (
            <>
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md pointer-events-none">
                Original
              </div>
              <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-[#F04438]/90 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md pointer-events-none">
                Enhanced AI
              </div>
            </>
          )}

          {/* Tap-to-play center overlay button */}
          {!isInitializing && !videoError && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            >
              {!isPlaying && !isBuffering && (
                <div className="w-14 h-14 rounded-full bg-[#F04438]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-6 h-6 ml-1 fill-white" />
                </div>
              )}
            </div>
          )}

          {/* Buffering State Overlay */}
          {isBuffering && !isInitializing && !videoError && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-2 shadow-lg">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#F04438] border-t-transparent animate-spin" />
                <span>Buffering frames...</span>
              </div>
            </div>
          )}

          {/* Loading / Initializing State Overlay */}
          {isInitializing && !videoError && (
            <div className="absolute inset-0 z-30 bg-zinc-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-3 border-zinc-800" />
                <div className="absolute inset-0 rounded-full border-3 border-[#F04438] border-t-transparent animate-spin" />
                <Sparkles className="w-5 h-5 text-[#FF8A00] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white tracking-wide">Initializing Video Workspace...</h4>
                <p className="text-[11px] text-zinc-400 max-w-xs truncate">
                  {metadata?.name} {metadata?.width ? `(${metadata.width}x${metadata.height})` : ''}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#FF8A00] bg-orange-950/70 border border-orange-500/30 px-3 py-1 rounded-full">
                Preparing GPU Canvas Pipeline
              </span>
            </div>
          )}

          {/* Error Fallback State Card */}
          {videoError && (
            <div className="absolute inset-0 z-30 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-950/70 border border-red-500/40 text-[#F04438] flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-white">Video Initialization Failed</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{videoError}</p>
                <p className="text-[11px] text-zinc-500 pt-1">
                  Ensure the clip is an MP4 (H.264), WebM (VP8/VP9), or standard MOV supported by your mobile browser.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F04438] hover:bg-[#D92D20] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Loading</span>
                </button>
                <button
                  onClick={onImportNewVideo}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-xl transition-colors"
                >
                  Import Another File
                </button>
                {onLoadSample && (
                  <button
                    onClick={onLoadSample}
                    className="px-3.5 py-2 bg-orange-950/80 border border-orange-500/40 hover:bg-orange-900 text-[#FF8A00] text-xs font-medium rounded-xl transition-colors"
                  >
                    Load Sample Clip
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Floating Player Transport Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white space-y-1.5">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tabular-nums text-zinc-300 w-10">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 accent-[#F04438] cursor-pointer"
            />
            <span className="text-[10px] font-mono tabular-nums text-zinc-400 w-10 text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Playback action triggers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                className="p-2 hover:text-[#F04438] text-white rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 hover:text-[#F04438] text-white rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Split view toggle */}
              <button
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                  showBeforeAfter ? 'bg-[#F04438] text-white' : 'bg-black/40 text-zinc-300 hover:text-white'
                }`}
              >
                <Split className="w-3 h-3" />
                <span>Split View</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:text-[#F04438] text-white rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aspect Ratio & Fit/Fill Workspace Options Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="font-semibold text-zinc-500 mr-1 flex items-center gap-1">
            <Crop className="w-3.5 h-3.5 text-[#F04438]" /> Aspect:
          </span>
          {(['original', '16:9', '9:16', '1:1', '4:5'] as AspectRatioOption[]).map((ar) => (
            <button
              key={ar}
              onClick={() => setAspectRatio(ar)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                aspectRatio === ar
                  ? 'bg-[#F04438] text-white font-semibold shadow-2xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              {ar === 'original' ? 'Original' : ar}
            </button>
          ))}
        </div>

        {/* Fit vs Fill (Crop) */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
          <button
            onClick={() => setFitMode('fit')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              fitMode === 'fit' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            Fit (Letterbox)
          </button>
          <button
            onClick={() => setFitMode('fill')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              fitMode === 'fill' ? 'bg-white text-[#F04438] shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            Fill (Crop)
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-2 shadow-xs">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {[
            { id: 'upscale' as EnhancementMode, label: 'AI Upscaling', icon: Maximize2 },
            { id: 'anime' as EnhancementMode, label: 'Anime Studio', icon: Film },
            { id: 'restore' as EnhancementMode, label: 'Restoration', icon: SunMedium },
            { id: 'color' as EnhancementMode, label: 'Color Grading', icon: Palette },
            { id: 'interpolation' as EnhancementMode, label: 'FPS Boost', icon: FastForward },
            { id: 'general' as EnhancementMode, label: 'General AI', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#F04438] text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#F04438]'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel Container */}
        <div className="mt-4 p-4 border-t border-zinc-100">
          {activeMode === 'color' && (
            <ColorCorrectionPanel
              settings={colorSettings}
              onChange={setColorSettings}
              onReset={() =>
                setColorSettings({
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
                })
              }
            />
          )}

          {activeMode === 'upscale' && (
            <UpscalePanel
              settings={upscaleSettings}
              onChange={setUpscaleSettings}
              sourceResolution={{ width: metadata.width, height: metadata.height }}
            />
          )}

          {activeMode === 'anime' && (
            <AnimeEnhancerPanel
              settings={animeSettings}
              onChange={setAnimeSettings}
              onSetSocialAspectRatio={(ratio) => setAspectRatio(ratio)}
            />
          )}

          {activeMode === 'restore' && (
            <VideoRestorationPanel
              settings={restorationSettings}
              onChange={setRestorationSettings}
            />
          )}

          {activeMode === 'interpolation' && (
            <FrameInterpolationPanel
              settings={interpolationSettings}
              onChange={setInterpolationSettings}
              sourceFps={metadata.fps}
            />
          )}

          {activeMode === 'general' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">General Video Enhancement</h4>
                  <p className="text-[11px] text-zinc-500">All-in-one balanced clarity tuning</p>
                </div>
                <button
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F04438] text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>AI Auto-Tune</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700">Adaptive Sharpness</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{colorSettings.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={colorSettings.sharpness}
                    onChange={(e) => setColorSettings({ ...colorSettings, sharpness: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700">Contrast Optimization</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{colorSettings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={colorSettings.contrast}
                    onChange={(e) => setColorSettings({ ...colorSettings, contrast: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700">Vibrancy & Saturation</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{colorSettings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={colorSettings.saturation}
                    onChange={(e) => setColorSettings({ ...colorSettings, saturation: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700">Noise Suppression</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{restorationSettings.denoise}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={restorationSettings.denoise}
                    onChange={(e) => setRestorationSettings({ ...restorationSettings, denoise: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

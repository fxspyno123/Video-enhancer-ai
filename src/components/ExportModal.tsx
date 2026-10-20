import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  AlertCircle,
  CheckCircle2,
  FileVideo,
  Sparkles,
  RefreshCw,
  FolderDown,
  Info,
} from 'lucide-react';
import {
  ExportSettings,
  ResolutionOption,
  FpsOption,
  BitrateOption,
  OutputFormat,
  AspectRatioOption,
  FitMode,
  ColorSettings,
  UpscaleSettings,
  AnimeSettings,
  RestorationSettings,
  InterpolationSettings,
} from '../types';
import { executeVideoExport, calculateExportDimensions } from '../utils/videoProcessor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoElement: HTMLVideoElement | null;
  sourceMetadata: {
    name: string;
    duration: number;
    width: number;
    height: number;
    size: number;
  } | null;
  colorSettings: ColorSettings;
  upscaleSettings: UpscaleSettings;
  animeSettings: AnimeSettings;
  restorationSettings: RestorationSettings;
  interpolationSettings: InterpolationSettings;
  aspectRatio: AspectRatioOption;
  fitMode: FitMode;
  onExportSuccess: (blob: Blob, filename: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  videoElement,
  sourceMetadata,
  colorSettings,
  upscaleSettings,
  animeSettings,
  restorationSettings,
  interpolationSettings,
  aspectRatio,
  fitMode,
  onExportSuccess,
}) => {
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    resolution: upscaleSettings.targetResolution || '1080p',
    fps: interpolationSettings.targetFps || 30,
    bitrate: '5mbps',
    format: 'mp4',
    aspectRatio: aspectRatio,
    fitMode: fitMode,
    preserveAudio: true,
    filename: (sourceMetadata?.name.replace(/\.[^/.]+$/, '') || 'enhanced_video') + '_enhanced',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const isCancelledRef = useRef(false);

  if (!isOpen) return null;

  // Calculate estimated file size
  const duration = sourceMetadata?.duration || 10;
  let bitrateMbps = 5;
  if (exportSettings.bitrate === '2.5mbps') bitrateMbps = 2.5;
  if (exportSettings.bitrate === '10mbps') bitrateMbps = 10;
  if (exportSettings.bitrate === '20mbps') bitrateMbps = 20;

  const estimatedBytes = (bitrateMbps * 1000000 * duration) / 8;
  const estimatedMb = (estimatedBytes / (1024 * 1024)).toFixed(1);

  const targetDims = calculateExportDimensions(
    exportSettings.resolution,
    exportSettings.aspectRatio,
    sourceMetadata?.width || 1280,
    sourceMetadata?.height || 720
  );

  const startExport = async () => {
    if (!videoElement) {
      setExportError('Video element reference is not ready.');
      return;
    }

    setIsExporting(true);
    setProgressPercent(0);
    setProgressStatus('Initializing export pipeline...');
    setExportError(null);
    setExportedBlob(null);
    isCancelledRef.current = false;

    try {
      const blob = await executeVideoExport({
        sourceVideoElement: videoElement,
        exportSettings,
        colorSettings,
        upscaleSettings,
        animeSettings,
        restorationSettings,
        interpolationSettings,
        onProgress: (percent, status) => {
          setProgressPercent(percent);
          setProgressStatus(status);
        },
        isCancelled: () => isCancelledRef.current,
      });

      // Verify blob validity
      if (!blob || blob.size === 0) {
        throw new Error('Export generated an empty video file. Please check codec support.');
      }

      setExportedBlob(blob);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      const ext = exportSettings.format === 'mp4' ? 'mp4' : 'webm';
      const fullFilename = `${exportSettings.filename}.${ext}`;
      onExportSuccess(blob, fullFilename);
    } catch (err: unknown) {
      if (isCancelledRef.current) {
        setProgressStatus('Export was cancelled.');
      } else {
        const msg = err instanceof Error ? err.message : 'Export failed';
        setExportError(msg);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const cancelExport = () => {
    isCancelledRef.current = true;
    setProgressStatus('Cancelling export...');
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const ext = exportSettings.format === 'mp4' ? 'mp4' : 'webm';
    const fullFilename = `${exportSettings.filename}.${ext}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-zinc-200 max-w-lg w-full p-6 shadow-xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#F04438]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Export Enhanced Video</h3>
              <p className="text-[11px] text-zinc-500">Android-compatible render & save</p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* State 1: Export Completed & Verified */}
        {exportedBlob && downloadUrl && (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#F04438] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-zinc-900">Export Verified & Ready</h4>
              <p className="text-xs text-zinc-600">
                Your enhanced video has been rendered and verified successfully.
              </p>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4 text-left space-y-2 border border-zinc-200 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Output Dimensions:</span>
                <span className="font-bold text-zinc-900">{targetDims.width}x{targetDims.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Frame Rate:</span>
                <span className="font-bold text-zinc-900">{exportSettings.fps} FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Actual File Size:</span>
                <span className="font-bold text-zinc-900">{(exportedBlob.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Format:</span>
                <span className="font-bold text-zinc-900 uppercase">{exportSettings.format}</span>
              </div>
            </div>

            {/* Android Saving Tips */}
            <div className="bg-orange-50/70 rounded-xl p-3 text-left border border-orange-200/80 flex items-start gap-2 text-xs text-zinc-700">
              <Info className="w-4 h-4 text-[#FF8A00] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Android Tip:</strong> Tap download to save to your Android phone's <em>Downloads</em> folder. You can view it immediately or move it to your <em>DCIM/Camera</em> gallery via Google Files.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-sm rounded-xl shadow-xs active:scale-[0.98] transition-all min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>Save to Android Device</span>
              </button>

              <button
                onClick={() => {
                  setExportedBlob(null);
                  setDownloadUrl(null);
                }}
                className="w-full py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900"
              >
                Export with Different Settings
              </button>
            </div>
          </div>
        )}

        {/* State 2: Progress Screen */}
        {isExporting && (
          <div className="space-y-6 py-6 text-center">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
              <div
                className="absolute inset-0 rounded-full border-4 border-[#F04438] border-t-transparent animate-spin"
                style={{ animationDuration: '1.2s' }}
              />
              <span className="font-mono text-base font-bold text-zinc-900 tabular-nums">
                {progressPercent}%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-900">Rendering Video Frames...</h4>
              <p className="text-xs text-zinc-600 font-mono">{progressStatus}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F04438] h-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
              Please keep this screen open while your mobile browser encodes the canvas frames.
            </p>

            <button
              onClick={cancelExport}
              className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel Export
            </button>
          </div>
        )}

        {/* State 3: Export Configuration Form */}
        {!isExporting && !exportedBlob && (
          <div className="space-y-5">
            {exportError && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{exportError}</p>
              </div>
            )}

            {/* Output Resolution */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">Output Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {(['720p', '1080p', '2k', '4k', '540p', '480p'] as ResolutionOption[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => setExportSettings({ ...exportSettings, resolution: res })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all ${
                      exportSettings.resolution === res
                        ? 'border-[#F04438] bg-red-50 text-[#F04438] font-semibold'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate & Bitrate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-900 block">Frame Rate</label>
                <select
                  value={exportSettings.fps}
                  onChange={(e) =>
                    setExportSettings({
                      ...exportSettings,
                      fps: Number(e.target.value) as FpsOption,
                    })
                  }
                  className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
                >
                  <option value={24}>24 FPS (Film)</option>
                  <option value={30}>30 FPS (Standard)</option>
                  <option value={60}>60 FPS (Fluid)</option>
                  <option value={120}>120 FPS (High Speed)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-900 block">Video Bitrate</label>
                <select
                  value={exportSettings.bitrate}
                  onChange={(e) =>
                    setExportSettings({
                      ...exportSettings,
                      bitrate: e.target.value as BitrateOption,
                    })
                  }
                  className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
                >
                  <option value="2.5mbps">2.5 Mbps (Compact)</option>
                  <option value="5mbps">5.0 Mbps (Recommended)</option>
                  <option value="10mbps">10.0 Mbps (High Quality)</option>
                  <option value="20mbps">20.0 Mbps (Lossless Style)</option>
                </select>
              </div>
            </div>

            {/* Filename and Audio preservation */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-900 block">Output Filename</label>
                <input
                  type="text"
                  value={exportSettings.filename}
                  onChange={(e) =>
                    setExportSettings({ ...exportSettings, filename: e.target.value })
                  }
                  className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
                  placeholder="enhanced_video_name"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                <span className="font-medium text-zinc-800">Preserve Audio Track</span>
                <input
                  type="checkbox"
                  checked={exportSettings.preserveAudio}
                  onChange={(e) =>
                    setExportSettings({ ...exportSettings, preserveAudio: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#F04438] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Render Summary & Estimated Size */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Output Canvas:</span>
                <span className="font-semibold text-zinc-900">{targetDims.width}x{targetDims.height} ({exportSettings.aspectRatio})</span>
              </div>
              <div className="flex justify-between">
                <span>Est. File Size:</span>
                <span className="font-semibold text-zinc-900">~{estimatedMb} MB</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={startExport}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-sm rounded-xl shadow-xs active:scale-[0.98] transition-all min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-[#FF8A00]" />
                <span>Start Video Export</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

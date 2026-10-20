import React, { useState } from 'react';
import { Settings, HardDrive, ShieldCheck, HelpCircle, RefreshCw, Smartphone, Trash2 } from 'lucide-react';
import { AppSettings, calculateStorageUsage } from '../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onClearAllCache: () => void;
  onOpenMobileGuide: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onClearAllCache,
  onOpenMobileGuide,
}) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const storageInfo = calculateStorageUsage();

  const handleUpdate = (key: keyof AppSettings, val: unknown) => {
    const updated = { ...currentSettings, [key]: val };
    setCurrentSettings(updated);
    onSaveSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Application Settings</h2>
          <p className="text-xs text-zinc-500">Configure default video processing and storage preferences</p>
        </div>
        {saveToast && (
          <span className="text-xs font-semibold text-[#F04438] bg-red-50 px-3 py-1 rounded-lg animate-pulse">
            Settings Saved
          </span>
        )}
      </div>

      {/* Defaults Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider text-zinc-400">
          Export Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Default Resolution</label>
            <select
              value={currentSettings.defaultResolution}
              onChange={(e) => handleUpdate('defaultResolution', e.target.value)}
              className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="2k">2K QHD</option>
              <option value="4k">4K UHD</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Default Frame Rate</label>
            <select
              value={currentSettings.defaultFps}
              onChange={(e) => handleUpdate('defaultFps', Number(e.target.value))}
              className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
            >
              <option value={24}>24 FPS</option>
              <option value={30}>30 FPS</option>
              <option value={60}>60 FPS</option>
              <option value={120}>120 FPS</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Output Video Format</label>
            <select
              value={currentSettings.defaultFormat}
              onChange={(e) => handleUpdate('defaultFormat', e.target.value)}
              className="w-full text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#F04438]"
            >
              <option value="mp4">MP4 (H.264 / AAC)</option>
              <option value="webm">WebM (VP8 / VP9)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Storage & Device Management */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider text-zinc-400">
          Storage & Device Cache
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-[#F04438]" />
            <div>
              <p className="text-xs font-bold text-zinc-900">Local Browser Cache</p>
              <p className="text-[11px] text-zinc-500">
                {storageInfo.usedKb} KB stored · {storageInfo.projectCount} project records
              </p>
            </div>
          </div>

          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600">Clear all cache?</span>
              <button
                onClick={() => {
                  onClearAllCache();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-zinc-200 text-zinc-700 text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          )}
        </div>
      </div>

      {/* Privacy & Processing Notice */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#F04438]" />
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Privacy & Processing Guarantee
          </h3>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          EnhanceAI Studio processes your video frames directly on your device using hardware-accelerated HTML5 Canvas and Web MediaRecorder. Your full video files are never permanently stored on external servers or uploaded to public clouds.
        </p>
      </div>

      {/* Mobile Developer Guide Link */}
      <div className="bg-orange-50/70 rounded-2xl border border-orange-200 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-[#FF8A00]" />
          <div>
            <h4 className="text-xs font-bold text-zinc-900">Managing on Android Phone</h4>
            <p className="text-[11px] text-zinc-600">
              Read how to test on Android Chrome and update code via GitHub mobile web.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenMobileGuide}
          className="px-3.5 py-2 bg-white border border-orange-300 hover:border-[#FF8A00] text-zinc-800 text-xs font-semibold rounded-xl shadow-2xs shrink-0"
        >
          View Guide
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { SunMedium, CheckCircle2, Shield } from 'lucide-react';
import { RestorationSettings } from '../../types';

interface VideoRestorationPanelProps {
  settings: RestorationSettings;
  onChange: (settings: RestorationSettings) => void;
}

export const VideoRestorationPanel: React.FC<VideoRestorationPanelProps> = ({
  settings,
  onChange,
}) => {
  const presets: { id: RestorationSettings['preset']; label: string; desc: string; values: Partial<RestorationSettings> }[] = [
    {
      id: 'lowlight',
      label: 'Low-Light Recovery',
      desc: 'Lifts dark underexposed shadows while preventing noise blowout',
      values: { shadowLift: 55, denoise: 40, detailBoost: 25, artifactClean: 35, highlightRecovery: 10 },
    },
    {
      id: 'clean',
      label: 'Clean Footage',
      desc: 'Removes grain, sensor noise and banding from phone recordings',
      values: { shadowLift: 15, denoise: 60, detailBoost: 15, artifactClean: 50, highlightRecovery: 15 },
    },
    {
      id: 'detail',
      label: 'Natural Detail',
      desc: 'Subtle sharpening and contrast boost for already balanced footage',
      values: { shadowLift: 10, denoise: 20, detailBoost: 45, artifactClean: 20, highlightRecovery: 20 },
    },
    {
      id: 'old',
      label: 'Old Video Restoration',
      desc: 'Revitalizes vintage / VHS / low-res recordings with heavy deblocking',
      values: { shadowLift: 35, denoise: 70, detailBoost: 30, artifactClean: 65, highlightRecovery: 25 },
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    onChange({
      ...settings,
      preset: p.id,
      ...p.values,
    });
  };

  const updateSetting = (key: keyof RestorationSettings, val: unknown) => {
    onChange({
      ...settings,
      preset: 'custom',
      [key]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* Presets Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-900 block">Restoration Workflows</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((p) => {
            const isSelected = settings.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#F04438] bg-red-50/50 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#F04438]' : 'text-zinc-900'}`}>
                    {p.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F04438]" />}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-zinc-100 pt-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Denoising & Grain Suppression</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.denoise}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.denoise}
            onChange={(e) => updateSetting('denoise', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Shadow Lift (Underexposure)</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.shadowLift}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.shadowLift}
            onChange={(e) => updateSetting('shadowLift', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Compression Deblocking</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.artifactClean}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.artifactClean}
            onChange={(e) => updateSetting('artifactClean', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Detail Re-boost</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.detailBoost}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.detailBoost}
            onChange={(e) => updateSetting('detailBoost', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Camera Jitter & Stabilization Option */}
      <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
            <Shield className="w-3.5 h-3.5 text-[#F04438]" />
            <span>Digital Shake Dampening</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Stabilizes handheld mobile wobble during canvas playback export
          </p>
        </div>
        <button
          onClick={() => updateSetting('stabilization', !settings.stabilization)}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
            settings.stabilization ? 'bg-[#F04438]' : 'bg-zinc-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              settings.stabilization ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

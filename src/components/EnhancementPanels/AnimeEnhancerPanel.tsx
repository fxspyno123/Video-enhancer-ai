import React from 'react';
import { Film, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnimeSettings } from '../../types';

interface AnimeEnhancerPanelProps {
  settings: AnimeSettings;
  onChange: (settings: AnimeSettings) => void;
  onSetSocialAspectRatio?: (ratio: '9:16' | '16:9') => void;
}

export const AnimeEnhancerPanel: React.FC<AnimeEnhancerPanelProps> = ({
  settings,
  onChange,
  onSetSocialAspectRatio,
}) => {
  const presets: { id: AnimeSettings['preset']; label: string; desc: string; values: Partial<AnimeSettings> }[] = [
    {
      id: 'clean',
      label: 'Anime Clean',
      desc: 'Artifact smoothing with balanced lines for modern TV/web anime',
      values: { lineArtEnhance: 25, vibrancy: 20, edgeSharpness: 20, noiseReduction: 40, contrastBoost: 15 },
    },
    {
      id: 'sharp',
      label: 'Anime Sharp',
      desc: 'Ultra-crisp contour lines ideal for AMVs and high-action sequences',
      values: { lineArtEnhance: 60, vibrancy: 30, edgeSharpness: 55, noiseReduction: 25, contrastBoost: 30 },
    },
    {
      id: 'cinematic',
      label: 'Cinematic Anime',
      desc: 'Film-grade contrast with rich atmospheric color depth',
      values: { lineArtEnhance: 20, vibrancy: 15, edgeSharpness: 25, noiseReduction: 20, contrastBoost: 40 },
    },
    {
      id: 'vibrant',
      label: 'Vibrant Anime',
      desc: 'Bold saturation & pop for colorful anime shorts & edits',
      values: { lineArtEnhance: 35, vibrancy: 50, edgeSharpness: 35, noiseReduction: 30, contrastBoost: 25 },
    },
    {
      id: 'soft',
      label: 'Soft Anime',
      desc: 'Gentle aesthetic with subtle glow and smoothed cel edges',
      values: { lineArtEnhance: 10, vibrancy: 10, edgeSharpness: 10, noiseReduction: 50, contrastBoost: 5 },
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    onChange({
      ...settings,
      preset: p.id,
      ...p.values,
    });
  };

  const updateSetting = (key: keyof AnimeSettings, val: unknown) => {
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
        <label className="text-xs font-bold text-zinc-900 block">Anime Enhancement Presets</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
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

      {/* Social Media Export Target Quick Actions */}
      {onSetSocialAspectRatio && (
        <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-xs font-medium text-zinc-700">Quick Social Format:</span>
          <button
            onClick={() => onSetSocialAspectRatio('9:16')}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-300 hover:border-[#F04438] text-zinc-800 rounded-lg shadow-2xs"
          >
            TikTok / Reels (9:16)
          </button>
          <button
            onClick={() => onSetSocialAspectRatio('16:9')}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-300 hover:border-[#F04438] text-zinc-800 rounded-lg shadow-2xs"
          >
            YouTube (16:9)
          </button>
        </div>
      )}

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-zinc-100 pt-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Line-Art Sharpening</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.lineArtEnhance}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.lineArtEnhance}
            onChange={(e) => updateSetting('lineArtEnhance', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Color Vibrancy & Pop</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.vibrancy}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.vibrancy}
            onChange={(e) => updateSetting('vibrancy', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Contour Edge Sharpness</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.edgeSharpness}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.edgeSharpness}
            onChange={(e) => updateSetting('edgeSharpness', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Cel Compression Denoise</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.noiseReduction}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.noiseReduction}
            onChange={(e) => updateSetting('noiseReduction', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Anime Contrast Boost</span>
            <span className="font-mono text-zinc-900 tabular-nums">{settings.contrastBoost}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.contrastBoost}
            onChange={(e) => updateSetting('contrastBoost', Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

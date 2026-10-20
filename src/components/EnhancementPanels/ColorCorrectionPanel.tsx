import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { ColorSettings } from '../../types';

interface ColorCorrectionPanelProps {
  settings: ColorSettings;
  onChange: (settings: ColorSettings) => void;
  onReset: () => void;
}

export const ColorCorrectionPanel: React.FC<ColorCorrectionPanelProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const updateSetting = (key: keyof ColorSettings, val: number) => {
    onChange({
      ...settings,
      [key]: val,
    });
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'natural':
        onChange({
          brightness: 0,
          contrast: 6,
          saturation: 4,
          temperature: 0,
          tint: 0,
          highlights: 0,
          shadows: 4,
          sharpness: 15,
          fade: 0,
          exposure: 0,
        });
        break;
      case 'cinematic':
        onChange({
          brightness: -2,
          contrast: 18,
          saturation: 12,
          temperature: 8,
          tint: -4,
          highlights: -10,
          shadows: -5,
          sharpness: 25,
          fade: 4,
          exposure: -2,
        });
        break;
      case 'warm':
        onChange({
          brightness: 2,
          contrast: 8,
          saturation: 10,
          temperature: 25,
          tint: 2,
          highlights: 5,
          shadows: 8,
          sharpness: 10,
          fade: 0,
          exposure: 2,
        });
        break;
      case 'cool':
        onChange({
          brightness: 0,
          contrast: 10,
          saturation: 5,
          temperature: -25,
          tint: -5,
          highlights: 0,
          shadows: 0,
          sharpness: 15,
          fade: 2,
          exposure: 0,
        });
        break;
      case 'anime':
        onChange({
          brightness: 4,
          contrast: 22,
          saturation: 35,
          temperature: 5,
          tint: 0,
          highlights: 12,
          shadows: 15,
          sharpness: 45,
          fade: 0,
          exposure: 4,
        });
        break;
    }
  };

  const sliders = [
    { key: 'exposure', label: 'Exposure', min: -50, max: 50, step: 1, unit: '' },
    { key: 'brightness', label: 'Brightness', min: -50, max: 50, step: 1, unit: '' },
    { key: 'contrast', label: 'Contrast', min: -50, max: 50, step: 1, unit: '' },
    { key: 'saturation', label: 'Saturation', min: -50, max: 50, step: 1, unit: '' },
    { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'temperature', label: 'Temperature (Warm/Cool)', min: -50, max: 50, step: 1, unit: '' },
    { key: 'tint', label: 'Tint (Green/Magenta)', min: -50, max: 50, step: 1, unit: '' },
    { key: 'shadows', label: 'Shadow Lift', min: -50, max: 50, step: 1, unit: '' },
    { key: 'highlights', label: 'Highlights', min: -50, max: 50, step: 1, unit: '' },
    { key: 'fade', label: 'Fade / Matte', min: 0, max: 50, step: 1, unit: '%' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Presets bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">Presets:</span>
          {(['natural', 'cinematic', 'warm', 'cool', 'anime'] as const).map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg capitalize transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-[#F04438] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {sliders.map((s) => {
          const val = settings[s.key];
          return (
            <div key={s.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700">{s.label}</span>
                <span className="font-mono text-zinc-900 tabular-nums">
                  {val > 0 && s.min < 0 ? `+${val}` : val}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => updateSetting(s.key, Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

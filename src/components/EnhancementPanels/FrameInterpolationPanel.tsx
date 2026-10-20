import React from 'react';
import { FastForward, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { InterpolationSettings, FpsOption } from '../../types';

interface FrameInterpolationPanelProps {
  settings: InterpolationSettings;
  onChange: (settings: InterpolationSettings) => void;
  sourceFps?: number;
}

export const FrameInterpolationPanel: React.FC<FrameInterpolationPanelProps> = ({
  settings,
  onChange,
  sourceFps = 30,
}) => {
  const fpsOptions: { fps: FpsOption; label: string; desc: string; badge?: string }[] = [
    { fps: 24, label: '24 FPS', desc: 'Cinematic standard film cadence' },
    { fps: 30, label: '30 FPS', desc: 'Standard mobile/social baseline' },
    { fps: 60, label: '60 FPS', desc: 'High-fluidity action & gaming motion', badge: 'Recommended' },
    { fps: 120, label: '120 FPS', desc: 'Ultra-smooth high-refresh rate playback', badge: 'Heavy CPU' },
  ];

  const updateFps = (fps: FpsOption) => {
    onChange({
      ...settings,
      targetFps: fps,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-zinc-900">Target Output Frame Rate</span>
          <p className="text-zinc-500 text-[11px]">Interpolates intermediate motion phases</p>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 text-[11px]">Detected Source:</span>
          <span className="font-bold text-zinc-900 ml-1">{sourceFps} FPS</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {fpsOptions.map((opt) => {
          const isSelected = settings.targetFps === opt.fps;
          return (
            <button
              key={opt.fps}
              onClick={() => updateFps(opt.fps)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'border-[#F04438] bg-red-50/50 shadow-xs'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              {opt.badge && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold text-[#FF8A00]">
                  {opt.badge}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${isSelected ? 'text-[#F04438]' : 'text-zinc-900'}`}>
                  {opt.label}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Synthesis Mode */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-900 block">Interpolation Pipeline</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              id: 'motion-adaptive' as const,
              label: 'Motion-Adaptive Frame Blending',
              desc: 'Calculates inter-frame motion vectors and blends intermediate sub-frames',
            },
            {
              id: 'temporal-frame-blend' as const,
              label: 'Direct Temporal Overlap',
              desc: 'High-speed hardware frame rate expansion with ghosting mitigation',
            },
          ].map((m) => {
            const isSelected = settings.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChange({ ...settings, mode: m.id })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'border-[#F04438] bg-red-50/50 font-medium'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="font-semibold text-zinc-900">{m.label}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Warning Notice */}
      <div className="bg-amber-50 rounded-xl border border-amber-200/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-[#FF8A00] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold">Frame Rate & Resource Note</p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Converting to 60 or 120 FPS generates 2x to 4x more frames during export. On mobile devices, this will increase encoding time and resulting video file size accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};

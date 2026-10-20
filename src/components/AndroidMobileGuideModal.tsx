import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  GitBranch,
  Download,
  AlertTriangle,
  HelpCircle,
  FileText,
  UploadCloud,
} from 'lucide-react';

interface AndroidMobileGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidMobileGuideModal: React.FC<AndroidMobileGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'github' | 'saving' | 'pwa'>('checklist');

  if (!isOpen) return null;

  const checklistItems = [
    { id: 1, title: 'Android Chrome Launch', desc: 'App loads instantly with responsive touch controls and 60:30:10 theme' },
    { id: 2, title: 'Import Video File Picker', desc: 'Tapping Import opens the native Android gallery / Google Files picker' },
    { id: 3, title: 'Valid Video Selection', desc: 'Selecting an MP4/WebM/MOV correctly initializes the workspace' },
    { id: 4, title: 'Metadata Extraction', desc: 'Accurately displays duration, resolution, size and aspect ratio' },
    { id: 5, title: 'Workspace Video Playback', desc: 'Embedded player controls (play, pause, seek, volume, full screen) work' },
    { id: 6, title: 'Aspect Ratio & Fit/Fill', desc: 'Switches between Original, 1:1, 9:16, 16:9, 4:5 with letterbox or crop' },
    { id: 7, title: 'Live Adjustments & Shader', desc: 'Color sliders, anime lines, and sharpening update preview immediately' },
    { id: 8, title: 'Interactive Split Slider', desc: 'Dual-layer draggable handle compares original vs enhanced side-by-side' },
    { id: 9, title: 'Valid Export Pipeline', desc: 'Encodes canvas frames via MediaRecorder and generates verified blob' },
    { id: 10, title: 'Download to Android Phone', desc: 'Saves directly to Android Downloads folder without computer intervention' },
    { id: 11, title: 'Error & Cancel Handling', desc: 'Gracefully handles unreadable formats or cancellation requests' },
    { id: 12, title: 'Zero Silent Failures', desc: 'Shows clear progress counters, estimated sizes, and verified completion' },
    { id: 13, title: 'Strict 60:30:10 Colors', desc: '60% White, 30% Red (#F04438), 10% Orange (#FF8A00) across all screens' },
    { id: 14, title: 'One-Handed Mobile Ergonomics', desc: 'Touch hitboxes >= 44px, bottom nav bar, zero accidental off-screen clips' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-zinc-200 max-w-xl w-full p-6 shadow-xl space-y-5 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF8A00]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Android Mobile Developer Hub</h3>
              <p className="text-[11px] text-zinc-500">Managing & testing exclusively from your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'checklist' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            Testing Checklist
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'github' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            GitHub Mobile Guide
          </button>
          <button
            onClick={() => setActiveTab('saving')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'saving' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            Gallery Saving
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'pwa' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
            }`}
          >
            PWA Install
          </button>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs text-zinc-700">
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Prompt 19 requires verifying all 14 functional areas on Android Chrome:
              </p>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-zinc-900">
                        {item.id}. {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3.5 leading-relaxed">
              <h4 className="font-bold text-zinc-900 text-sm">Managing Code on GitHub Mobile Web</h4>
              <p>
                Since you do not have a computer, you can manage, edit, and commit code directly on GitHub using Chrome on Android:
              </p>

              <div className="space-y-2 border-l-2 border-[#F04438] pl-3">
                <p>
                  <strong>1. Open GitHub Repository:</strong> Navigate to your repository in Android Chrome.
                </p>
                <p>
                  <strong>2. Edit Any File:</strong> Tap any file (e.g. <code>src/types.ts</code>), tap the pencil icon (Edit) in the top-right toolbar.
                </p>
                <p>
                  <strong>3. Web Editor Shortcut:</strong> Alternatively, press or navigate to <code>github.dev/your-username/your-repo</code> in Chrome to open GitHub's mobile-compatible browser editor.
                </p>
                <p>
                  <strong>4. Commit Directly:</strong> Scroll to the bottom, enter a brief commit message, and tap <em>Commit changes</em>.
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-zinc-800">
                <strong>Deployment Note:</strong> AI Studio automatically synchronizes your changes. For external hosts like Cloud Run or Vercel, simply connect your GitHub repo and automatic continuous deployment will build on every mobile commit!
              </div>
            </div>
          )}

          {activeTab === 'saving' && (
            <div className="space-y-3.5 leading-relaxed">
              <h4 className="font-bold text-zinc-900 text-sm">Saving Exported Videos to Android Gallery</h4>
              <p>
                Modern mobile browsers cannot directly write to arbitrary OS gallery folders without explicit user permission. Here is the seamless workflow:
              </p>

              <ol className="list-decimal pl-4 space-y-1.5">
                <li>
                  In EnhanceAI Studio, tap <strong>Export Video</strong> and configure your resolution and FPS.
                </li>
                <li>
                  Once rendering finishes and verifies, tap <strong>Save to Android Device</strong>.
                </li>
                <li>
                  Android Chrome downloads the video file directly into your phone's <strong>Downloads</strong> folder.
                </li>
                <li>
                  Open the <strong>Files by Google</strong> app (pre-installed on almost all Android phones).
                </li>
                <li>
                  Tap <em>Downloads</em>, find your <code>enhanced_video.mp4</code>, tap the 3 dots, and choose <em>Move to &gt; Internal Storage &gt; DCIM &gt; Camera</em>.
                </li>
                <li>Your video will now show up in Google Photos and Gallery apps instantly!</li>
              </ol>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-3.5 leading-relaxed">
              <h4 className="font-bold text-zinc-900 text-sm">Installing as a Native-Style Android App (PWA)</h4>
              <p>
                EnhanceAI Studio is equipped with a compliant Web App Manifest and Service Worker.
              </p>

              <div className="space-y-2 border-l-2 border-[#FF8A00] pl-3">
                <p>
                  <strong>Method 1 (In-App Button):</strong> Look for the red <em>Install App</em> button in the top navigation bar and tap it.
                </p>
                <p>
                  <strong>Method 2 (Chrome Menu):</strong> In Android Chrome, tap the 3 dots in the upper right corner &gt; select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>

              <p>
                Once installed, the app launches without browser address bars, in full standalone mode with custom launcher icon.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 text-white font-semibold text-xs rounded-xl"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

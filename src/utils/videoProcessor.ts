import {
  ColorSettings,
  UpscaleSettings,
  AnimeSettings,
  RestorationSettings,
  InterpolationSettings,
  ExportSettings,
  VideoMetadata,
} from '../types';

/**
 * Extract metadata from a selected video File or Blob
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      const duration = video.duration || 0;

      // Approximate aspect ratio calculation
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(Math.round(width), Math.round(height));
      const aspectWidth = Math.round(width / divisor);
      const aspectHeight = Math.round(height / divisor);
      const aspectRatio = `${aspectWidth}:${aspectHeight}`;

      resolve({
        name: file.name,
        size: file.size,
        type: file.type || 'video/mp4',
        duration,
        width,
        height,
        aspectRatio,
        fps: 30, // Standard baseline; will adjust if detectable
        url,
        file,
      });
    };

    video.onerror = () => {
      reject(new Error('Unable to read video metadata. The format may not be supported on this browser.'));
    };
  });
}

/**
 * Generate a synthetic 8-second animated test video clip for immediate testing on mobile
 */
export async function generateSampleTestVideo(): Promise<{ file: File; metadata: VideoMetadata }> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const fps = 30;
  const durationSec = 6;
  const totalFrames = fps * durationSec;

  const stream = canvas.captureStream(fps);

  // Setup synthetic audio synth tone
  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  osc.connect(gain);
  gain.connect(dest);
  osc.start();

  // Combine video and audio tracks
  const combinedStream = new MediaStream([
    ...stream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  let mimeType = 'video/webm;codecs=vp8';
  if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
    mimeType = 'video/mp4;codecs=avc1';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    mimeType = 'video/webm;codecs=vp9';
  } else if (MediaRecorder.isTypeSupported('video/webm')) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(combinedStream, { mimeType });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = frame / totalFrames;
    const timeSec = frame / fps;

    // Background gradient: dynamic sunrise to sunset
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#334155');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // Grid lines for edge sharpness test
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Anime character style silhouette / illustration test card
    ctx.save();
    ctx.translate(640, 360);
    const pulse = 1 + 0.08 * Math.sin(timeSec * 4);
    ctx.scale(pulse, pulse);

    // Glowing core
    const coreGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
    coreGrad.addColorStop(0, '#f04438');
    coreGrad.addColorStop(0.7, '#ff8a00');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 180, 0, Math.PI * 2);
    ctx.fill();

    // Geometric anime test emblem
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating triangles
    ctx.rotate(timeSec);
    ctx.strokeStyle = '#ff8a00';
    ctx.lineWidth = 6;
    ctx.strokeRect(-50, -50, 100, 100);
    ctx.restore();

    // Foreground typography and resolution benchmarks
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EnhanceAI Studio — Test Reference Reel', 640, 100);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px monospace';
    ctx.fillText(`Frame ${frame + 1}/${totalFrames} · ${(timeSec).toFixed(2)}s · 1280x720 30FPS`, 640, 140);

    // Low-light / contrast test strip
    ctx.fillStyle = '#000000';
    ctx.fillRect(140, 580, 1000, 48);
    for (let i = 0; i < 10; i++) {
      const lum = Math.round((i / 9) * 255);
      ctx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
      ctx.fillRect(140 + i * 100, 580, 100, 48);
    }

    // Wait a frame tick
    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  recorder.stop();
  osc.stop();
  await audioCtx.close();

  const blob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  const file = new File([blob], 'sample_reference_clip.mp4', { type: mimeType });
  const metadata = await extractVideoMetadata(file);
  return { file, metadata };
}

/**
 * Computes CSS filter string based on applied color, upscale, anime, and restoration settings
 */
export function computeCSSFilters(
  color: ColorSettings,
  upscale: UpscaleSettings,
  anime: AnimeSettings,
  restore: RestorationSettings
): string {
  // Brightness: base 100% + color.brightness + restore.shadowLift * 0.3
  const b = Math.max(0, 100 + color.brightness + (restore.shadowLift * 0.3));
  // Contrast: base 100% + color.contrast + anime.contrastBoost * 0.25
  const c = Math.max(0, 100 + color.contrast + (anime.contrastBoost * 0.25));
  // Saturation: base 100% + color.saturation + anime.vibrancy * 0.3
  const s = Math.max(0, 100 + color.saturation + (anime.vibrancy * 0.3));

  // Temperature & Tint emulation via sepia, hue-rotate
  const temp = color.temperature; // warm (>0) or cool (<0)
  const sepia = Math.max(0, temp * 0.4);
  const hueRotate = color.tint * 0.8; // degrees

  // Exposure adjustments
  const exposureMult = 1 + (color.exposure / 100) * 0.5;

  return `brightness(${((b / 100) * exposureMult).toFixed(2)}) contrast(${(c / 100).toFixed(2)}) saturate(${(s / 100).toFixed(2)}) sepia(${sepia.toFixed(2)}%) hue-rotate(${hueRotate.toFixed(1)}deg)`;
}

/**
 * Apply 2D convolution kernel (e.g. Unsharp Mask for sharpness & anime line art boost)
 */
export function applyConvolutionSharpness(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sharpness: number, // 0 to 100
  lineArtBoost: number // 0 to 100
) {
  if (sharpness <= 0 && lineArtBoost <= 0) return;

  const totalSharpness = (sharpness * 0.015) + (lineArtBoost * 0.02);
  if (totalSharpness <= 0) return;

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // 3x3 Laplacian edge enhancement kernel:
    // [  0, -k,  0 ]
    // [ -k, 1+4k, -k ]
    // [  0, -k,  0 ]
    const k = Math.min(1.2, totalSharpness * 0.5);
    const center = 1 + 4 * k;

    const w4 = width * 4;

    // Scan interior pixels
    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * w4;
      for (let x = 1; x < width - 1; x++) {
        const idx = rowOffset + (x * 4);

        for (let c = 0; c < 3; c++) {
          const val =
            copy[idx + c] * center -
            (copy[idx - 4 + c] +
              copy[idx + 4 + c] +
              copy[idx - w4 + c] +
              copy[idx + w4 + c]) *
              k;
          data[idx + c] = Math.max(0, Math.min(255, val));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If cross-origin or canvas security prevents pixel manipulation, gracefully skip
  }
}

/**
 * Calculate target export dimensions based on resolution option and aspect ratio
 */
export function calculateExportDimensions(
  resolution: ExportSettings['resolution'],
  aspectRatio: ExportSettings['aspectRatio'],
  sourceWidth: number,
  sourceHeight: number
): { width: number; height: number } {
  let baseLongEdge = 1920;
  switch (resolution) {
    case '480p':
      baseLongEdge = 854;
      break;
    case '540p':
      baseLongEdge = 960;
      break;
    case '720p':
      baseLongEdge = 1280;
      break;
    case '1080p':
      baseLongEdge = 1920;
      break;
    case '2k':
      baseLongEdge = 2560;
      break;
    case '4k':
      baseLongEdge = 3840;
      break;
    case 'original':
    default:
      baseLongEdge = Math.max(sourceWidth, sourceHeight);
      break;
  }

  let ratioW = sourceWidth;
  let ratioH = sourceHeight;

  if (aspectRatio === '1:1') {
    ratioW = 1;
    ratioH = 1;
  } else if (aspectRatio === '9:16') {
    ratioW = 9;
    ratioH = 16;
  } else if (aspectRatio === '16:9') {
    ratioW = 16;
    ratioH = 9;
  } else if (aspectRatio === '4:5') {
    ratioW = 4;
    ratioH = 5;
  }

  let targetW: number;
  let targetH: number;

  if (ratioW >= ratioH) {
    targetW = baseLongEdge;
    targetH = Math.round((baseLongEdge * ratioH) / ratioW);
  } else {
    targetH = baseLongEdge;
    targetW = Math.round((baseLongEdge * ratioW) / ratioH);
  }

  // Ensure even dimensions for video codecs
  targetW = Math.round(targetW / 2) * 2;
  targetH = Math.round(targetH / 2) * 2;

  return { width: targetW, height: targetH };
}

/**
 * Export execution pipeline: captures video element through an offscreen Canvas
 * with applied color filters, super-resolution sharpness, aspect crop, and audio stream,
 * saving as a real downloadable video file.
 */
export async function executeVideoExport({
  sourceVideoElement,
  exportSettings,
  colorSettings,
  upscaleSettings,
  animeSettings,
  restorationSettings,
  interpolationSettings,
  onProgress,
  isCancelled,
}: {
  sourceVideoElement: HTMLVideoElement;
  exportSettings: ExportSettings;
  colorSettings: ColorSettings;
  upscaleSettings: UpscaleSettings;
  animeSettings: AnimeSettings;
  restorationSettings: RestorationSettings;
  interpolationSettings: InterpolationSettings;
  onProgress: (percent: number, statusText: string) => void;
  isCancelled: () => boolean;
}): Promise<Blob> {
  const sourceWidth = sourceVideoElement.videoWidth || 1280;
  const sourceHeight = sourceVideoElement.videoHeight || 720;
  const duration = sourceVideoElement.duration || 5;

  const { width: targetWidth, height: targetHeight } = calculateExportDimensions(
    exportSettings.resolution,
    exportSettings.aspectRatio,
    sourceWidth,
    sourceHeight
  );

  onProgress(5, `Preparing ${targetWidth}x${targetHeight} canvas workspace...`);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const targetFps = exportSettings.fps || 30;
  const canvasStream = canvas.captureStream(targetFps);

  // Setup audio stream if preservation requested
  let combinedStream = canvasStream;

  if (exportSettings.preserveAudio) {
    try {
      // Check if video element has captureStream
      const videoStream = (sourceVideoElement as unknown as { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream }).captureStream
        ? (sourceVideoElement as unknown as { captureStream: () => MediaStream }).captureStream()
        : null;

      if (videoStream && videoStream.getAudioTracks().length > 0) {
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...videoStream.getAudioTracks(),
        ]);
      }
    } catch {
      // Audio capture fallback: standard video canvas stream without separate audio
    }
  }

  // Determine optimal supported MIME type
  let chosenMime = 'video/webm;codecs=vp8';
  if (exportSettings.format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
    chosenMime = 'video/mp4;codecs=avc1';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    chosenMime = 'video/webm;codecs=vp9';
  } else if (MediaRecorder.isTypeSupported('video/webm')) {
    chosenMime = 'video/webm';
  }

  // Bitrate estimation
  let bitrateBps = 5000000; // 5 Mbps default
  if (exportSettings.bitrate === '2.5mbps') bitrateBps = 2500000;
  if (exportSettings.bitrate === '10mbps') bitrateBps = 10000000;
  if (exportSettings.bitrate === '20mbps') bitrateBps = 20000000;

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: chosenMime,
    videoBitsPerSecond: bitrateBps,
  });

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const cssFilter = computeCSSFilters(colorSettings, upscaleSettings, animeSettings, restorationSettings);

  // Calculate cropping coordinates for Fit vs Fill mode
  const srcRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  let drawSrcX = 0;
  let drawSrcY = 0;
  let drawSrcW = sourceWidth;
  let drawSrcH = sourceHeight;

  if (exportSettings.fitMode === 'fill') {
    if (srcRatio > targetRatio) {
      drawSrcW = sourceHeight * targetRatio;
      drawSrcX = (sourceWidth - drawSrcW) / 2;
    } else {
      drawSrcH = sourceWidth / targetRatio;
      drawSrcY = (sourceHeight - drawSrcH) / 2;
    }
  }

  onProgress(10, 'Starting frame rendering pipeline...');

  // Reset video position to start
  sourceVideoElement.pause();
  sourceVideoElement.currentTime = 0;

  await new Promise((r) => {
    sourceVideoElement.onseeked = () => r(null);
  });

  recorder.start(100);

  const startTime = performance.now();
  let lastProgressUpdate = 0;

  // Render loop
  await new Promise<void>((resolve, reject) => {
    sourceVideoElement.play();

    const checkInterval = setInterval(() => {
      if (isCancelled()) {
        clearInterval(checkInterval);
        sourceVideoElement.pause();
        recorder.stop();
        reject(new Error('Export cancelled by user'));
        return;
      }

      const currentTime = sourceVideoElement.currentTime;
      const progressRatio = Math.min(1, currentTime / (duration || 1));
      const percent = Math.min(95, Math.round(15 + progressRatio * 80));

      if (performance.now() - lastProgressUpdate > 300) {
        lastProgressUpdate = performance.now();
        onProgress(percent, `Processing: ${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s (${percent}%)`);
      }

      // Draw frame to canvas with filters
      ctx.filter = cssFilter;
      ctx.drawImage(
        sourceVideoElement,
        drawSrcX,
        drawSrcY,
        drawSrcW,
        drawSrcH,
        0,
        0,
        targetWidth,
        targetHeight
      );
      ctx.filter = 'none';

      // Apply sharpness/line-art convolution if requested
      const totalSharp = upscaleSettings.sharpness || colorSettings.sharpness;
      const lineArt = animeSettings.lineArtEnhance;
      if (totalSharp > 10 || lineArt > 10) {
        applyConvolutionSharpness(ctx, targetWidth, targetHeight, totalSharp, lineArt);
      }

      if (sourceVideoElement.ended || currentTime >= duration - 0.1) {
        clearInterval(checkInterval);
        sourceVideoElement.pause();
        setTimeout(() => {
          onProgress(98, 'Finalizing video container...');
          recorder.stop();
        }, 300);
      }
    }, 1000 / targetFps);

    recorder.onstop = () => {
      resolve();
    };

    recorder.onerror = (e) => {
      clearInterval(checkInterval);
      reject(e);
    };
  });

  onProgress(100, 'Export complete!');

  return new Blob(recordedChunks, { type: chosenMime });
}

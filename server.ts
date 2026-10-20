import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const port = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI SDK with standard User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Video Quality Analysis & Intelligent Tuning API Endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { imageBase64, metadata } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 frame' });
    }

    // Clean base64 data
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!aiClient) {
      // Heuristic fallback if API key is not configured
      const isLowRes = metadata && metadata.height && metadata.height < 720;
      return res.json({
        analysis: {
          isAnime: false,
          qualityScore: isLowRes ? 58 : 75,
          noiseLevel: isLowRes ? 'Moderate' : 'Low',
          lightingCondition: 'Normal',
          compressionArtifacts: isLowRes ? 'Noticeable blocks' : 'Low',
          recommendedMode: isLowRes ? 'upscale' : 'general',
          recommendedPreset: isLowRes ? 'Detail Recovery' : 'Natural Balance',
          suggestedSettings: {
            brightness: 0,
            contrast: 8,
            saturation: 6,
            sharpness: 25,
            noiseReduction: isLowRes ? 35 : 15,
            detailRecovery: isLowRes ? 40 : 20,
          },
          summary: 'Local heuristic analysis: Video has standard lighting. Recommended moderate sharpness and subtle edge contrast boost.',
        },
      });
    }

    const promptText = `
You are an expert video restoration and enhancement engineer for Topaz Video AI style tools.
Analyze this video frame screenshot. Source metadata: ${JSON.stringify(metadata || {})}.

Evaluate:
1. Is it Anime/Animation/Illustration or Live-action/Real-world?
2. Estimate quality score (1-100).
3. Detect noise level: "None", "Low", "Moderate", "Heavy".
4. Detect lighting: "Underexposed / Low-Light", "Overexposed", "Normal", "Flat".
5. Detect compression artifacts: "None", "Low", "Noticeable blocks", "Severe banding".
6. Recommend primary mode: "anime" (if animation), "restore" (if noisy or low-light), "upscale" (if low resolution), "color" (if washed out), or "general".
7. Recommend preset name (e.g. "Anime Clean", "Low-Light Recovery", "Natural Detail", "Cinematic Sharp").
8. Suggest optimal integer slider values:
   - brightness (-50 to 50)
   - contrast (-50 to 50)
   - saturation (-50 to 50)
   - sharpness (0 to 100)
   - noiseReduction (0 to 100)
   - detailRecovery (0 to 100)
9. Provide a concise 2-sentence explanation of what to improve.

Respond in strict JSON with keys:
{
  "isAnime": boolean,
  "qualityScore": number,
  "noiseLevel": string,
  "lightingCondition": string,
  "compressionArtifacts": string,
  "recommendedMode": string,
  "recommendedPreset": string,
  "suggestedSettings": {
    "brightness": number,
    "contrast": number,
    "saturation": number,
    "sharpness": number,
    "noiseReduction": number,
    "detailRecovery": number
  },
  "summary": string
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ analysis: parsed });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Video analysis error:', errorMsg);
    return res.status(500).json({
      error: 'Failed to analyze video frame',
      details: errorMsg,
    });
  }
});

// App configuration & environment route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    appName: 'EnhanceAI Studio',
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`EnhanceAI Studio server running on http://0.0.0.0:${port}`);
  });
}

startServer();

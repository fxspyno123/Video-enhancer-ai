import { ProjectRecord, ExportSettings, ColorSettings, UpscaleSettings, AnimeSettings, RestorationSettings, InterpolationSettings } from '../types';

const STORAGE_KEY_PROJECTS = 'enhanceai_projects_v1';
const STORAGE_KEY_SETTINGS = 'enhanceai_settings_v1';

export interface AppSettings {
  defaultResolution: string;
  defaultFps: number;
  defaultFormat: string;
  autoSaveProjects: boolean;
  theme: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultResolution: '1080p',
  defaultFps: 30,
  defaultFormat: 'mp4',
  autoSaveProjects: true,
  theme: 'light',
};

export function getStoredProjects(): ProjectRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProject(project: ProjectRecord): void {
  try {
    const projects = getStoredProjects();
    const existingIdx = projects.findIndex((p) => p.id === project.id);
    if (existingIdx >= 0) {
      projects[existingIdx] = { ...project, updatedAt: Date.now() };
    } else {
      projects.unshift(project);
    }
    // Limit stored projects to 20 to prevent localStorage exhaustion
    const trimmed = projects.slice(0, 20);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save project to localStorage:', err);
  }
}

export function deleteProject(id: string): void {
  try {
    const projects = getStoredProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to delete project:', err);
  }
}

export function renameProject(id: string, newName: string): void {
  try {
    const projects = getStoredProjects().map((p) => {
      if (p.id === id) {
        return { ...p, name: newName, updatedAt: Date.now() };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to rename project:', err);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function calculateStorageUsage(): { usedKb: number; projectCount: number } {
  try {
    const rawProjects = localStorage.getItem(STORAGE_KEY_PROJECTS) || '';
    const rawSettings = localStorage.getItem(STORAGE_KEY_SETTINGS) || '';
    const totalBytes = (rawProjects.length + rawSettings.length) * 2;
    const projects = getStoredProjects();
    return {
      usedKb: Math.round(totalBytes / 1024),
      projectCount: projects.length,
    };
  } catch {
    return { usedKb: 0, projectCount: 0 };
  }
}

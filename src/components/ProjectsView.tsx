import React, { useState } from 'react';
import { FolderKanban, Play, Trash2, Edit3, Check, X, FileVideo, Plus } from 'lucide-react';
import { ProjectRecord } from '../types';

interface ProjectsViewProps {
  projects: ProjectRecord[];
  onOpenProject: (project: ProjectRecord) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onRenameProject,
  onNewProject,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startRename = (project: ProjectRecord) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveRename = (id: string) => {
    if (editName.trim()) {
      onRenameProject(id, editName.trim());
    }
    setEditingId(null);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">My Projects</h2>
          <p className="text-xs text-zinc-500">Saved sessions and enhancement configurations</p>
        </div>
        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#F04438] hover:bg-[#D92D20] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors min-h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-3">
          <FolderKanban className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-800">No Projects Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            When you import a video or adjust settings, your project state is automatically saved here so you can revisit it later.
          </p>
          <button
            onClick={onNewProject}
            className="mt-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Import Video Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#F04438] shrink-0">
                    <FileVideo className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    {editingId === project.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-xs font-bold bg-zinc-50 border border-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-[#F04438]"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(project.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-zinc-400 hover:bg-zinc-100 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 truncate">{project.name}</h4>
                        <button
                          onClick={() => startRename(project)}
                          className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
                          title="Rename project"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {project.sourceMetadata.name}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#FF8A00] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md shrink-0">
                  {project.activeMode}
                </span>
              </div>

              {/* Unboxed metadata row with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                <span>{project.sourceMetadata.width}x{project.sourceMetadata.height}</span>
                <span aria-hidden="true">·</span>
                <span>{project.sourceMetadata.duration.toFixed(1)}s</span>
                <span aria-hidden="true">·</span>
                <span>{(project.sourceMetadata.size / (1024 * 1024)).toFixed(1)} MB</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onOpenProject(project)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F04438] hover:bg-[#D92D20] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Open in Workspace</span>
                </button>

                {deleteConfirmId === project.id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-red-600 font-medium">Delete?</span>
                    <button
                      onClick={() => {
                        onDeleteProject(project.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-2 py-1 bg-red-600 text-white text-[11px] font-semibold rounded-md"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 bg-zinc-200 text-zinc-700 text-[11px] rounded-md"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

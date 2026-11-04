import React, { useState } from 'react';
import { 
  Database, 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Check, 
  Copy, 
  Code2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAR } from '../../context/ARContext';
import { ARScenePreset } from '../../types/ar';

export const ScenePersistence: React.FC = () => {
  const { 
    primitives, 
    savedScenes, 
    saveCurrentScene, 
    loadScenePreset, 
    exportJSON, 
    importJSON 
  } = useAR();

  const [sceneNameInput, setSceneNameInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneNameInput.trim()) return;
    saveCurrentScene(sceneNameInput);
    setSceneNameInput('');
  };

  const handleCopyJSON = () => {
    const jsonStr = exportJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ar_scene_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!jsonInput.trim()) return;
    const success = importJSON(jsonInput);
    if (success) {
      setImportStatus('SCENE IMPORTED SUCCESSFULLY');
      setJsonInput('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('ERROR: INVALID SCENE JSON SCHEMA');
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  return (
    <section id="persistence" className="py-24 border-t border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-3">
              <Database className="w-4 h-4 text-phosphor-teal" />
              <span>PERSISTENCE SERVICE // PERSISTENCESERVICE.CS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              Scene Persistence & Schema Bridge
            </h2>
          </div>
          <p className="text-sm text-titanium-400 max-w-md font-mono">
            Full JSON serialization matching Unity persistent data storage format. Save, swap industrial environment presets, and export cross-platform scene payloads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Saved Scenes & Preset Selector */}
          <div className="lg:col-span-6 surface-monograph rounded-3xl p-6 sm:p-8 border-hairline flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-phosphor-teal" />
                ENVIRONMENT SCENE PRESETS
              </h3>
              <span className="text-xs font-mono text-titanium-500">
                {savedScenes.length} AVAILABLE
              </span>
            </div>

            {/* Presets List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {savedScenes.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-2xl bg-obsidian-900/90 border-hairline hover:border-phosphor-teal/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-phosphor-teal transition-colors">
                        {preset.name}
                      </span>
                      {preset.id.startsWith('preset-') && (
                        <span className="text-[9px] font-mono uppercase bg-obsidian-800 text-phosphor-teal px-1.5 py-0.5 rounded border-hairline">
                          OFFICIAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-titanium-400 mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                    <div className="text-[11px] font-mono text-titanium-500 mt-2">
                      {preset.objects.length} SPATIAL OBJECTS
                    </div>
                  </div>

                  <button
                    onClick={() => loadScenePreset(preset)}
                    className="btn-tactile px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-phosphor-teal hover:text-obsidian-950 text-xs font-mono font-semibold text-white border-hairline transition-all shrink-0"
                  >
                    LOAD SCENE
                  </button>
                </div>
              ))}
            </div>

            {/* Save Current Scene Form */}
            <form onSubmit={handleSave} className="pt-4 border-t border-obsidian-700/60">
              <span className="text-xs font-mono text-titanium-400 block mb-2">
                SAVE ACTIVE WORKSPACE ({primitives.length} OBJECTS)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Scene designation (e.g. Test Unit Alpha)"
                  value={sceneNameInput}
                  onChange={(e) => setSceneNameInput(e.target.value)}
                  className="flex-1 bg-obsidian-900/90 border-hairline rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-titanium-500 focus:outline-none focus:border-phosphor-teal/60"
                />
                <button
                  type="submit"
                  disabled={!sceneNameInput.trim()}
                  className="btn-tactile px-4 py-2.5 rounded-xl bg-phosphor-teal text-obsidian-950 text-xs font-mono font-bold hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live JSON Schema Exporter & Importer */}
          <div className="lg:col-span-6 surface-monograph-elevated rounded-3xl p-6 sm:p-8 border-hairline shadow-optical flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-phosphor-teal" />
                <h3 className="text-lg font-bold text-white font-mono">
                  UNITY JSON SERIALIZER
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJSON}
                  className="btn-tactile px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-xs font-mono text-titanium-200 border-hairline flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-phosphor-teal" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="btn-tactile px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-xs font-mono text-titanium-200 border-hairline flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT .JSON</span>
                </button>
              </div>
            </div>

            {/* Readout of current serialized state */}
            <div>
              <span className="text-[10px] font-mono text-titanium-500 uppercase tracking-widest block mb-2">
                LIVE SERIALIZATION STREAM // PERSISTENCESERVICE SCHEMA
              </span>
              <pre className="bg-obsidian-950 p-4 rounded-2xl border-hairline text-[11px] font-mono text-phosphor-teal/90 overflow-x-auto max-h-56 leading-relaxed select-all">
                {exportJSON()}
              </pre>
            </div>

            {/* JSON Importer */}
            <div className="pt-4 border-t border-obsidian-700/60">
              <span className="text-xs font-mono text-titanium-400 block mb-2">
                IMPORT JSON PAYLOAD
              </span>
              <textarea
                rows={3}
                placeholder="Paste Unity-compatible AR scene JSON payload..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-obsidian-900/90 border-hairline rounded-xl p-3 text-xs font-mono text-white placeholder-titanium-500 focus:outline-none focus:border-phosphor-teal/60 mb-2 resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={handleImportSubmit}
                  disabled={!jsonInput.trim()}
                  className="btn-tactile px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-xs font-mono font-semibold text-white border-hairline flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Upload className="w-4 h-4 text-phosphor-teal" />
                  <span>RESTORE SCENE</span>
                </button>
                {importStatus && (
                  <span className={`text-xs font-mono ${
                    importStatus.startsWith('ERROR') ? 'text-phosphor-red' : 'text-phosphor-teal'
                  }`}>
                    {importStatus}
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

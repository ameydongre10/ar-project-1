import React from 'react';
import { 
  Box, 
  Circle, 
  Cylinder as CylinderIcon, 
  Pill, 
  Square, 
  Grid3X3, 
  Eye, 
  Layers, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { useAR } from '../../context/ARContext';
import { PrimitiveType } from '../../types/ar';
import { QuestXRButton } from './QuestXRControls';

export const PrimitiveToolbar: React.FC = () => {
  const { 
    addPrimitive, 
    primitives, 
    clearScene,
    shadingMode, 
    setShadingMode, 
    gridVisible, 
    setGridVisible 
  } = useAR();

  const PRIMITIVE_ACTIONS: { type: PrimitiveType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { type: 'cube', label: 'Cube', icon: <Box className="w-4 h-4" />, shortcut: 'C' },
    { type: 'sphere', label: 'Sphere', icon: <Circle className="w-4 h-4" />, shortcut: 'S' },
    { type: 'cylinder', label: 'Cylinder', icon: <CylinderIcon className="w-4 h-4" />, shortcut: 'Y' },
    { type: 'capsule', label: 'Capsule', icon: <Pill className="w-4 h-4" />, shortcut: 'P' },
    { type: 'plane', label: 'Plane', icon: <Square className="w-4 h-4" />, shortcut: 'L' },
  ];

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
      {/* Primitive Spawner Group */}
      <div className="surface-monograph px-2 py-1.5 rounded-xl flex items-center gap-1 border-hairline">
        <span className="text-[10px] font-mono text-titanium-400 uppercase tracking-widest px-2 font-semibold">
          Spawn
        </span>
        <div className="h-4 w-px bg-obsidian-700 mx-1" />
        {PRIMITIVE_ACTIONS.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => addPrimitive(type)}
            title={`Spawn ${label}`}
            className="btn-tactile flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-titanium-300 hover:text-white hover:bg-obsidian-700/80 active:bg-obsidian-600 transition-colors"
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Viewport Shading & Grid Toggle */}
      <div className="surface-monograph px-2 py-1.5 rounded-xl flex items-center gap-1 border-hairline">
        <button
          onClick={() => setGridVisible(!gridVisible)}
          title="Toggle Reference Grid"
          className={`btn-tactile p-1.5 rounded-lg text-xs transition-colors ${
            gridVisible ? 'text-phosphor-teal bg-obsidian-800' : 'text-titanium-500 hover:text-titanium-300'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-obsidian-700 mx-1" />

        <button
          onClick={() => setShadingMode('pbr')}
          className={`btn-tactile px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
            shadingMode === 'pbr' ? 'text-white bg-obsidian-700 font-medium' : 'text-titanium-500 hover:text-titanium-300'
          }`}
        >
          PBR
        </button>
        <button
          onClick={() => setShadingMode('wireframe')}
          className={`btn-tactile px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
            shadingMode === 'wireframe' ? 'text-phosphor-teal bg-obsidian-700 font-medium' : 'text-titanium-500 hover:text-titanium-300'
          }`}
        >
          Wire
        </button>
        <button
          onClick={() => setShadingMode('xray')}
          className={`btn-tactile px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
            shadingMode === 'xray' ? 'text-phosphor-amber bg-obsidian-700 font-medium' : 'text-titanium-500 hover:text-titanium-300'
          }`}
        >
          X-Ray
        </button>
      </div>

      {/* Meta Quest WebXR 1-Click Button */}
      <QuestXRButton variant="toolbar" />

      {/* Clear Scene Button */}
      {primitives.length > 0 && (
        <button
          onClick={clearScene}
          title="Clear Scene"
          className="surface-monograph btn-tactile p-2 rounded-xl text-titanium-400 hover:text-phosphor-red hover:bg-obsidian-800/80 border-hairline transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

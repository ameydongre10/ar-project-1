import React from 'react';
import { 
  X, 
  Trash2, 
  Sliders, 
  Layers, 
  Palette, 
  Activity, 
  Copy,
  ChevronRight
} from 'lucide-react';
import { useAR } from '../../context/ARContext';
import { MaterialType } from '../../types/ar';

export const ObjectInspector: React.FC = () => {
  const { 
    selectedPrimitive, 
    updatePrimitive, 
    removePrimitive, 
    selectPrimitive,
    addPrimitive 
  } = useAR();

  if (!selectedPrimitive) {
    return (
      <div className="surface-monograph p-4 rounded-2xl border-hairline w-72 pointer-events-auto">
        <div className="flex items-center gap-2 text-titanium-400 text-xs font-mono mb-2">
          <Sliders className="w-4 h-4 text-phosphor-teal" />
          <span>INSPECTOR // IDLE</span>
        </div>
        <p className="text-xs text-titanium-400/80 leading-relaxed">
          Select any 3D primitive in the spatial viewport to calibrate position, optical materials, and physics.
        </p>
      </div>
    );
  }

  const p = selectedPrimitive;

  const COLOR_SWATCHES = [
    '#00F5D4', // Phosphor Teal
    '#FFB703', // Industrial Amber
    '#FB5607', // Safety Orange
    '#00BBF9', // Quantum Cyan
    '#E4E4E8', // Titanium Neutral
    '#8338EC', // Ultraviolet
  ];

  const MATERIALS: { type: MaterialType; label: string }[] = [
    { type: 'titanium', label: 'Titanium' },
    { type: 'glass', label: 'Optical Glass' },
    { type: 'matte', label: 'Matte Composite' },
    { type: 'phosphor', label: 'Phosphor Emit' },
    { type: 'wireframe', label: 'Grid Wire' },
  ];

  return (
    <div className="surface-monograph-elevated p-4 rounded-2xl border-hairline w-80 max-h-[85vh] overflow-y-auto pointer-events-auto shadow-optical">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-obsidian-700/60 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-phosphor-teal animate-pulse" />
          <input
            type="text"
            value={p.name}
            onChange={(e) => updatePrimitive(p.id, { name: e.target.value })}
            className="bg-transparent font-mono text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-phosphor-teal/40 rounded px-1"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => removePrimitive(p.id)}
            title="Delete primitive"
            className="p-1 rounded-md text-titanium-400 hover:text-phosphor-red hover:bg-obsidian-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => selectPrimitive(null)}
            title="Close inspector"
            className="p-1 rounded-md text-titanium-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type & Mass Summary Tag */}
      <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-3 bg-obsidian-900/80 px-2.5 py-1.5 rounded-lg border-hairline">
        <span className="uppercase text-phosphor-teal">{p.type}</span>
        <span className="tabular-data">MASS: {p.mass.toFixed(1)} kg</span>
      </div>

      {/* Position XYZ */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>POSITION [X, Y, Z]</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['x', 'y', 'z'] as const).map((axis, i) => (
            <div key={axis} className="bg-obsidian-900/90 rounded-lg p-1.5 border-hairline flex flex-col">
              <span className="text-[9px] font-mono text-titanium-500 uppercase">{axis}</span>
              <input
                type="number"
                step="0.1"
                value={p.position[i]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const newPos = [...p.position] as [number, number, number];
                  newPos[i] = val;
                  updatePrimitive(p.id, { position: newPos });
                }}
                className="bg-transparent font-mono text-xs text-white tabular-data focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation XYZ */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>ROTATION (DEG)</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['rx', 'ry', 'rz'] as const).map((axis, i) => (
            <div key={axis} className="bg-obsidian-900/90 rounded-lg p-1.5 border-hairline flex flex-col">
              <span className="text-[9px] font-mono text-titanium-500 uppercase">{axis}</span>
              <input
                type="number"
                step="5"
                value={p.rotation[i]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const newRot = [...p.rotation] as [number, number, number];
                  newRot[i] = val;
                  updatePrimitive(p.id, { rotation: newRot });
                }}
                className="bg-transparent font-mono text-xs text-white tabular-data focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale XYZ */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>SCALE VECTOR</span>
          <span className="text-[10px] text-phosphor-teal tabular-data">{p.scale[0]}x</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.05"
          value={p.scale[0]}
          onChange={(e) => {
            const s = parseFloat(e.target.value);
            updatePrimitive(p.id, { scale: [s, s, s] });
          }}
          className="w-full accent-phosphor-teal h-1.5 bg-obsidian-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Material Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>SURFACE SHADER</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MATERIALS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => updatePrimitive(p.id, { material: type })}
              className={`btn-tactile text-left px-2.5 py-1.5 rounded-lg text-xs font-mono border-hairline ${
                p.material === type 
                  ? 'bg-obsidian-700 text-phosphor-teal border-hairline-accent font-medium' 
                  : 'bg-obsidian-900/60 text-titanium-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatches */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>PIGMENT CHROMATICITY</span>
        </div>
        <div className="flex items-center gap-2">
          {COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              onClick={() => updatePrimitive(p.id, { color })}
              className={`w-6 h-6 rounded-full transition-transform ${
                p.color === color ? 'scale-125 ring-2 ring-white/60' : 'hover:scale-110 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={p.color}
            onChange={(e) => updatePrimitive(p.id, { color: e.target.value })}
            className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
            title="Custom hex color"
          />
        </div>
      </div>

      {/* Physics Mass Slider */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 mb-1.5">
          <span>PHYSICS RIGIDBODY MASS</span>
          <span className="tabular-data text-white">{p.mass.toFixed(1)} kg</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={p.mass}
          onChange={(e) => updatePrimitive(p.id, { mass: parseFloat(e.target.value) })}
          className="w-full accent-phosphor-teal h-1.5 bg-obsidian-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-titanium-500 mt-1">
          <span>0.0 (Kinematic)</span>
          <span>10.0 kg (Heavy)</span>
        </div>
      </div>
    </div>
  );
};

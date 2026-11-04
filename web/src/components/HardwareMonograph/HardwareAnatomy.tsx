import React, { useState } from 'react';
import { 
  Eye, 
  Cpu, 
  Layers, 
  Zap, 
  Volume2, 
  Radio, 
  Maximize2, 
  RotateCw, 
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { HardwareModule } from '../../types/ar';

const HARDWARE_MODULES: HardwareModule[] = [
  {
    id: 'mod-optics',
    name: 'Diffractive Waveguide Lens Array',
    subsystem: 'Optics & Display',
    spec: '52° Diagonal FOV // 85% Transmittance // 4K Micro-OLED',
    detail: 'Bespoke surface-relief diffractive gratings etched into Corning high-index optical glass. Direct retinal coupling with zero chromatic fringing and sub-milliradian angular resolution.',
    metrics: [
      { label: 'Pixel Density', value: '4,032 PPI' },
      { label: 'Brightness', value: '5,000 Nits' },
      { label: 'Refresh Rate', value: '120 Hz' },
      { label: 'Optical Distortion', value: '< 0.08%' }
    ],
    cameraTarget: [0, 0, 0]
  },
  {
    id: 'mod-slam',
    name: '6-DoF SLAM & Spatial Mesh Rig',
    subsystem: 'Perception Engine',
    spec: 'Dual 120 FPS Global Shutter + Solid-State dToF LiDAR',
    detail: 'Direct hardware mapping pipeline integrated with ARCore and ARKit. Emits real-time point clouds at 60 Hz with instant planar anchoring and dynamic surface normal occlusion.',
    metrics: [
      { label: 'Tracking Latency', value: '3.4 ms' },
      { label: 'Depth Range', value: '0.2m – 6.5m' },
      { label: 'Plane Classification', value: 'Horizontal/Vertical/Ceiling' },
      { label: 'Confidence Margin', value: '99.4%' }
    ],
    cameraTarget: [0, 0.5, 0]
  },
  {
    id: 'mod-compute',
    name: 'Liquid-Cooled Neural Compute Core',
    subsystem: 'Embedded Processing',
    spec: 'Hexa-Core Heterogeneous APU + 32 TOPS NPU Matrix',
    detail: 'Dedicated local inference core executing real-time gesture recognition (InputGestureSystem) and local physics serialization with negligible thermal throttling.',
    metrics: [
      { label: 'NPU Throughput', value: '32 TOPS' },
      { label: 'Thermal Envelope', value: '4.2W TDP' },
      { label: 'Memory', value: '16GB LPDDR5X' },
      { label: 'System Bus', value: 'PCIe Gen 4' }
    ],
    cameraTarget: [0, 0, 0]
  },
  {
    id: 'mod-chassis',
    name: 'Monocoque Magnesium-Titanium Frame',
    subsystem: 'Industrial Architecture',
    spec: 'Grade 5 Titanium Alloy // Total Mass 68 Grams',
    detail: 'Additive manufactured titanium lattice with integrated heat-pipe vapor chambers. Ergonomically weight-balanced across the nasal bridge and temporal arches for all-day industrial operations.',
    metrics: [
      { label: 'Chassis Mass', value: '68 g' },
      { label: 'Ingress Protection', value: 'IP65 Rated' },
      { label: 'Tensile Strength', value: '880 MPa' },
      { label: 'Center of Gravity', value: 'Optical Center' }
    ],
    cameraTarget: [0, 0, 0]
  },
  {
    id: 'mod-audio',
    name: 'Acoustic Dipole Spatial Beamformers',
    subsystem: 'Auditory Perception',
    spec: 'Dual Bone-Conduction + Directional Micro-Transducers',
    detail: 'Binaural spatial rendering with live HRTF (Head-Related Transfer Function) computation. Eliminates bleed into high-noise manufacturing floors while providing clear directional audio.',
    metrics: [
      { label: 'Frequency Response', value: '20Hz – 22kHz' },
      { label: 'Sound Isolation', value: '-32 dB' },
      { label: 'DSP Latency', value: '1.2 ms' },
      { label: 'Microphone Array', value: '4x Beamforming' }
    ],
    cameraTarget: [0, 0, 0]
  }
];

export const HardwareAnatomy: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-optics');
  const [explosionFactor, setExplosionFactor] = useState<number>(45);

  const activeModule = HARDWARE_MODULES.find(m => m.id === activeModuleId) || HARDWARE_MODULES[0];

  return (
    <section id="hardware-monograph" className="py-24 border-t border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-phosphor-teal" />
              <span>SYSTEM ARCHITECTURE // HARDWARE CAD MONOGRAPH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              AR-1 Precision Optics & Rig
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-titanium-400">EXPLODED ASSEMBLY:</span>
            <div className="flex items-center gap-2 bg-obsidian-900 px-3 py-1.5 rounded-xl border-hairline">
              <input
                type="range"
                min="0"
                max="100"
                value={explosionFactor}
                onChange={(e) => setExplosionFactor(Number(e.target.value))}
                className="w-32 accent-phosphor-teal h-1.5 bg-obsidian-700 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-phosphor-teal tabular-data w-10 text-right">
                {explosionFactor}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Visual Exploded View Simulator + Technical Data Monograph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Exploded Stage Visualizer */}
          <div className="lg:col-span-7 surface-monograph rounded-3xl p-6 sm:p-8 border-hairline relative min-h-[500px] flex flex-col justify-between overflow-hidden">
            {/* Background Cad Grid & Coordinates */}
            <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
            <div className="absolute top-4 left-4 text-[10px] font-mono text-titanium-500 tabular-data">
              COORDINATES // [0.000, 1.480, -0.220] &bull; DATUM WGS-84
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-mono text-phosphor-teal bg-obsidian-900/80 px-2 py-1 rounded border-hairline">
              CALIBRATED 60FPS
            </div>

            {/* Interactive Layer Graphic Representation */}
            <div className="my-auto py-12 flex flex-col items-center justify-center relative">
              <div 
                className="w-full max-w-md transition-all duration-500 ease-out flex flex-col items-center gap-4"
                style={{
                  transform: `perspective(1000px) rotateX(${25 - explosionFactor * 0.15}deg) rotateY(${explosionFactor * 0.2 - 10}deg)`,
                }}
              >
                {HARDWARE_MODULES.map((mod, index) => {
                  const isSelected = mod.id === activeModuleId;
                  const layerOffset = (index - 2) * (explosionFactor * 1.4);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => setActiveModuleId(mod.id)}
                      className={`w-full p-4 rounded-2xl cursor-pointer btn-tactile border transition-all ${
                        isSelected 
                          ? 'bg-obsidian-800/95 border-phosphor-teal shadow-optical ring-1 ring-phosphor-teal/40' 
                          : 'bg-obsidian-900/70 border-white/10 hover:border-white/30 hover:bg-obsidian-850'
                      }`}
                      style={{
                        transform: `translateY(${layerOffset}px) scale(${isSelected ? 1.03 : 1})`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                            isSelected ? 'bg-phosphor-teal text-obsidian-950' : 'bg-obsidian-700 text-titanium-300'
                          }`}>
                            0{index + 1}
                          </span>
                          <div>
                            <div className="text-xs font-mono text-titanium-400 uppercase tracking-wider">{mod.subsystem}</div>
                            <div className="text-sm font-semibold text-white">{mod.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isSelected ? 'bg-phosphor-teal/20 text-phosphor-teal' : 'text-titanium-500'
                          }`}>
                            {isSelected ? 'INSPECTING' : 'SELECT'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Footer Status */}
            <div className="flex items-center justify-between pt-4 border-t border-obsidian-700/60 text-xs font-mono text-titanium-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-phosphor-teal" />
                <span>UNIFIED RIG CALIBRATION VERIFIED</span>
              </span>
              <span>UNITY 6000.4.3f1 COMPATIBLE</span>
            </div>
          </div>

          {/* Right: Technical Monograph & Specifications Detail */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="surface-monograph-elevated rounded-3xl p-6 sm:p-8 border-hairline shadow-optical">
              {/* Module Header */}
              <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60 mb-6">
                <div>
                  <div className="text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-1">
                    {activeModule.subsystem}
                  </div>
                  <h3 className="text-2xl font-bold text-white font-sans">
                    {activeModule.name}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-obsidian-800 flex items-center justify-center text-phosphor-teal border-hairline">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              {/* Specification Banner */}
              <div className="bg-obsidian-900/90 rounded-2xl p-4 border-hairline mb-6">
                <span className="text-[10px] font-mono text-titanium-500 uppercase tracking-widest block mb-1">
                  Primary Engineering Specification
                </span>
                <p className="text-sm font-mono text-titanium-200 font-medium">
                  {activeModule.spec}
                </p>
              </div>

              {/* Deep Architecture Prose */}
              <p className="text-sm text-titanium-300 leading-relaxed mb-6">
                {activeModule.detail}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {activeModule.metrics.map((metric, i) => (
                  <div key={i} className="bg-obsidian-900/60 rounded-xl p-3 border-hairline">
                    <span className="text-[10px] font-mono text-titanium-500 uppercase block mb-1">
                      {metric.label}
                    </span>
                    <span className="text-base font-bold text-white font-mono tabular-data">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Unity C# Linkage Card */}
              <div className="p-3.5 rounded-xl bg-obsidian-950/80 border-hairline flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-obsidian-800 text-phosphor-amber mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-mono text-titanium-200 font-medium">
                    C# System Linkage
                  </div>
                  <div className="font-mono text-[11px] text-titanium-400 mt-0.5">
                    Coordinated via <code className="text-phosphor-teal">ARCameraSetup.cs</code> and <code className="text-phosphor-teal">ARVisualizationSystem.cs</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Module Switcher Pills */}
            <div className="surface-monograph rounded-2xl p-3 border-hairline flex flex-wrap gap-2">
              {HARDWARE_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-mono border-hairline ${
                    activeModuleId === mod.id
                      ? 'bg-phosphor-teal text-obsidian-950 font-semibold'
                      : 'bg-obsidian-900/60 text-titanium-400 hover:text-white'
                  }`}
                >
                  {mod.subsystem.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

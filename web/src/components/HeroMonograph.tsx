import React from 'react';
import { 
  ArrowDown, 
  Box, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Studio3D } from './SpatialCanvas/Studio3D';
import { PrimitiveToolbar } from './SpatialCanvas/PrimitiveToolbar';
import { ObjectInspector } from './SpatialCanvas/ObjectInspector';

export const HeroMonograph: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Background Architectural Grid & Subtle Radial Ambient */}
      <div className="absolute inset-0 tech-grid opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-phosphor-teal/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow & Technical Readout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-obsidian-800/80 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-phosphor-teal animate-pulse" />
            <span className="text-xs font-mono text-phosphor-teal tracking-widest uppercase font-semibold">
              HARDWARE MONOGRAPH 01 // AR GLASSES PLATFORM
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-titanium-400">
            <span className="tabular-data">CORE // UNITY 6000.4.3f1</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="tabular-data">SLAM // 120HZ TRACKING</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="tabular-data text-white">LATENCY // 3.4ms</span>
          </div>
        </div>

        {/* Main Monograph Headline & Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase font-sans leading-[0.95]">
              Spatial Optics. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-phosphor-teal via-white to-titanium-400">
                Industrial Precision.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-titanium-300 max-w-2xl leading-relaxed font-sans font-normal">
              An enterprise-grade AR Foundation architecture designed for high-density 3D object visualization, deterministic gesture telemetry, local persistent storage, and multi-headset synchronization across Android ARCore and iOS ARKit.
            </p>

            {/* Quick Action Navigation Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo('studio-viewport')}
                className="btn-tactile px-5 py-3 rounded-xl bg-phosphor-teal text-obsidian-950 text-xs font-mono font-bold tracking-wider uppercase hover:brightness-110 flex items-center gap-2 shadow-optical"
              >
                <Box className="w-4 h-4" />
                <span>SPATIAL STUDIO</span>
              </button>

              <button
                onClick={() => scrollTo('hardware-monograph')}
                className="btn-tactile px-5 py-3 rounded-xl surface-monograph text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-obsidian-800 border-hairline flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-phosphor-teal" />
                <span>HARDWARE CAD</span>
              </button>

              <button
                onClick={() => scrollTo('gesture-lab')}
                className="btn-tactile px-5 py-3 rounded-xl surface-monograph text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-obsidian-800 border-hairline flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-phosphor-amber" />
                <span>GESTURE LAB</span>
              </button>

              <button
                onClick={() => scrollTo('network-sync')}
                className="btn-tactile px-5 py-3 rounded-xl surface-monograph text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-obsidian-800 border-hairline flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-phosphor-cyan" />
                <span>NETWORK SYNC</span>
              </button>
            </div>
          </div>

          {/* Right: Technical Spec Matrix */}
          <div className="lg:col-span-4 surface-monograph rounded-3xl p-6 border-hairline">
            <span className="text-[10px] font-mono text-titanium-500 uppercase tracking-widest block mb-4">
              BENCHMARK SPECIFICATION MATRIX
            </span>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between py-2 border-b border-obsidian-800">
                <span className="text-titanium-400">CHASSIS WEIGHT</span>
                <span className="text-white font-bold tabular-data">68 GRAMS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-obsidian-800">
                <span className="text-titanium-400">OPTICAL FOV</span>
                <span className="text-white font-bold tabular-data">52° DIAGONAL</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-obsidian-800">
                <span className="text-titanium-400">REFRESH / TARGET</span>
                <span className="text-phosphor-teal font-bold tabular-data">120 HZ // 60 FPS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-obsidian-800">
                <span className="text-titanium-400">GESTURE LATENCY</span>
                <span className="text-white font-bold tabular-data">&lt; 4.0 MS</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-titanium-400">PERSISTENCE SCHEMA</span>
                <span className="text-phosphor-amber font-bold">JSON ATOMIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive 3D Spatial Studio Stage */}
        <div id="studio-viewport" className="relative rounded-3xl surface-monograph-elevated border-hairline shadow-optical overflow-hidden min-h-[580px] flex flex-col">
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-obsidian-700/60 bg-obsidian-900/80 z-20">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-phosphor-teal animate-pulse" />
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                SPATIAL STUDIO // WEBGL INTERACTIVE CANVAS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-titanium-400 bg-obsidian-800 px-2 py-0.5 rounded border-hairline">
                ORBIT: LEFT-CLICK &bull; PAN: RIGHT-CLICK &bull; ZOOM: WHEEL
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-titanium-400">
              <span className="tabular-data text-phosphor-teal font-medium">SHADERS ACTIVE</span>
            </div>
          </div>

          {/* Interactive 3D Canvas Area */}
          <div className="relative flex-1 min-h-[500px] w-full">
            <Studio3D />
            <PrimitiveToolbar />
            <div className="absolute top-4 right-4 z-20">
              <ObjectInspector />
            </div>
          </div>

          {/* Bottom Stage Status */}
          <div className="px-6 py-2.5 border-t border-obsidian-800/80 bg-obsidian-950/90 flex flex-wrap items-center justify-between text-[11px] font-mono text-titanium-400 z-10 gap-2">
            <span>PROCEDURAL PRIMITIVES: CUBE &bull; SPHERE &bull; CYLINDER &bull; CAPSULE &bull; PLANE</span>
            <span className="text-phosphor-teal">INTERACTIVE RAYCASTING READY</span>
          </div>
        </div>

      </div>
    </section>
  );
};

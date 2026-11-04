import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Eye, 
  Fingerprint, 
  Database, 
  Radio, 
  Layout, 
  Camera, 
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface SystemNode {
  id: string;
  name: string;
  file: string;
  category: 'Coordinator' | 'Perception' | 'Input' | 'Storage' | 'Network' | 'UI';
  lines: string;
  summary: string;
  responsibilities: string[];
}

const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'node-ar-manager',
    name: 'ARManager',
    file: 'Assets/Scripts/Core/ARManager.cs',
    category: 'Coordinator',
    lines: '400+ LOC',
    summary: 'The central singleton orchestrator that bootstraps subsystems, maintains the global AR lifecycle, and coordinates event routing.',
    responsibilities: [
      'Subsystem initialization in deterministic order',
      'High-level API for object lifecycle (create, update, destroy)',
      'Global scene management and active state tracking',
      'Error handling and fail-safe recovery cascades'
    ]
  },
  {
    id: 'node-viz',
    name: 'ARVisualizationSystem',
    file: 'Assets/Scripts/AR/ARVisualizationSystem.cs',
    category: 'Perception',
    lines: '300+ LOC',
    summary: 'Renders and manipulates procedural 3D geometric primitives (Cube, Sphere, Cylinder, Capsule, Plane) with custom shaders.',
    responsibilities: [
      'Runtime procedural mesh generation and UV allocation',
      'PBR material and chromatic shader assignments',
      'Physics Rigidbody and Collider initialization',
      'Surface normal alignment to detected planes'
    ]
  },
  {
    id: 'node-gesture',
    name: 'InputGestureSystem',
    file: 'Assets/Scripts/Input/InputGestureSystem.cs',
    category: 'Input',
    lines: '350+ LOC',
    summary: 'Multi-touch gesture recognition engine processing screen-space inputs into 3D spatial world interactions.',
    responsibilities: [
      'SingleTap, DoubleTap, LongPress, Swipe, Pinch, Rotate',
      'High-frequency AR raycasting against virtual meshes & real planes',
      'Velocity tracking and flick momentum calculation',
      'Cross-platform touch & desktop mouse fallback'
    ]
  },
  {
    id: 'node-persistence',
    name: 'PersistenceService',
    file: 'Assets/Scripts/Persistence/PersistenceService.cs',
    category: 'Storage',
    lines: '250+ LOC',
    summary: 'JSON serialization layer managing scene state saves, slot preservation, and cross-platform scene schema exports.',
    responsibilities: [
      'JSON object serialization with transform vectors & material IDs',
      'Atomic file writes to Application.persistentDataPath/ARData/',
      'Schema validation and version migration safety',
      'Scene slot management and snapshot restoration'
    ]
  },
  {
    id: 'node-network',
    name: 'NetworkingSyncSystem',
    file: 'Assets/Scripts/Networking/NetworkingSyncSystem.cs',
    category: 'Network',
    lines: '400+ LOC',
    summary: 'Multi-peer state synchronizer supporting zero-config local LAN broadcast and high-throughput cloud relays.',
    responsibilities: [
      'UDP broadcast discovery for zero-config LAN sessions',
      'TCP reliable stream for critical state transitions',
      'Delta compression and rotational quaternion packing',
      'Heartbeat monitoring and peer disconnect reconciliation'
    ]
  },
  {
    id: 'node-ui',
    name: 'ARUISystem',
    file: 'Assets/Scripts/UI/ARUISystem.cs',
    category: 'UI',
    lines: '400+ LOC',
    summary: 'Screen-space overlay interface providing ergonomic in-headset controls, property inspectors, and telemetry consoles.',
    responsibilities: [
      'Modular panel management (Creation, Properties, Scenes, Debug)',
      'Safe-zone scaling across various mobile & headset aspect ratios',
      'Live network connection status badges and diagnostics',
      'Haptic feedback trigger bindings'
    ]
  },
  {
    id: 'node-camera',
    name: 'ARCameraSetup',
    file: 'Assets/Scripts/AR/ARCameraSetup.cs',
    category: 'Perception',
    lines: '250+ LOC',
    summary: 'Configures AR Foundation ARSession, ARPlaneManager, and AROcclusionManager across ARCore & ARKit targets.',
    responsibilities: [
      'AR Foundation 6.0 plane detection and boundary tracking',
      'Environmental HDR light estimation and shadow matching',
      'Camera clipping and spatial tracking loss recovery',
      'Physical camera aperture and exposure alignment'
    ]
  }
];

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-ar-manager');

  const selectedNode = SYSTEM_NODES.find(n => n.id === selectedNodeId) || SYSTEM_NODES[0];

  return (
    <section id="system-architecture" className="py-24 border-t border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-3">
              <Cpu className="w-4 h-4 text-phosphor-teal" />
              <span>CODEBASE BLUEPRINT // UNITY 6000.4.3f1</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              System Architecture
            </h2>
          </div>
          <p className="text-sm text-titanium-400 max-w-md font-mono">
            Interactive map of the production C# subsystems powering the AR Glasses foundation. Clean event-driven isolation with high-throughput communication.
          </p>
        </div>

        {/* System Diagram & Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Node Map */}
          <div className="lg:col-span-7 surface-monograph rounded-3xl p-6 sm:p-8 border-hairline flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-titanium-400 pb-2 border-b border-obsidian-700/60">
              <span>ACTIVE C# SUBSYSTEM REGISTRY</span>
              <span>7 CORE MODULES</span>
            </div>

            {/* Central Coordinator Node */}
            <div
              onClick={() => setSelectedNodeId('node-ar-manager')}
              className={`p-4 rounded-2xl cursor-pointer btn-tactile border transition-all ${
                selectedNodeId === 'node-ar-manager'
                  ? 'bg-obsidian-800 border-phosphor-teal ring-1 ring-phosphor-teal/40 shadow-optical'
                  : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-phosphor-teal" />
                  <div>
                    <span className="text-xs font-mono text-phosphor-teal uppercase tracking-wider block">
                      CENTRAL HUB // SINGLETON
                    </span>
                    <span className="text-base font-bold text-white font-mono">
                      ARManager.cs
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-titanium-400 bg-obsidian-950 px-2.5 py-1 rounded-lg border-hairline">
                  400+ LOC
                </span>
              </div>
            </div>

            {/* Connector Lines */}
            <div className="h-4 flex items-center justify-center">
              <div className="w-px h-full bg-phosphor-teal/40" />
            </div>

            {/* Satellite Subsystems Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYSTEM_NODES.filter(n => n.id !== 'node-ar-manager').map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl cursor-pointer btn-tactile border transition-all ${
                    selectedNodeId === node.id
                      ? 'bg-obsidian-800 border-phosphor-teal ring-1 ring-phosphor-teal/40 shadow-optical'
                      : 'bg-obsidian-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">
                      {node.category}
                    </span>
                    <span className="text-[10px] font-mono text-titanium-500">
                      {node.lines}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {node.name}
                  </div>
                  <div className="text-[11px] font-mono text-titanium-500 mt-1 truncate">
                    {node.file.split('/').slice(-1)[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Node Detailed Breakdown */}
          <div className="lg:col-span-5 surface-monograph-elevated rounded-3xl p-6 sm:p-8 border-hairline shadow-optical flex flex-col gap-6">
            <div className="pb-4 border-b border-obsidian-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-phosphor-teal uppercase tracking-widest">
                  {selectedNode.category} MODULE
                </span>
                <span className="text-xs font-mono text-titanium-400 bg-obsidian-900 px-2 py-0.5 rounded border-hairline">
                  {selectedNode.lines}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white font-mono">
                {selectedNode.name}
              </h3>
              <p className="text-xs font-mono text-titanium-500 mt-1">
                {selectedNode.file}
              </p>
            </div>

            <p className="text-sm text-titanium-300 leading-relaxed font-sans">
              {selectedNode.summary}
            </p>

            {/* Responsibilities */}
            <div>
              <span className="text-[10px] font-mono text-titanium-500 uppercase tracking-widest block mb-3">
                Key Technical Responsibilities
              </span>
              <ul className="space-y-2">
                {selectedNode.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-titanium-200 font-mono">
                    <ChevronRight className="w-3.5 h-3.5 text-phosphor-teal shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testing Badge */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border-hairline flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-phosphor-teal" />
                <span className="text-xs font-mono text-white">ARProjectTests.cs Validated</span>
              </div>
              <span className="text-[10px] font-mono text-titanium-400">100% GREEN</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

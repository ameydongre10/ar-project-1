import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARPrimitive, PrimitiveType, MaterialType, GestureTelemetry, GestureType, NetworkPacket, NetworkSyncMode, ARScenePreset } from '../types/ar';

interface ARContextType {
  // Primitives
  primitives: ARPrimitive[];
  selectedId: string | null;
  selectedPrimitive: ARPrimitive | null;
  addPrimitive: (type: PrimitiveType) => void;
  updatePrimitive: (id: string, updates: Partial<ARPrimitive>) => void;
  removePrimitive: (id: string) => void;
  selectPrimitive: (id: string | null) => void;
  clearScene: () => void;
  
  // Viewport & Tools
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  shadingMode: 'pbr' | 'wireframe' | 'xray';
  setShadingMode: (mode: 'pbr' | 'wireframe' | 'xray') => void;
  gridVisible: boolean;
  setGridVisible: (visible: boolean) => void;

  // Gestures
  gestures: GestureTelemetry[];
  recordGesture: (gesture: { type: GestureType; coords: [number, number]; delta: [number, number]; magnitude: number; durationMs: number; targetId?: string }) => void;
  clearGestures: () => void;

  // Persistence
  savedScenes: ARScenePreset[];
  saveCurrentScene: (name: string) => void;
  loadScenePreset: (preset: ARScenePreset) => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;

  // Networking
  syncMode: NetworkSyncMode;
  setSyncMode: (mode: NetworkSyncMode) => void;
  networkPackets: NetworkPacket[];
  simulatedPing: number;
  connectedPeers: string[];
}

const DEFAULT_PRIMITIVES: ARPrimitive[] = [
  {
    id: 'prim-1',
    name: 'Precision Cube 01',
    type: 'cube',
    position: [-1.2, 0.5, 0],
    rotation: [0, 25, 0],
    scale: [1, 1, 1],
    color: '#00F5D4',
    material: 'titanium',
    mass: 1.0,
    createdAt: Date.now() - 50000,
  },
  {
    id: 'prim-2',
    name: 'Optical Sphere 02',
    type: 'sphere',
    position: [0.8, 0.65, 0.2],
    rotation: [0, 0, 0],
    scale: [0.8, 0.8, 0.8],
    color: '#FFB703',
    material: 'glass',
    mass: 0.8,
    createdAt: Date.now() - 40000,
  },
  {
    id: 'prim-3',
    name: 'Sensor Cylinder 03',
    type: 'cylinder',
    position: [0, 0.6, -1.2],
    rotation: [15, 45, 0],
    scale: [0.6, 1.2, 0.6],
    color: '#FB5607',
    material: 'matte',
    mass: 1.5,
    createdAt: Date.now() - 30000,
  }
];

export const PRESET_SCENES: ARScenePreset[] = [
  {
    id: 'preset-cleanroom',
    name: 'Cleanroom Optical Bench',
    description: 'Precision test bench with optical glass spheres and calibration plane',
    objects: DEFAULT_PRIMITIVES
  },
  {
    id: 'preset-industrial-rig',
    name: 'Industrial Assembly Unit',
    description: 'Robotic assembly jig with high-mass cylinders and spatial markers',
    objects: [
      {
        id: 'p-rig-1',
        name: 'Anchor Base Plane',
        type: 'plane',
        position: [0, 0.05, 0],
        rotation: [-90, 0, 0],
        scale: [3, 3, 1],
        color: '#343B4E',
        material: 'wireframe',
        mass: 0,
        createdAt: Date.now(),
      },
      {
        id: 'p-rig-2',
        name: 'Hydraulic Piston',
        type: 'cylinder',
        position: [-0.8, 0.9, 0],
        rotation: [0, 0, 0],
        scale: [0.5, 1.8, 0.5],
        color: '#E4E4E8',
        material: 'titanium',
        mass: 4.5,
        createdAt: Date.now(),
      },
      {
        id: 'p-rig-3',
        name: 'Actuator Core',
        type: 'cube',
        position: [0.8, 0.6, 0],
        rotation: [45, 45, 0],
        scale: [0.9, 0.9, 0.9],
        color: '#FB5607',
        material: 'matte',
        mass: 2.2,
        createdAt: Date.now(),
      }
    ]
  },
  {
    id: 'preset-aerospace',
    name: 'Turbine Diagnostics Rig',
    description: 'High-density multi-object spatial inspection cluster',
    objects: [
      {
        id: 'p-aero-1',
        name: 'Stator Rotor',
        type: 'cylinder',
        position: [0, 0.8, 0],
        rotation: [90, 0, 0],
        scale: [1.6, 0.4, 1.6],
        color: '#00F5D4',
        material: 'wireframe',
        mass: 12.0,
        createdAt: Date.now(),
      },
      {
        id: 'p-aero-2',
        name: 'Bearing Capsule A',
        type: 'capsule',
        position: [1.2, 0.8, 0],
        rotation: [0, 0, 90],
        scale: [0.4, 0.9, 0.4],
        color: '#FFB703',
        material: 'titanium',
        mass: 3.1,
        createdAt: Date.now(),
      },
      {
        id: 'p-aero-3',
        name: 'Bearing Capsule B',
        type: 'capsule',
        position: [-1.2, 0.8, 0],
        rotation: [0, 0, 90],
        scale: [0.4, 0.9, 0.4],
        color: '#FFB703',
        material: 'titanium',
        mass: 3.1,
        createdAt: Date.now(),
      }
    ]
  }
];

const ARContext = createContext<ARContextType | undefined>(undefined);

export const ARProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primitives, setPrimitives] = useState<ARPrimitive[]>(() => {
    const saved = localStorage.getItem('ar_monograph_current_scene');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PRIMITIVES;
  });

  const [selectedId, setSelectedId] = useState<string | null>('prim-1');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [shadingMode, setShadingMode] = useState<'pbr' | 'wireframe' | 'xray'>('pbr');
  const [gridVisible, setGridVisible] = useState<boolean>(true);

  const [gestures, setGestures] = useState<GestureTelemetry[]>([
    {
      id: 'g-init-1',
      timestamp: '00:00:12.420',
      type: 'SingleTap',
      normalizedCoords: [0.48, 0.52],
      pixelDelta: [0, 0],
      magnitude: 0,
      durationMs: 42,
      targetId: 'prim-1'
    },
    {
      id: 'g-init-2',
      timestamp: '00:00:15.110',
      type: 'Pinch',
      normalizedCoords: [0.5, 0.5],
      pixelDelta: [24, -18],
      magnitude: 1.34,
      durationMs: 280,
      targetId: 'prim-2'
    }
  ]);

  const [savedScenes, setSavedScenes] = useState<ARScenePreset[]>(() => {
    const custom = localStorage.getItem('ar_monograph_user_scenes');
    if (custom) {
      try {
        return [...PRESET_SCENES, ...JSON.parse(custom)];
      } catch (e) {
        console.error(e);
      }
    }
    return PRESET_SCENES;
  });

  const [syncMode, setSyncMode] = useState<NetworkSyncMode>('Local');
  const [simulatedPing, setSimulatedPing] = useState<number>(4.2);
  const connectedPeers = ['HMD-Alpha (ARCore 1.48)', 'HMD-Beta (ARKit 6)', 'Desktop-QA-Rig'];

  const [networkPackets, setNetworkPackets] = useState<NetworkPacket[]>([
    {
      id: 'pkt-101',
      timestamp: new Date().toLocaleTimeString(),
      channel: 'UDP_MULTICAST',
      type: 'HEARTBEAT',
      sender: 'HMD-Alpha',
      payloadSize: 64,
      latencyMs: 3.8,
      status: 'DELIVERED'
    },
    {
      id: 'pkt-102',
      timestamp: new Date().toLocaleTimeString(),
      channel: 'TCP_RELIABLE',
      type: 'SCENE_SYNC',
      sender: 'Host-AR-1',
      payloadSize: 1248,
      latencyMs: 4.5,
      status: 'ACKNOWLEDGED'
    }
  ]);

  // Persist current scene to localStorage
  useEffect(() => {
    localStorage.setItem('ar_monograph_current_scene', JSON.stringify(primitives));
  }, [primitives]);

  // Network packet generator & simulator
  const pushNetworkPacket = useCallback((
    type: NetworkPacket['type'], 
    channel: NetworkPacket['channel'],
    size: number
  ) => {
    if (syncMode === 'Offline') return;
    const packet: NetworkPacket = {
      id: `pkt-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleTimeString(),
      channel,
      type,
      sender: syncMode === 'Cloud' ? 'Cloud-Relay-WSS' : 'Local-Subnet-255',
      payloadSize: size,
      latencyMs: +(simulatedPing + (Math.random() * 2 - 1)).toFixed(2),
      status: Math.random() > 0.85 ? 'COMPRESSED' : 'DELIVERED'
    };
    setNetworkPackets(prev => [packet, ...prev.slice(0, 19)]);
  }, [syncMode, simulatedPing]);

  // Periodic heartbeat packet
  useEffect(() => {
    if (syncMode === 'Offline') return;
    const interval = setInterval(() => {
      pushNetworkPacket('HEARTBEAT', syncMode === 'Cloud' ? 'CLOUD_WSS' : 'UDP_MULTICAST', 72);
      setSimulatedPing(+(3.8 + Math.random() * 1.5).toFixed(1));
    }, 4000);
    return () => clearInterval(interval);
  }, [syncMode, pushNetworkPacket]);

  const addPrimitive = (type: PrimitiveType) => {
    const count = primitives.filter(p => p.type === type).length + 1;
    const colors = ['#00F5D4', '#FFB703', '#FB5607', '#00BBF9', '#E4E4E8'];
    const materials: MaterialType[] = ['titanium', 'glass', 'matte', 'wireframe', 'phosphor'];
    
    // Random offset near center
    const x = +(Math.random() * 2 - 1).toFixed(2);
    const z = +(Math.random() * 2 - 1).toFixed(2);

    const newObj: ARPrimitive = {
      id: `prim-${Date.now()}`,
      name: `${type.toUpperCase()} 0${count}`,
      type,
      position: [x, type === 'plane' ? 0.02 : 0.6, z],
      rotation: [0, Math.floor(Math.random() * 90), 0],
      scale: type === 'plane' ? [2, 2, 1] : [0.8, 0.8, 0.8],
      color: colors[primitives.length % colors.length],
      material: materials[primitives.length % materials.length],
      mass: type === 'plane' ? 0 : +(0.5 + Math.random() * 2).toFixed(1),
      createdAt: Date.now()
    };

    setPrimitives(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
    pushNetworkPacket('OBJECT_CREATE', 'TCP_RELIABLE', 312);
  };

  const updatePrimitive = (id: string, updates: Partial<ARPrimitive>) => {
    setPrimitives(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    pushNetworkPacket('OBJECT_UPDATE', 'UDP_MULTICAST', 144);
  };

  const removePrimitive = (id: string) => {
    setPrimitives(prev => prev.filter(p => p.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    pushNetworkPacket('OBJECT_DELETE', 'TCP_RELIABLE', 96);
  };

  const selectPrimitive = (id: string | null) => {
    setSelectedId(id);
  };

  const clearScene = () => {
    setPrimitives([]);
    setSelectedId(null);
    pushNetworkPacket('SCENE_SYNC', 'TCP_RELIABLE', 64);
  };

  const recordGesture = (gesture: {
    type: GestureType;
    coords: [number, number];
    delta: [number, number];
    magnitude: number;
    durationMs: number;
    targetId?: string;
  }) => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newGesture: GestureTelemetry = {
      id: `gst-${Date.now()}`,
      timestamp: timeStr,
      type: gesture.type,
      normalizedCoords: gesture.coords,
      pixelDelta: gesture.delta,
      magnitude: gesture.magnitude,
      durationMs: gesture.durationMs,
      targetId: gesture.targetId
    };

    setGestures(prev => [newGesture, ...prev.slice(0, 24)]);

    // If an object is targeted, apply immediate reactive behavior
    if (selectedId) {
      if (gesture.type === 'Pinch') {
        const factor = gesture.magnitude > 1 ? 1.05 : 0.95;
        const current = primitives.find(p => p.id === selectedId);
        if (current) {
          updatePrimitive(selectedId, {
            scale: [
              +(current.scale[0] * factor).toFixed(2),
              +(current.scale[1] * factor).toFixed(2),
              +(current.scale[2] * factor).toFixed(2)
            ]
          });
        }
      } else if (gesture.type === 'Rotate') {
        const current = primitives.find(p => p.id === selectedId);
        if (current) {
          updatePrimitive(selectedId, {
            rotation: [
              current.rotation[0],
              (current.rotation[1] + 15) % 360,
              current.rotation[2]
            ]
          });
        }
      }
    }
  };

  const clearGestures = () => {
    setGestures([]);
  };

  const saveCurrentScene = (name: string) => {
    const newPreset: ARScenePreset = {
      id: `user-scene-${Date.now()}`,
      name: name.trim() || `User Scene ${new Date().toLocaleDateString()}`,
      description: `Custom layout containing ${primitives.length} active AR spatial primitives.`,
      objects: [...primitives]
    };
    const updated = [...savedScenes, newPreset];
    setSavedScenes(updated);
    const userOnly = updated.filter(s => s.id.startsWith('user-scene-'));
    localStorage.setItem('ar_monograph_user_scenes', JSON.stringify(userOnly));
    pushNetworkPacket('SCENE_SYNC', 'TCP_RELIABLE', 890);
  };

  const loadScenePreset = (preset: ARScenePreset) => {
    setPrimitives(preset.objects);
    setSelectedId(preset.objects[0]?.id || null);
    pushNetworkPacket('SCENE_SYNC', 'TCP_RELIABLE', 1040);
  };

  const exportJSON = (): string => {
    const exportPayload = {
      sceneName: "AR_Glasses_Export",
      version: "6.0.0",
      unityFormatVersion: "Unity 6000.4.3f1",
      exportedAt: new Date().toISOString(),
      objectCount: primitives.length,
      objects: primitives.map(p => ({
        id: p.id,
        name: p.name,
        primitiveType: p.type,
        transform: {
          position: { x: p.position[0], y: p.position[1], z: p.position[2] },
          rotation: { x: p.rotation[0], y: p.rotation[1], z: p.rotation[2] },
          scale: { x: p.scale[0], y: p.scale[1], z: p.scale[2] }
        },
        material: {
          type: p.material,
          colorHex: p.color
        },
        physics: {
          mass: p.mass,
          isKinematic: p.mass === 0
        }
      }))
    };
    return JSON.stringify(exportPayload, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.objects)) {
        const imported: ARPrimitive[] = data.objects.map((o: any, idx: number) => ({
          id: o.id || `imp-${Date.now()}-${idx}`,
          name: o.name || `Imported ${o.primitiveType || 'Primitive'}`,
          type: (o.primitiveType?.toLowerCase() || 'cube') as PrimitiveType,
          position: [
            o.transform?.position?.x ?? 0,
            o.transform?.position?.y ?? 0.5,
            o.transform?.position?.z ?? 0
          ],
          rotation: [
            o.transform?.rotation?.x ?? 0,
            o.transform?.rotation?.y ?? 0,
            o.transform?.rotation?.z ?? 0
          ],
          scale: [
            o.transform?.scale?.x ?? 1,
            o.transform?.scale?.y ?? 1,
            o.transform?.scale?.z ?? 1
          ],
          color: o.material?.colorHex || '#00F5D4',
          material: (o.material?.type || 'titanium') as MaterialType,
          mass: o.physics?.mass ?? 1.0,
          createdAt: Date.now()
        }));

        setPrimitives(imported);
        setSelectedId(imported[0]?.id || null);
        pushNetworkPacket('SCENE_SYNC', 'TCP_RELIABLE', jsonString.length);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const selectedPrimitive = primitives.find(p => p.id === selectedId) || null;

  return (
    <ARContext.Provider
      value={{
        primitives,
        selectedId,
        selectedPrimitive,
        addPrimitive,
        updatePrimitive,
        removePrimitive,
        selectPrimitive,
        clearScene,
        transformMode,
        setTransformMode,
        shadingMode,
        setShadingMode,
        gridVisible,
        setGridVisible,
        gestures,
        recordGesture,
        clearGestures,
        savedScenes,
        saveCurrentScene,
        loadScenePreset,
        exportJSON,
        importJSON,
        syncMode,
        setSyncMode,
        networkPackets,
        simulatedPing,
        connectedPeers
      }}
    >
      {children}
    </ARContext.Provider>
  );
};

export const useAR = () => {
  const context = useContext(ARContext);
  if (!context) {
    throw new Error('useAR must be used within an ARProvider');
  }
  return context;
};

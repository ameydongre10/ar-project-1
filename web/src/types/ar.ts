export type PrimitiveType = 'cube' | 'sphere' | 'cylinder' | 'capsule' | 'plane';

export type MaterialType = 'matte' | 'glass' | 'titanium' | 'wireframe' | 'phosphor';

export interface ARPrimitive {
  id: string;
  name: string;
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number]; // in degrees
  scale: [number, number, number];
  color: string;
  material: MaterialType;
  mass: number;
  isSelected?: boolean;
  createdAt: number;
}

export type GestureType = 
  | 'SingleTap'
  | 'DoubleTap'
  | 'LongPress'
  | 'Pinch'
  | 'Rotate'
  | 'Swipe';

export interface GestureTelemetry {
  id: string;
  timestamp: string;
  type: GestureType;
  normalizedCoords: [number, number];
  pixelDelta: [number, number];
  magnitude: number;
  durationMs: number;
  targetId?: string;
}

export interface ARScenePreset {
  id: string;
  name: string;
  description: string;
  objects: ARPrimitive[];
}

export type NetworkSyncMode = 'Local' | 'Cloud' | 'Hybrid' | 'Offline';

export interface NetworkPacket {
  id: string;
  timestamp: string;
  channel: 'UDP_MULTICAST' | 'TCP_RELIABLE' | 'CLOUD_WSS';
  type: 'OBJECT_CREATE' | 'OBJECT_UPDATE' | 'OBJECT_DELETE' | 'SCENE_SYNC' | 'HEARTBEAT';
  sender: string;
  payloadSize: number; // in bytes
  latencyMs: number;
  status: 'DELIVERED' | 'ACKNOWLEDGED' | 'COMPRESSED';
}

export interface HardwareModule {
  id: string;
  name: string;
  subsystem: string;
  spec: string;
  detail: string;
  metrics: { label: string; value: string }[];
  cameraTarget: [number, number, number];
}

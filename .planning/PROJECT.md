# AR-1 Monograph — Industrial Spatial AR Web Showcase & Interactive Simulator

## Vision
Transform `ar-project-1` (Unity Mobile AR application for AR Glasses) into an award-winning, industry-grade web experience and interactive spatial computing monograph. The web application acts as the digital flagship and interactive companion for the AR Glasses system, bridging industrial hardware engineering, real-time WebGL spatial computing, and high-precision design-engineering.

## Core Archetype & Design Direction
- **Archetype**: Interactive 3D Canvas & Hardware Monograph.
- **Visual Tone**: Technical, high-precision, utilitarian luxury. Optical titanium, deep obsidian (`#090A0F`), calibrated phosphors (`#00F5D4`, `#FF6B35`), and subtle chromatic dispersion.
- **Typography**: Editorial precision header hierarchy, monospace tabular readouts (`font-variant-numeric: tabular-nums`), `text-wrap: balance`.
- **Craftsmanship**: Concentric border radiuses, optical icon alignments, tactile press states (`scale(0.98)`), interruptible state transitions, zero AI-slop tropes (no arbitrary purple glows, no redundant cards-in-cards).

## Architecture & Tech Stack
- **Framework**: Vite + React 19 + TypeScript + Tailwind CSS (v4 / modern utility system) + Lucide Icons.
- **3D & Spatial Engine**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`.
- **Shaders & Glass**: Custom WebGL glass refraction & dispersion shaders, subtle canvas lighting gradients.
- **State Management**: Zustand / React hooks for real-time scene tree, active primitive inspector, gesture recorder, and network packet simulation.

## Core Features & Modules
1. **Interactive Spatial Viewport (3D Studio)**:
   - Full 3D interactive viewport rendering the 5 Unity primitives (Cube, Sphere, Cylinder, Capsule, Plane).
   - Real-time material shader switching (Obsidian Matte, Optical Glass, Anodized Titanium, Holographic Grid).
   - Gizmo controls (Translate, Rotate, Scale) matching Unity AR systems.
2. **Gesture Simulation Laboratory**:
   - Interactive multi-touch trackpad simulating mobile AR gestures: Single Tap (select), Double Tap (reset), Long Press (inspect), Pinch (scale), 2-Finger Rotate, Swipe (toss/translate).
   - Real-time gesture telemetry feed showing timestamp, velocity, normalized delta, and event dispatch.
3. **Hardware Monograph & Optical Exploded View**:
   - Interactive 3D breakdown of the AR Glasses hardware: Waveguide Display Layer, SLAM Camera Rig, LiDAR/ToF Depth Sensor, Thermal-dispersive Frame, Spatial Audio Transducers.
4. **Scene Persistence & Storage Bridge**:
   - Live scene graph inspector with JSON import/export, slot-based scene saves (`localStorage`), and pre-built industrial demo environments (Cleanroom Rig, Surgical Optics, Turbine Diagnostic).
5. **Multiplayer Sync & Network Telemetry**:
   - Live packet visualizer demonstrating LAN UDP/TCP broadcast vs. Cloud Relay, delta compression, and multi-device state replication.
6. **Technical Specification & Architecture Deep-Dive**:
   - Visual system architecture mapping (`ARManager` -> `ARVisualizationSystem`, `InputGestureSystem`, `PersistenceService`, `NetworkingSyncSystem`, `ARUISystem`).

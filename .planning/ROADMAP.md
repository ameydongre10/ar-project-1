# GSD Roadmap — AR-1 Spatial Monograph

## Phase Breakdown

### Phase 1: Project Foundation & Design System Setup
- Initialize Vite + React + TypeScript + Tailwind CSS application structure in `web/`.
- Establish core design tokens: obsidian palette (`#07080B`, `#0E1117`, `#181D27`), titanium grays, phosphor teal (`#00F5D4`), safety orange (`#FF6422`), typography rules, concentric radii.
- Configure Three.js, Lucide icons, and core layout shell with responsive grid.

### Phase 2: Interactive 3D Spatial Canvas & Primitive Studio
- Implement the 3D WebGL viewport powered by Three.js / React Three Fiber.
- Build the 5 AR primitives (Cube, Sphere, Cylinder, Capsule, Plane) with custom high-fidelity PBR materials.
- Implement runtime transform controls (Translate, Rotate, Scale) and viewport camera modes.
- Build the Floating Spatial Inspector for object properties (Position, Rotation, Scale, Color, Material, Mass).

### Phase 3: Hardware Monograph & Optics Exploded View
- Create the Interactive AR Glasses hardware inspection stage.
- Implement the exploded-view mechanic separating Waveguide Lens, Micro-OLED Projectors, SLAM Spatial Cameras, Depth Sensor, Compute Core, and Titanium Frame.
- Build interactive callout hotspots with technical specifications and optical performance telemetry.

### Phase 4: Gesture Laboratory & Telemetry Engine
- Develop the interactive touch/trackpad gesture simulator.
- Handle Single Tap, Double Tap, Long Press, Pinch, 2-Finger Rotate, and Swipe.
- Provide real-time HUD telemetry graph and event console showing touch coordinates, pressure/scale factor, and triggered Unity event mappings.

### Phase 5: Scene Persistence & Network Sync Simulation
- Build the Scene Persistence manager (Local storage slots, JSON export/import conforming to Unity JSON serialization format, and preset scenes).
- Implement the Multiplayer LAN/Cloud Network visualizer with real-time packet stream, ping, packet loss simulation, and multi-device avatar sync.

### Phase 6: Polish, Accessibility, Build & Verification
- Apply craftsmanship refinements (`make-interfaces-feel-better`: optical alignment, tabular nums, tactile button feedback, concentric borders).
- Test responsive viewports (390px, 768px, 1024px, 1440px+).
- Ensure build succeeds cleanly (`npm run build`).
- Verify zero runtime console errors and document delivery in `README.md` and verification reports.

### Phase 7: WebXR Virtual Reality (VR) Bridge & 6-DoF Controller Interaction
- Separate session entry points for **ENTER VR** (`immersive-vr`) and **ENTER AR** (`immersive-ar`).
- Implement 3D immersive VR cleanroom studio environment (infinite tech grid, dark dome, spatial workbench, lighting).
- Implement 6-DoF VR controller raycasting, trigger selection, grip grab/translate, and controller haptic pulse feedback.
- Add in-headset floating VR HUD showing active primitive telemetry and exit control.
- Verify cross-device compatibility (Meta Quest, PCVR SteamVR, Apple Vision Pro, WebXR Emulator) and deploy to GitHub Pages.

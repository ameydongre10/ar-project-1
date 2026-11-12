# Requirements Specification — AR-1 Hardware Monograph & Spatial Experience

## 1. Functional Requirements (FR)
- **FR-01: Real-time 3D Viewport**: WebGL canvas supporting orbit/pan/zoom, environmental lighting, shadow casting, and grid snapping.
- **FR-02: Primitive Management**: Create, select, duplicate, delete, and inspect the 5 core AR primitives (Cube, Sphere, Cylinder, Capsule, Plane) matching the Unity `ARVisualizationSystem`.
- **FR-03: Material & Shader Presets**: Toggle between Optical Glass, Obsidian Matte, Anodized Titanium, Calibrated Phosphor, and Hologram Wireframe.
- **FR-04: Gesture Laboratory**: Interactive gesture testbed simulating touch inputs (Single Tap, Double Tap, Long Press, Pinch, 2-Finger Rotate, Swipe) with visual touch points and telemetry log.
- **FR-05: Scene Persistence Engine**: Save current spatial layouts into browser storage, switch between custom saved scenes, load industrial presets, and export/import clean JSON scene files compatible with Unity schema.
- **FR-06: Network Sync Simulation**: Live network visualizer demonstrating local LAN (UDP/TCP) and cloud relay synchronization, with simulated latency, packet loss, and peer node state syncing.
- **FR-07: Hardware Monograph & Anatomy**: Interactive breakdown of the AR Glasses hardware modules with exploded view animation, hotspot inspection, and technical engineering specs.
- **FR-08: Full Responsive Design**: Adaptive layout functioning cleanly on desktop (1440px+), laptop (1024px), tablet (768px), and mobile (390px) viewports without text collision or control overflow.

## 2. Non-Functional & Craftsmanship Requirements (NFR)
- **NFR-01: Zero AI-Slop Design**: No generic purple/neon gradient-heavy cards, no arbitrary cards-within-cards, no centered generic headline + badge templates.
- **NFR-02: Editorial & Industrial Typography**: Monospace metrics for live data (`font-variant-numeric: tabular-nums`), tight high-contrast editorial headings (`text-wrap: balance`), clear hierarchy.
- **NFR-03: Micro-Interactions & Haptics**: Tactile press states (`active:scale-[0.98]`), explicit CSS transition properties (no `transition: all`), concentric border radius calculations (`R_outer = R_inner + padding`).
- **NFR-04: Performance**: Target 60 FPS on standard modern desktop GPUs with efficient Three.js mesh disposal and throttled event listeners.
- **NFR-05: Accessibility & Semantics**: WCAG AA contrast compliance, visible focus states, aria labels on icon buttons, keyboard navigable interactive modules.

## 3. WebXR Virtual Reality (VR) Bridge Requirements (FR-VR)
- **FR-09: Explicit Dual Session Mode Selection (`immersive-vr` vs `immersive-ar`)**:
  - Provide discrete user controls to select between pure Virtual Reality (`immersive-vr`) and Mixed Reality Passthrough (`immersive-ar`), eliminating ambiguous automatic defaulting.
  - Auto-probe headset capabilities and feature flags (`local-floor`, `bounded-floor`, `layers`, `hand-tracking`, `hit-test`).
  - Fallback reference space negotiation: gracefully fall back from `local-floor` to `local` if physical floor calibration is unavailable.
- **FR-10: Calibrated 3D VR Studio Environment**:
  - In `immersive-vr` mode, render an enclosed spatial cleanroom environment (infinite tech grid floor, dark dome skybox, ambient contact shadows, calibrated spotlights) so the user is never suspended in an empty black void.
  - Maintain zero background alpha (`clearColor: 0x000000, 0`) strictly during AR passthrough mode.
  - Ergonomic spatial placement: anchor the 3D primitives onto a virtual workbench at natural eye/hand height ([0, 1.1m, -1.2m]).
- **FR-11: 6-DoF Controller Raycasting & Object Manipulation**:
  - Track both Left and Right 6-DoF VR controllers (`getController(0)`, `getController(1)`) with visual phosphor laser beams and targeting reticles.
  - Trigger Press (`select`): Raycast against primitive bounding geometries to select and highlight objects with optical bounding brackets.
  - Grip Squeeze (`squeeze`): Grab and spatially translate/rotate objects in 3D space with 1:1 controller tracking.
  - Haptic Feedback: Dispatch tactile pulse pulses (`gamepad.hapticActuators`) on collision and selection events.
- **FR-12: In-Headset VR HUD & Telemetry**:
  - Floating spatial HUD panel displaying real-time FPS, active primitive telemetry (position, rotation, scale, material), and a 1-tap "Exit VR" control.
- **FR-13: Universal Cross-Platform Headset Compatibility**:
  - Meta Quest 2 / 3 / 3S / Pro via Meta Quest Browser.
  - PC VR (SteamVR, Oculus Link, HTC Vive, Valve Index, Bigscreen Beyond) via Chrome/Edge OpenXR runtime.
  - Apple Vision Pro via Safari (visionOS WebXR flags).
  - Desktop developer emulation via WebXR API Emulator browser extension.

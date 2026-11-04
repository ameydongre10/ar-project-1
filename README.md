# AR Glasses — Unity Mobile AR & Interactive 3D Web Monograph

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00F5D4?style=for-the-badge&logo=github&logoColor=060709)](https://ameydongre10.github.io/ar-project-1/)
[![Unity Version](https://img.shields.io/badge/Unity-6000.4.3f1%20(Unity%206)-white?style=for-the-badge&logo=unity&logoColor=black)](https://unity.com/)
[![AR Foundation](https://img.shields.io/badge/AR%20Foundation-6.0-blue?style=for-the-badge)](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@6.0/manual/index.html)
[![Web Stack](https://img.shields.io/badge/Web-React%20%7C%20Three.js%20%7C%20Vite-black?style=for-the-badge&logo=react)](web/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An industrial-grade spatial computing repository uniting an AR Foundation mobile runtime (ARCore & ARKit) with an award-winning interactive 3D WebGL Monograph & Simulation Studio.</strong>
</p>

[**Explore Live WebGL Studio**](https://ameydongre10.github.io/ar-project-1/) • [**System Architecture**](#-system-architecture) • [**Unity Mobile AR**](#-unity-mobile-ar-runtime) • [**Web Studio**](#-web-monograph--3d-studio) • [**Quick Start**](#-quick-start)

</div>

---

## 🌟 Highlights

- 🕶️ **Live Interactive 3D Web Studio**: Full-viewport WebGL canvas with real-time procedural primitive placement (Cube, Sphere, Cylinder, Capsule, Plane) and custom PBR shaders (Titanium, Optical Glass, Matte, Wireframe, Phosphor).
- 🔬 **Hardware CAD Exploded View**: Continuous interactive explosion slider (0% to 100%) breaking down the AR-1 headset into its optical waveguides, 4K Micro-OLED light engines, and 6-DoF SLAM sensor rig.
- 🖐️ **Gesture Laboratory**: Interactive multi-touch trackpad simulating mobile AR gestures (SingleTap, DoubleTap, LongPress, Pinch Zoom, Rotate, Swipe) with live telemetry logging that actively transforms 3D objects in real time.
- 💾 **Scene Persistence & Unity Schema Bridge**: Slot-based scene saving, preset industrial environments, and bidirectional JSON serialization conforming to Unity's `PersistenceService.cs`.
- 📡 **Multiplayer Network Telemetry**: Live packet waterfall visualizing LAN UDP multicast vs. Cloud Relay, delta compression, and multi-device state replication matching `NetworkingSyncSystem.cs`.
- 📱 **Unity 6 Mobile Engine Foundation**: Fully featured AR Foundation 6.0 mobile application with plane detection, environmental lighting estimation, and touch raycasting for Android and iOS.

---

## 🌐 Web Monograph & 3D Studio (`web/`)

The repository includes a digital flagship and spatial computing monograph located in the [`web/`](web/) workspace, served live at **[https://ameydongre10.github.io/ar-project-1/](https://ameydongre10.github.io/ar-project-1/)**.

### Tech Stack
- **Framework**: React 18 + TypeScript + Vite 6
- **3D & Spatial Engine**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Styling**: Tailwind CSS + Custom Optical Shaders & Conic Gradients
- **Typography**: Space Grotesk & JetBrains Mono (`tabular-nums`)
- **CI/CD**: Automated GitHub Pages workflow (`.github/workflows/deploy-pages.yml`)

### Running the Web Studio Locally
```bash
# Clone the repository
git clone https://github.com/ameydongre10/ar-project-1.git
cd ar-project-1

# Install dependencies and start local dev server
npm run dev

# Or build for production
npm run build
```
Once started, navigate to `http://localhost:5173/` in your browser.

---

## 🏗️ System Architecture

```
                                  ARManager
                          (Core Coordinator Singleton)
                                       │
     ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
     ▼                  ▼              ▼              ▼                  ▼
InputGesture       ARVisualization Persistence     NetworkingSync      ARUI
   System              System        Service           System         System
(Gesture Recog &   (3D Procedural  (Save/Load JSON (LAN/Cloud Delta  (HUD Panels &
 Touch Raycast)      PBR Meshes)    Serialization)   Compression)     Telemetry)
     │                  │              │              │                  │
     └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                       ▼
                                 ARCameraSetup
                        (AR Foundation 6.0 Core Pipeline)
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 Android (ARCore)               iOS (ARKit)
```

---

## 📱 Unity Mobile AR Runtime

The native AR application is built on **Unity 6000.4.3f1** using **AR Foundation 6.0**, providing an industrial-grade field environment for spatial inspection.

### Prerequisites
- **Unity Editor**: `6000.4.3f1` (Authoritative version specified in `ProjectSettings/ProjectVersion.txt`)
- **XR Provider Packages**: ARCore XR Plugin (Android) and/or ARKit XR Plugin (iOS)
- **Target OS**: Android 7.0+ (API 24+) or iOS 13.0+
- **Hardware**: ARCore / ARKit compatible mobile device or AR glasses tether

### Installation & Run
1. Open Unity Hub and add this project directory.
2. Ensure the correct editor version (**Unity 6000.4.3f1**) is active.
3. Open `Assets/Scenes/ar project.unity`.
4. Enter **Play Mode** for non-device UI, gesture simulation, and logic checks.
5. For on-device deployment:
   - Configure **Project Settings > XR Plug-in Management** for your target platform (Android / iOS).
   - In **Build Settings**, switch platform to Android or iOS and click **Build and Run**.

---

## 📦 Project Structure

```
ar-project-1/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml        # Automated GitHub Pages CI/CD workflow
│       └── unity-validation.yml    # Unity build validation workflow
├── .planning/                      # GSD Architectural Documentation
│   ├── PROJECT.md                  # Vision, constraints, and architecture
│   ├── REQUIREMENTS.md             # Functional & Non-functional requirements
│   ├── ROADMAP.md                  # Phase breakdown & milestones
│   └── STATE.md                    # Verification status & decision memory
├── Assets/                         # Unity C# Systems & Engine Assets
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── ARManager.cs        # Main coordinator (400+ LOC)
│   │   │   ├── ARBootstrap.cs      # Initialization lifecycle
│   │   │   ├── ARProjectConfig.cs  # System constants & defaults
│   │   │   └── ARProjectTests.cs   # Unit & integration test suite
│   │   ├── AR/
│   │   │   ├── ARVisualizationSystem.cs  # 3D mesh generator & materials
│   │   │   └── ARCameraSetup.cs          # AR Foundation camera & plane manager
│   │   ├── Input/
│   │   │   └── InputGestureSystem.cs     # Gesture classifier & raycaster
│   │   ├── Persistence/
│   │   │   └── PersistenceService.cs     # JSON file I/O & scene serializer
│   │   ├── Networking/
│   │   │   └── NetworkingSyncSystem.cs   # UDP multicast / TCP / Cloud sync
│   │   ├── UI/
│   │   │   └── ARUISystem.cs             # Canvas overlays, HUD & menus
│   │   └── Models/
│   │       └── ARObject.cs               # Object & Scene data models
│   └── Scenes/
│       └── ar project.unity        # Primary Unity scene
├── web/                            # Interactive 3D Web Monograph
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx                # Technical HUD header & status
│   │   │   ├── HeroMonograph.tsx         # Monograph entrance & 3D canvas stage
│   │   │   ├── SpatialCanvas/
│   │   │   │   ├── Studio3D.tsx          # Three.js / R3F WebGL viewport
│   │   │   │   ├── PrimitiveToolbar.tsx  # Spawner & shader controls
│   │   │   │   └── ObjectInspector.tsx   # Transform, material & physics editor
│   │   │   ├── HardwareMonograph/
│   │   │   │   └── HardwareAnatomy.tsx   # Exploded view CAD model (0-100%)
│   │   │   ├── GestureLab/
│   │   │   │   └── GestureLaboratory.tsx # Capacitive touch trackpad & logger
│   │   │   ├── PersistenceEngine/
│   │   │   │   └── ScenePersistence.tsx  # Preset loader & Unity JSON bridge
│   │   │   ├── NetworkVisualizer/
│   │   │   │   └── NetworkSyncVisualizer.tsx # Packet waterfall & peer topology
│   │   │   ├── SystemArchitecture/
│   │   │   │   └── ArchitectureDiagram.tsx   # Interactive codebase blueprint
│   │   │   └── Footer.tsx                # Engineering colophon & links
│   │   ├── context/ARContext.tsx         # Spatial state & reactive event store
│   │   ├── types/ar.ts                   # Unified data contracts
│   │   └── index.css                     # Optical styling, tokens & haptics
│   ├── package.json
│   └── vite.config.ts                    # Optimized chunking & relative base
├── package.json                          # Monorepo root scripts (`npm run dev`)
└── README.md
```

---

## 🎮 Core Subsystems (C# API Reference)

### 1. `ARManager.cs`
Central coordinator managing lifecycle, subsystem bootstrap order, and high-level scene manipulation.
```csharp
// Spawn primitive at position
ARManager.Instance.CreateARObject(new Vector3(0, 0, 1.5f), "Cube");

// Scene persistence
ARManager.Instance.SaveCurrentScene("Turbine_Inspection_Rig");
ARManager.Instance.LoadScene(sceneId);
```

### 2. `ARVisualizationSystem.cs`
Generates procedural 3D meshes with PBR materials, physics rigidbodies, and spatial colliders.
Supported primitives: **Cube**, **Sphere**, **Cylinder**, **Capsule**, **Plane**.

### 3. `InputGestureSystem.cs`
Dispatches classified multi-touch events directly to world raycasts:
- **SingleTap**: Select / focus spatial object
- **DoubleTap**: Reset transform / center viewport
- **LongPress** (>500ms): Inspect object / anchor plane
- **Pinch**: Dynamic scale factor
- **2-Finger Rotate**: Angular twist around surface normal
- **Swipe**: Directional impulse velocity toss

### 4. `PersistenceService.cs`
Handles JSON serialization to `Application.persistentDataPath/ARData/`. Conforms to the following schema:
```json
{
  "sceneName": "Cleanroom_Bench",
  "unityFormatVersion": "Unity 6000.4.3f1",
  "objects": [
    {
      "id": "prim-1",
      "name": "Precision Cube 01",
      "primitiveType": "cube",
      "transform": {
        "position": { "x": -1.2, "y": 0.5, "z": 0.0 },
        "rotation": { "x": 0.0, "y": 25.0, "z": 0.0 },
        "scale": { "x": 1.0, "y": 1.0, "z": 1.0 }
      },
      "material": { "type": "titanium", "colorHex": "#00F5D4" },
      "physics": { "mass": 1.0, "isKinematic": false }
    }
  ]
}
```

### 5. `NetworkingSyncSystem.cs`
Synchronizes state across devices with adaptive sync modes:
- **Local (LAN)**: UDP multicast discovery + TCP reliable broadcast on port `7777`
- **Cloud**: Regional WebSocket server relay with delta compression (~74% bandwidth savings)
- **Hybrid**: Local peer sync with automatic cloud snapshot fallback
- **Offline**: Standalone air-gapped mode

---

## 🧪 Testing & Verification

- **Unity EditMode Tests**: Located in `Assets/Scripts/Core/ARProjectTests.cs`. Run via Unity Test Runner (`Window > General > Test Runner`).
- **Web App Tests & Build**:
  ```bash
  npm run build
  ```
  Bundle verified: Zero TypeScript errors, code-split vendor chunks (`three`: 690 kB, `r3f`: 412 kB, `app`: 77 kB).

---

## 📄 License & Attribution

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.  
Created for industrial spatial computing and augmented reality inspection.

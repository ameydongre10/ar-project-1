# AR Glasses Project Architecture

## Overview
This is a complete industrial-grade AR application for mobile devices (ARCore/ARKit) focused on 3D object visualization with networking and persistence capabilities.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AR Manager (Core)                     │
│              Main coordinator & entry point              │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┼─────────┬──────────┐
         │         │         │          │
         ▼         ▼         ▼          ▼
   ┌─────────┐ ┌─────────┐ ┌──────┐ ┌─────────┐
   │  Input  │ │   AR    │ │ Data │ │ Network │
   │ Gesture │ │   Viz   │ │ Pers │ │  Sync   │
   │ System  │ │ System  │ │ ist  │ │ System  │
   └────┬────┘ └────┬────┘ └──┬───┘ └────┬────┘
        │           │         │          │
        └───────────┼─────────┼──────────┘
                    │         │
                    ▼         ▼
            ┌────────────────────────┐
            │     AR UI System       │
            │  (Canvas & Panels)     │
            └────────────────────────┘
                    │
                    ▼
            ┌────────────────────────┐
            │   AR Camera Setup      │
            │  (AR Foundation)       │
            └────────────────────────┘
```

## Core Systems

### 1. ARManager (`Scripts/Core/ARManager.cs`)
**Purpose**: Central coordinator that initializes and manages all AR systems
- Initializes all subsystems in correct order
- Provides high-level API for AR operations
- Manages scene lifecycle
- Coordinates inter-system communication

**Key Methods**:
- `Initialize()` - Initialize all systems
- `CreateARObject()` - Create new AR object
- `UpdateARObject()` - Update existing object
- `LoadScene()` / `SaveCurrentScene()` - Scene management
- `GetApplicationStatus()` - Get app state

### 2. ARVisualizationSystem (`Scripts/AR/ARVisualizationSystem.cs`)
**Purpose**: Handle 3D object creation and rendering
- Create meshes based on model type
- Apply materials and colors
- Add physics components
- Manage object lifecycle

**Supported Model Types**: Cube, Sphere, Cylinder, Capsule, Plane

### 3. InputGestureSystem (`Scripts/Input/InputGestureSystem.cs`)
**Purpose**: Detect and handle user gestures
- Single tap detection
- Double tap detection
- Long press detection
- Swipe detection
- Pinch zoom detection
- Raycast to objects

**Gesture Types**:
- `SingleTap` - Single touch
- `DoubleTap` - Double touch
- `LongPress` - Hold touch
- `Pinch` - Two-finger zoom
- `Rotate` - Two-finger rotation
- `Swipe` - Quick drag motion

### 4. PersistenceService (`Scripts/Persistence/PersistenceService.cs`)
**Purpose**: Handle data persistence and storage
- Save/load AR scenes
- Save/load individual objects
- Export/import scenes
- File management

**Storage Location**: `Application.persistentDataPath/ARData/`

### 5. NetworkingSyncSystem (`Scripts/Networking/NetworkingSyncSystem.cs`)
**Purpose**: Synchronize AR objects across multiple devices
- Support for Local (LAN) and Cloud sync modes
- Message queuing and processing
- Object creation/update/deletion sync
- Network connection management

**Sync Modes**:
- `Local` - LAN only (UDP/TCP)
- `Cloud` - Cloud API only
- `Hybrid` - Both LAN and Cloud
- `Offline` - No synchronization

### 6. ARUISystem (`Scripts/UI/ARUISystem.cs`)
**Purpose**: User interface and interaction panels
- Main menu
- Object creation panel
- Object properties panel
- Scene manager panel
- Network status display

### 7. ARCameraSetup (`Scripts/AR/ARCameraSetup.cs`)
**Purpose**: AR Foundation configuration
- Setup AR Session
- Enable plane detection
- Configure lighting estimation
- Camera configuration

## Data Models

### ARObject
```csharp
public class ARObject
{
    public string id;                    // Unique identifier
    public string name;                  // Display name
    public string modelType;             // Cube, Sphere, etc.
    public Vector3 position;             // World position
    public Quaternion rotation;          // World rotation
    public Vector3 scale;                // Local scale
    public string textureColor;          // Hex color
    public bool isPhysicsEnabled;        // Physics flag
    public float mass;                   // Rigidbody mass
    public DateTime createdAt;           // Creation timestamp
    public DateTime modifiedAt;          // Last modification
    public string metadata;              // JSON metadata
    public bool isSyncedWithServer;      // Sync status
}
```

### ARScene
```csharp
public class ARScene
{
    public string sceneId;               // Unique scene ID
    public string sceneName;             // Display name
    public ARObject[] objects;           // Array of objects
    public Vector3 sceneOrigin;          // Scene root position
    public DateTime createdAt;           // Creation time
    public DateTime lastModified;        // Last modification
}
```

## Initialization Order

1. **ARBootstrap** - Entry point
2. **ARManager** - Create and initialize manager
3. **PersistenceService** - Load saved data
4. **ARVisualizationSystem** - Initialize rendering
5. **InputGestureSystem** - Setup input handling
6. **NetworkingSyncSystem** - Initialize networking
7. **ARUISystem** - Create UI
8. **ARCameraSetup** - Configure AR Foundation

## Configuration

See `ARProjectConfig.cs` for all configurable parameters:

```csharp
APP_NAME = "AR Industrial Glasses"
APP_VERSION = "1.0.0"
TARGET_FPS = 60
OBJECT_SPAWN_DISTANCE = 2f
MAX_OBJECTS_PER_SCENE = 1000
SYNC_INTERVAL = 0.5f
CAMERA_FOV = 60f
```

## File Structure

```
Assets/
├── Scripts/
│   ├── Core/
│   │   ├── ARManager.cs
│   │   ├── ARBootstrap.cs
│   │   ├── ARProjectConfig.cs
│   │   └── ARProjectTests.cs
│   ├── AR/
│   │   ├── ARVisualizationSystem.cs
│   │   └── ARCameraSetup.cs
│   ├── UI/
│   │   └── ARUISystem.cs
│   ├── Input/
│   │   └── InputGestureSystem.cs
│   ├── Networking/
│   │   └── NetworkingSyncSystem.cs
│   ├── Persistence/
│   │   └── PersistenceService.cs
│   ├── Models/
│   │   └── ARObject.cs
│   ├── Services/
│   └── Utils/
├── Prefabs/
│   ├── AR/
│   ├── UI/
│   └── Objects/
├── Materials/
├── Data/
└── Scenes/
    └── Main.unity (ARBootstrap scene)
```

## Usage Examples

### Create AR Object
```csharp
Vector3 spawnPos = Camera.main.transform.position + Camera.main.transform.forward * 2f;
ARManager.Instance.CreateARObject(spawnPos, "Cube", "My Cube");
```

### Handle Gestures
```csharp
InputGestureSystem.Instance.OnGestureDetected += (gesture) => {
    switch(gesture.gestureType) {
        case InputGestureSystem.GestureType.SingleTap:
            Debug.Log("Tapped at: " + gesture.position);
            break;
        case InputGestureSystem.GestureType.LongPress:
            // Create object
            break;
    }
};
```

### Save/Load Scene
```csharp
// Save
ARManager.Instance.SaveCurrentScene("My Scene");

// Load
var scenes = ARManager.Instance.GetAllSavedScenes();
if (scenes.Count > 0) {
    ARManager.Instance.LoadScene(scenes[0].sceneId);
}
```

### Network Synchronization
```csharp
NetworkingSyncSystem.Instance.SetSyncMode(NetworkingSyncSystem.SyncMode.Cloud);
if (NetworkingSyncSystem.Instance.IsConnected()) {
    Debug.Log("Connected!");
}
```

## Networking Protocol

### Message Format
```json
{
    "messageType": "create|update|delete|query",
    "objectData": { /* ARObject data */ },
    "senderId": "device_id",
    "timestamp": 1234567890,
    "targetIds": ["object_id_1", "object_id_2"]
}
```

### Message Types
- `create` - Create new object on remote
- `update` - Update object on remote
- `delete` - Delete object on remote
- `query` - Request remote object state
- `object_data` - Response with object data

## Performance Guidelines

- **Target FPS**: 60 fps for smooth AR experience
- **Max Objects**: 1000 objects per scene (configurable)
- **Sync Interval**: 0.5 seconds (configurable)
- **Memory**: Optimized for mobile devices

## Testing

Run tests via: Window > TextExecution > Test Runner

Test coverage includes:
- Data model tests
- Visualization tests
- Persistence tests
- Networking tests
- Integration tests
- Performance benchmarks

## Troubleshooting

1. **AR not working**: Check AR Foundation installation and device support
2. **Objects not appearing**: Check camera setup and object spawn distance
3. **Persistence issues**: Check file permissions and storage path
4. **Network sync failing**: Check device connectivity and cloud server URL
5. **UI not responsive**: Ensure InputGestureSystem is initialized

## Future Enhancements

- [ ] Advanced gesture recognition (rotation, scaling)
- [ ] AI-assisted object placement
- [ ] Analytics and telemetry
- [ ] Advanced cloud backend
- [ ] Multi-player real-time collaboration
- [ ] AR cloud anchors
- [ ] Custom 3D model loading
- [ ] Voice commands
- [ ] Hand gesture recognition

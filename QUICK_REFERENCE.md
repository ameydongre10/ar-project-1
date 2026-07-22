# AR GLASSES PROJECT - QUICK REFERENCE

## 🎯 Start Here

1. **Read**: README.md (overview)
2. **Setup**: SETUP_GUIDE.md (installation)
3. **Understand**: ARCHITECTURE.md (system design)
4. **Implement**: Use code examples below

---

## ⚡ Quick Commands (In Editor)

```
C     Create Cube
S     Create Sphere
P     Print Status
L     Load Last Scene
N     Save New Scene
Del   Clear Scene
H     Help
```

---

## 💻 Core API Cheat Sheet

### Create Objects
```csharp
// Basic
ARManager.Instance.CreateARObject(position, "Cube");

// With name
ARManager.Instance.CreateARObject(pos, "Sphere", "My Object");

// In front of camera
var pos = Camera.main.transform.position + 
          Camera.main.transform.forward * 2f;
ARManager.Instance.CreateARObject(pos, "Cylinder");
```

### Manage Objects
```csharp
// Update
ARObject obj = new ARObject { id = "123", position = newPos };
ARManager.Instance.UpdateARObject(obj);

// Delete
ARManager.Instance.DeleteARObject(objectId);

// Get current scene
ARScene scene = ARVisualizationSystem.Instance.GetCurrentScene();
```

### Save/Load Scenes
```csharp
// Save
ARManager.Instance.SaveCurrentScene("My Scene");

// Load
var scenes = ARManager.Instance.GetAllSavedScenes();
if (scenes.Count > 0) {
    ARManager.Instance.LoadScene(scenes[0].sceneId);
}

// Clear
ARManager.Instance.ClearScene();
```

### Handle Gestures
```csharp
InputGestureSystem.Instance.OnGestureDetected += (gesture) => {
    switch(gesture.gestureType) {
        case InputGestureSystem.GestureType.SingleTap:
            break;
        case InputGestureSystem.GestureType.LongPress:
            break;
        case InputGestureSystem.GestureType.Swipe:
            break;
        case InputGestureSystem.GestureType.Pinch:
            break;
    }
};
```

### Network Sync
```csharp
// Set mode
NetworkingSyncSystem.Instance.SetSyncMode(
    NetworkingSyncSystem.SyncMode.Local  // or Cloud, Hybrid, Offline
);

// Check connection
if (NetworkingSyncSystem.Instance.IsConnected()) {
    Debug.Log("Connected!");
}

// Listen to events
NetworkingSyncSystem.Instance.OnObjectCreated += (id) => {
    Debug.Log($"Object created: {id}");
};
```

### Persistence
```csharp
// Save object
var obj = new ARObject { /* ... */ };
PersistenceService.Instance.SaveObject(obj);

// Load object
var loaded = PersistenceService.Instance.LoadObject(objectId);

// Get all scenes
var scenes = PersistenceService.Instance.GetAllScenes();
```

---

## 📁 File Locations

```
Project Root/
├── Assets/Scripts/
│   ├── Core/ARManager.cs           ← Main coordinator
│   ├── AR/ARVisualizationSystem.cs  ← 3D objects
│   ├── Input/InputGestureSystem.cs  ← Gestures
│   ├── Persistence/PersistenceService.cs
│   ├── Networking/NetworkingSyncSystem.cs
│   ├── UI/ARUISystem.cs
│   └── Models/ARObject.cs
├── README.md                        ← Start here
├── SETUP_GUIDE.md                   ← Installation
├── ARCHITECTURE.md                  ← System design
└── IMPLEMENTATION_COMPLETE.md       ← Status
```

---

## 🎮 Model Types

```csharp
"Cube"      // Box shape
"Sphere"    // Round shape
"Cylinder"  // Cylindrical shape
"Capsule"   // Capsule/pill shape
"Plane"     // Flat plane
```

---

## 🌐 Sync Modes

```csharp
SyncMode.Local      // LAN only
SyncMode.Cloud      // Cloud API only
SyncMode.Hybrid     // Both LAN + Cloud
SyncMode.Offline    // No sync
```

---

## 🎨 Colors

```csharp
// Use hex color format
"#FF0000"   // Red
"#00FF00"   // Green
"#0000FF"   // Blue
"#FFFFFF"   // White
"#000000"   // Black
"#FFD700"   // Gold
```

---

## 📊 ARObject Structure

```csharp
ARObject obj = new ARObject
{
    id = "unique-id",
    name = "Object Name",
    modelType = "Cube",
    position = Vector3.zero,
    rotation = Quaternion.identity,
    scale = Vector3.one,
    textureColor = "#FFFFFF",
    isPhysicsEnabled = false,
    mass = 1f,
    createdAt = DateTime.UtcNow,
    modifiedAt = DateTime.UtcNow,
    metadata = "{}"
};
```

---

## 🎛️ Configuration

Edit `Scripts/Core/ARProjectConfig.cs`:

```csharp
// Performance
TARGET_FPS = 60
MAX_OBJECTS = 1000
SPAWN_DISTANCE = 2f

// Network
CLOUD_URL = "https://api.arglasses.local"
SYNC_INTERVAL = 0.5f

// Camera
CAMERA_FOV = 60f
NEAR_CLIP = 0.1f
FAR_CLIP = 1000f

// Gestures
TAP_THRESHOLD = 0.1f
LONG_PRESS = 0.5f
SWIPE_THRESHOLD = 50f
PINCH_THRESHOLD = 0.05f
```

---

## 🔍 Common Tasks

### Position at Tap
```csharp
if (ARUtils.ScreenToWorldPointAR(screenPos, out Vector3 worldPos)) {
    ARManager.Instance.CreateARObject(worldPos, "Sphere");
}
```

### Check if In View
```csharp
if (ARUtils.IsInCameraView(worldPosition)) {
    // Object is visible
}
```

### Get Distance from Camera
```csharp
float distance = ARUtils.GetDistanceFromCamera(position);
```

### Get Camera Forward
```csharp
Vector3 forward = ARUtils.GetCameraForward();
```

---

## 🧪 Running Tests

```
Window > TextExecution > Test Runner > Run All Tests
```

Test categories:
- Data model tests
- Visualization tests
- Persistence tests
- Networking tests
- Integration tests
- Performance benchmarks

---

## 🐛 Debugging

### Print Status
```csharp
ARManager.Instance.PrintStatus();
```

### Enable Debug Mode
In ARBootstrap.cs:
```csharp
[SerializeField] private bool debugMode = true;
```

### Check Connections
```csharp
Debug.Log(NetworkingSyncSystem.Instance.IsConnected());
```

### Get All Scenes
```csharp
var scenes = ARManager.Instance.GetAllSavedScenes();
Debug.Log($"Scenes: {scenes.Count}");
```

---

## 📱 Mobile Testing

### Android
1. Build > Build and Run
2. Grant camera permission
3. Press C/S to create objects

### iOS
1. Build > Build and Run (XCode)
2. Deploy to device
3. Grant camera permission

---

## 🚨 Troubleshooting

**Objects not visible?**
```csharp
// Check spawn distance
ARProjectConfig.OBJECT_SPAWN_DISTANCE = 2f;
```

**App crashes?**
```csharp
// Enable debug logs
Debug.Log("AR initialized: " + ARManager.Instance);
```

**Network not working?**
```csharp
Debug.Log("Connected: " + NetworkingSyncSystem.Instance.IsConnected());
```

**Save not working?**
```csharp
// Check path
Debug.Log(Application.persistentDataPath);
```

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| README.md | Overview & quick start |
| ARCHITECTURE.md | System design & details |
| SETUP_GUIDE.md | Installation & setup |
| IMPLEMENTATION_COMPLETE.md | Project status |
| This file | Quick reference |

---

## 🎓 Learning Sequence

1. Read **README.md** (5 min)
2. Follow **SETUP_GUIDE.md** (15 min)
3. Study **ARCHITECTURE.md** (20 min)
4. Review examples in **ARProjectConfig.cs** (10 min)
5. Run **ARProjectTests.cs** (5 min)
6. Try code examples above (30 min)
7. Create custom feature (60+ min)

---

## 🚀 First Project Goals

**Week 1**:
- [ ] Setup Unity project
- [ ] Run in editor
- [ ] Create/save/load objects

**Week 2**:
- [ ] Build to Android/iOS
- [ ] Test on device
- [ ] Customize UI

**Week 3**:
- [ ] Setup cloud networking
- [ ] Test multiplayer
- [ ] Add custom models

**Week 4**:
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Production deployment

---

## 💡 Pro Tips

1. **Always save scenes** before testing
2. **Use debug mode** for development
3. **Profile performance** with Unity Profiler
4. **Test on device** early and often
5. **Version your scenes** with timestamps
6. **Use descriptive names** for objects
7. **Monitor network traffic** during sync
8. **Back up data regularly**

---

## 📞 Getting Help

1. Check inline code comments
2. Read ARCHITECTURE.md
3. Run test suite to understand patterns
4. Review usage examples in ARProjectConfig.cs
5. Enable debug logs
6. Check console for errors

---

## 🎯 Common Patterns

### Listen to Events
```csharp
// Gestures
InputGestureSystem.Instance.OnGestureDetected += HandleGesture;

// Networking
NetworkingSyncSystem.Instance.OnObjectCreated += HandleObjectCreated;

// Unsubscribe when done
InputGestureSystem.Instance.OnGestureDetected -= HandleGesture;
```

### Singleton Access
```csharp
ARManager.Instance
ARVisualizationSystem.Instance
InputGestureSystem.Instance
PersistenceService.Instance
NetworkingSyncSystem.Instance
ARUISystem.Instance
```

### Create + Save Pattern
```csharp
var obj = ARManager.Instance.CreateARObject(pos, "Cube");
ARManager.Instance.SaveCurrentScene("My Scene");
```

### Load + Visualize Pattern
```csharp
ARManager.Instance.LoadScene(sceneId);
```

---

**Status**: ✅ Ready to Use  
**Version**: 1.0.0  
**Last Updated**: 2024  

🎉 You have a complete AR application! Start building! 🚀

# AR Glasses Project - Setup & Installation Guide

## 📋 Prerequisites

- **Unity Version**: 2021.3 LTS or higher
- **Target Platforms**: Android (ARCore), iOS (ARKit)
- **Minimum OS**: Android 7.0, iOS 13+
- **.NET Version**: .NET 4.x

## 🔧 Installation Steps

### 1. Import Required Packages

Open Unity Package Manager (Window > TextMesh Pro > Import TMP Essentials) and add:

```
com.unity.xr.arfoundation (4.2.0 or higher)
com.unity.xr.arcore (5.0.0 or higher) - for Android
com.unity.xr.arkit (5.0.0 or higher) - for iOS
com.unity.xr.interaction.toolkit (2.3.0 or higher)
```

### 2. Project Settings Configuration

#### For Android (ARCore):

1. Go to Edit > Project Settings > Player
2. Set **Minimum API Level**: 24 or higher
3. Set **Target API Level**: 31 or higher
4. Enable **IL2CPP** scripting backend (recommended)
5. Add permissions in AndroidManifest.xml:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-feature android:name="android.hardware.camera.ar" />
   ```

#### For iOS (ARKit):

1. Go to Edit > Project Settings > Player
2. Set **Minimum iOS Version**: 13
3. Add Camera Usage Description in Info.plist
4. Enable required capabilities:
   - Camera
   - ARKit

### 3. Scene Setup

1. Create a new scene called "Main"
2. Delete default camera (AR Foundation provides its own)
3. Add the following GameObject hierarchy:

```
Scene Root
├── AR Session (ARSession component)
├── AR Session Origin (ARSessionOrigin component)
│   └── Main Camera (ARCameraManager component)
│       └── Canvas (ScreenSpaceOverlay)
└── ARManager (ARBootstrap script attached)
    ├── PersistenceService
    ├── ARVisualizationSystem
    ├── InputGestureSystem
    ├── NetworkingSyncSystem
    └── ARUISystem
```

4. Save scene as "Assets/Scenes/Main.unity"

### 4. AR Foundation Configuration

1. Select AR Session Origin in hierarchy
2. In Inspector, configure:
   - **Tracking Type**: "Rotation and Position"
   - **Update Tracking Type**: "Update"

3. Select Main Camera
   - Add **ARCameraManager** component
   - Enable **Automatic Focus**
   - Set **Focus Mode**: "Auto"

4. Add **ARPlaneManager** to camera for plane detection
5. Add **ARLightEstimationManager** for lighting

### 5. Build Settings

1. Go to File > Build Settings
2. Select target platform (Android or iOS)
3. Add "Main" scene to Build Scenes
4. Set **Scenes/Main** as scene 0
5. Configure quality settings:
   - Set **V Sync Count**: 1
   - Target Frame Rate: 60

## ▶️ Running the Application

### In Editor (Development)
- Simply press Play in Unity
- Use keyboard shortcuts (see ARBootstrap.cs):
  - `C` - Create Cube
  - `S` - Create Sphere
  - `P` - Print Status
  - `L` - Load Last Scene
  - `N` - Save Scene
  - `Delete` - Clear Scene

### On Android Device
1. Build and Run to Android device
2. Grant camera permissions when prompted
3. The app will automatically initialize all AR systems

### On iOS Device
1. Build XCode project
2. Deploy to iOS device via XCode
3. Grant camera permissions when prompted

## 🎮 User Controls

### On Mobile Device
- **Tap** on an empty area: Select object at that position
- **Long Press** (0.5s): Open object creation menu
- **Swipe**: Gesture detection (implement in InputGestureSystem)
- **Pinch** (two fingers): Zoom gesture

### Mobile UI
- **New Object** - Create new AR object at camera position
- **Load Scene** - Load previously saved scene
- **Save Scene** - Save current scene state
- **Settings** - Open settings menu

## 📁 Project Structure

```
Assets/
├── Scripts/          # All C# source code
├── Prefabs/          # Reusable GameObjects
├── Materials/        # Material assets
├── Data/             # Configuration files
└── Scenes/
    └── Main.unity    # Main AR scene

ProjectSettings/
├── ProjectSettings.asset
├── EditorBuildSettings.asset
└── [platform-specific settings]
```

## 🔐 Permissions Required

### Android
```
android.permission.CAMERA
android.permission.INTERNET
android.permission.READ_EXTERNAL_STORAGE
android.permission.WRITE_EXTERNAL_STORAGE
```

### iOS
```
NSCameraUsageDescription
NSLocalNetworkUsageDescription
NSBonjourServiceTypes
```

## 🌐 Network Configuration

### Local Area Network (LAN)
- Default port: 7777
- Protocol: UDP/TCP
- Requires devices on same network

### Cloud Sync
- Cloud Server URL: `https://api.arglasses.local/sync`
- Protocol: HTTP/REST with JSON
- Requires internet connection
- Configurable in ARProjectConfig.cs

## 📊 Configuration

Edit `Scripts/Core/ARProjectConfig.cs` to configure:

```csharp
APP_NAME = "AR Industrial Glasses"
APP_VERSION = "1.0.0"
TARGET_FPS = 60
OBJECT_SPAWN_DISTANCE = 2f
MAX_OBJECTS_PER_SCENE = 1000
SYNC_INTERVAL = 0.5f
CAMERA_FOV = 60f
```

## ✅ Verification Checklist

- [ ] Unity 2021.3+ installed
- [ ] AR Foundation packages imported
- [ ] Player settings configured for target platform
- [ ] Main scene created with AR setup
- [ ] All scripts compiled without errors
- [ ] AR permissions added
- [ ] Camera and AR Foundation components configured
- [ ] Device tested (or emulator for Android)

## 🐛 Troubleshooting

### Problem: AR objects not visible
**Solution**: 
- Check camera near/far clip planes (0.1-1000)
- Verify object spawn distance (default 2m)
- Check main camera is tagged correctly

### Problem: App crashes on startup
**Solution**:
- Check all scripts compile without errors
- Verify AR Foundation is installed
- Check device meets minimum OS requirements

### Problem: Networking not working
**Solution**:
- Check devices are on same network (for LAN)
- Verify cloud server URL is correct
- Check firewall settings
- Test with NetworkingSyncSystem.Instance.PrintStatus()

### Problem: Persistence not saving
**Solution**:
- Check Application.persistentDataPath accessibility
- Verify storage permissions granted
- Check disk space available
- Try using external storage (Android)

### Problem: Performance issues
**Solution**:
- Reduce MAX_OBJECTS_PER_SCENE in config
- Disable plane detection if not needed
- Reduce quality settings
- Profile with Unity Profiler

## 📚 Additional Resources

- [AR Foundation Docs](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@latest)
- [ARCore Developer Guide](https://developers.google.com/ar/docs)
- [ARKit Developer Guide](https://developer.apple.com/arkit)
- [XR Interaction Toolkit](https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@latest)

## 🚀 Next Steps

1. **Test basic functionality**: Run in editor, create/save objects
2. **Test on device**: Build and deploy to mobile device
3. **Configure networking**: Set up cloud server or LAN sync
4. **Customize UI**: Modify ARUISystem for your needs
5. **Add custom models**: Extend ARVisualizationSystem for 3D models
6. **Implement features**: Add voice commands, analytics, etc.

## 📝 License

This AR Glasses Project is provided as-is for commercial and personal use.

## 💬 Support

For issues or questions:
1. Check ARCHITECTURE.md for system design
2. Review inline code comments
3. Run ARProjectTests for validation
4. Check console logs for error messages

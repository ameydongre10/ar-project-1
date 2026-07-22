// AR GLASSES PROJECT - CONFIGURATION
// Industrial 3D Object Visualization for Mobile AR (ARCore/ARKit)

using UnityEngine;

/// <summary>
/// Project-wide configuration and constants
/// </summary>
public static class ARProjectConfig
{
    // Application Info
    public const string APP_NAME = "AR Industrial Glasses";
    public const string APP_VERSION = "1.0.0";
    public const string DEVELOPER = "Your Company";

    // Features
    public const bool ENABLE_3D_VISUALIZATION = true;
    public const bool ENABLE_NETWORKING = true;
    public const bool ENABLE_PERSISTENCE = true;
    public const bool ENABLE_GESTURE_INPUT = true;
    public const bool ENABLE_UI = true;

    // Performance
    public const int TARGET_FPS = 60;
    public const float OBJECT_SPAWN_DISTANCE = 2f;
    public const int MAX_OBJECTS_PER_SCENE = 1000;

    // Networking
    public const string CLOUD_API_URL = "https://api.arglasses.local";
    public const float SYNC_INTERVAL = 0.5f;
    public const int NETWORK_PORT = 7777;

    // Camera
    public const float CAMERA_NEAR_CLIP = 0.1f;
    public const float CAMERA_FAR_CLIP = 1000f;
    public const float CAMERA_FOV = 60f;

    // Gesture Thresholds
    public const float TAP_THRESHOLD = 0.1f;
    public const float LONG_PRESS_THRESHOLD = 0.5f;
    public const float SWIPE_THRESHOLD = 50f;
    public const float PINCH_THRESHOLD = 0.05f;

    // Storage
    public const string SAVE_FOLDER = "ARData";
    public const string SCENES_FOLDER = "Scenes";
    public const string OBJECTS_FOLDER = "Objects";
}

/// <summary>
/// Project dependencies and initialization order
/// </summary>
public class ProjectDependencies
{
    /*
    INITIALIZATION ORDER (Critical for proper functioning):
    
    1. ARManager (Main coordinator)
       ↓
    2. PersistenceService (Data loading)
       ↓
    3. ARVisualizationSystem (3D rendering)
       ↓
    4. InputGestureSystem (User interaction)
       ↓
    5. NetworkingSyncSystem (Multiplayer sync)
       ↓
    6. ARUISystem (User interface)
       ↓
    7. ARCameraSetup (AR Foundation configuration)
    
    SYSTEM INTERACTIONS:
    - Input → Visualization → UI → Networking
    - Networking → Visualization → Persistence
    - Persistence ← All systems (on save)
    
    ASSET REQUIREMENTS:
    - Unity 2021.3 or higher
    - AR Foundation package
    - XR Interaction Toolkit
    - TextMesh Pro (for UI)
    
    PLATFORM REQUIREMENTS:
    - Android: ARCore support
    - iOS: ARKit support
    - Minimum OS: Android 7.0, iOS 13+
    */
}

/// <summary>
/// Quick start guide and API examples
/// </summary>
public class UsageExamples : MonoBehaviour
{
    public void OnGUI()
    {
        GUILayout.BeginArea(new Rect(10, 10, 300, 500));

        if (GUILayout.Button("Create Cube Object", GUILayout.Height(40)))
        {
            Vector3 pos = ARUtils.GetCameraPosition() + ARUtils.GetCameraForward() * 2f;
            ARManager.Instance.CreateARObject(pos, "Cube", "Test Cube");
        }

        if (GUILayout.Button("Create Sphere Object", GUILayout.Height(40)))
        {
            Vector3 pos = ARUtils.GetCameraPosition() + ARUtils.GetCameraForward() * 2f;
            ARManager.Instance.CreateARObject(pos, "Sphere", "Test Sphere");
        }

        if (GUILayout.Button("Save Current Scene", GUILayout.Height(40)))
        {
            ARManager.Instance.SaveCurrentScene("Scene_" + System.DateTime.Now.Ticks);
        }

        if (GUILayout.Button("Clear Scene", GUILayout.Height(40)))
        {
            ARManager.Instance.ClearScene();
        }

        if (GUILayout.Button("Print Status", GUILayout.Height(40)))
        {
            ARManager.Instance.PrintStatus();
        }

        if (GUILayout.Button("Load Last Scene", GUILayout.Height(40)))
        {
            var scenes = ARManager.Instance.GetAllSavedScenes();
            if (scenes.Count > 0)
            {
                ARManager.Instance.LoadScene(scenes[scenes.Count - 1].sceneId);
            }
        }

        GUILayout.EndArea();
    }

    /*
    BASIC USAGE EXAMPLES:
    
    // 1. Create AR Object
    Vector3 spawnPos = Camera.main.transform.position + Camera.main.transform.forward * 2f;
    ARManager.Instance.CreateARObject(spawnPos, "Cube");
    
    // 2. Load Saved Scene
    var scenes = ARManager.Instance.GetAllSavedScenes();
    if (scenes.Count > 0) {
        ARManager.Instance.LoadScene(scenes[0].sceneId);
    }
    
    // 3. Save Current Scene
    ARManager.Instance.SaveCurrentScene("My Scene");
    
    // 4. Clear Scene
    ARManager.Instance.ClearScene();
    
    // 5. Handle Gestures
    InputGestureSystem.Instance.OnGestureDetected += (gesture) => {
        switch(gesture.gestureType) {
            case InputGestureSystem.GestureType.SingleTap:
                Debug.Log("Tapped: " + gesture.position);
                break;
            case InputGestureSystem.GestureType.LongPress:
                // Create object at tap position
                ARUtils.ScreenToWorldPointAR(gesture.position, out Vector3 pos);
                ARManager.Instance.CreateARObject(pos, "Sphere");
                break;
        }
    };
    
    // 6. Check Network Status
    if (NetworkingSyncSystem.Instance.IsConnected()) {
        Debug.Log("Connected to network");
    }
    
    // 7. Get Application Status
    var status = ARManager.Instance.GetApplicationStatus();
    Debug.Log($"Objects: {status.objectCount}");
    */
}

using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Central AR Manager that coordinates all AR systems
/// Entry point for the AR application
/// </summary>
public class ARManager : MonoBehaviour
{
    public static ARManager Instance { get; private set; }

    [SerializeField] private bool autoInitialize = true;
    [SerializeField] private NetworkingSyncSystem.SyncMode initialSyncMode = NetworkingSyncSystem.SyncMode.Local;

    // System references
    private PersistenceService persistenceService;
    private ARVisualizationSystem visualizationSystem;
    private InputGestureSystem inputSystem;
    private NetworkingSyncSystem networkingSystem;
    private ARUISystem uiSystem;

    private List<ARObject> currentSceneObjects = new List<ARObject>();
    private string currentSceneId;
    private bool isInitialized = false;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        if (autoInitialize)
        {
            Initialize();
        }
    }

    /// <summary>
    /// Initialize all AR systems
    /// </summary>
    public void Initialize()
    {
        if (isInitialized)
        {
            Debug.LogWarning("AR Manager already initialized");
            return;
        }

        Debug.Log("=== Initializing AR Glasses Application ===");

        // Initialize core systems in order
        InitializePersistence();
        InitializeVisualization();
        InitializeInput();
        InitializeNetworking();
        InitializeUI();

        // Setup system interactions
        ConnectSystems();

        isInitialized = true;
        Debug.Log("=== AR Glasses Application Initialized ===");
    }

    private void InitializePersistence()
    {
        // Create PersistenceService if not exists
        if (FindObjectOfType<PersistenceService>() == null)
        {
            GameObject go = new GameObject("PersistenceService");
            persistenceService = go.AddComponent<PersistenceService>();
        }
        else
        {
            persistenceService = FindObjectOfType<PersistenceService>();
        }

        Debug.Log("✓ Persistence Service initialized");
    }

    private void InitializeVisualization()
    {
        if (FindObjectOfType<ARVisualizationSystem>() == null)
        {
            GameObject go = new GameObject("ARVisualizationSystem");
            visualizationSystem = go.AddComponent<ARVisualizationSystem>();
        }
        else
        {
            visualizationSystem = FindObjectOfType<ARVisualizationSystem>();
        }

        Debug.Log("✓ Visualization System initialized");
    }

    private void InitializeInput()
    {
        if (FindObjectOfType<InputGestureSystem>() == null)
        {
            GameObject go = new GameObject("InputGestureSystem");
            inputSystem = go.AddComponent<InputGestureSystem>();
        }
        else
        {
            inputSystem = FindObjectOfType<InputGestureSystem>();
        }

        Debug.Log("✓ Input/Gesture System initialized");
    }

    private void InitializeNetworking()
    {
        if (FindObjectOfType<NetworkingSyncSystem>() == null)
        {
            GameObject go = new GameObject("NetworkingSyncSystem");
            networkingSystem = go.AddComponent<NetworkingSyncSystem>();
        }
        else
        {
            networkingSystem = FindObjectOfType<NetworkingSyncSystem>();
        }

        networkingSystem.SetSyncMode(initialSyncMode);
        Debug.Log("✓ Networking/Sync System initialized");
    }

    private void InitializeUI()
    {
        if (FindObjectOfType<ARUISystem>() == null)
        {
            GameObject go = new GameObject("ARUISystem");
            uiSystem = go.AddComponent<ARUISystem>();
        }
        else
        {
            uiSystem = FindObjectOfType<ARUISystem>();
        }

        Debug.Log("✓ UI System initialized");
    }

    /// <summary>
    /// Connect all systems together
    /// </summary>
    private void ConnectSystems()
    {
        // Input -> Visualization
        if (inputSystem != null && visualizationSystem != null)
        {
            inputSystem.OnGestureDetected += HandleInputGesture;
        }

        // Networking -> Visualization
        if (networkingSystem != null && visualizationSystem != null)
        {
            networkingSystem.OnObjectCreated += HandleRemoteObjectCreated;
            networkingSystem.OnObjectUpdated += HandleRemoteObjectUpdated;
            networkingSystem.OnObjectDeleted += HandleRemoteObjectDeleted;
        }

        Debug.Log("✓ Systems connected");
    }

    /// <summary>
    /// Create a new AR object
    /// </summary>
    public ARObject CreateARObject(Vector3 position, string modelType, string name = null)
    {
        ARObject obj = new ARObject
        {
            id = System.Guid.NewGuid().ToString(),
            name = name ?? modelType + "_" + System.DateTime.Now.Millisecond,
            modelType = modelType,
            position = position,
            textureColor = GetRandomColor()
        };

        // Visualize
        visualizationSystem.VisualizeARObject(obj);
        currentSceneObjects.Add(obj);

        // Sync over network
        if (networkingSystem != null)
        {
            networkingSystem.SyncObjectCreation(obj, GetDeviceId());
        }

        // Persist
        if (persistenceService != null)
        {
            persistenceService.SaveObject(obj);
        }

        Debug.Log($"AR Object created: {obj.name} ({obj.id})");
        return obj;
    }

    /// <summary>
    /// Update an AR object
    /// </summary>
    public void UpdateARObject(ARObject obj)
    {
        visualizationSystem.UpdateARObject(obj);

        if (networkingSystem != null)
        {
            networkingSystem.SyncObjectUpdate(obj, GetDeviceId());
        }

        if (persistenceService != null)
        {
            persistenceService.SaveObject(obj);
        }

        Debug.Log($"AR Object updated: {obj.id}");
    }

    /// <summary>
    /// Delete an AR object
    /// </summary>
    public void DeleteARObject(string objectId)
    {
        visualizationSystem.RemoveARObject(objectId);
        currentSceneObjects.RemoveAll(o => o.id == objectId);

        if (networkingSystem != null)
        {
            networkingSystem.SyncObjectDeletion(objectId, GetDeviceId());
        }

        Debug.Log($"AR Object deleted: {objectId}");
    }

    /// <summary>
    /// Save current scene
    /// </summary>
    public void SaveCurrentScene(string sceneName = null)
    {
        ARScene scene = visualizationSystem.GetCurrentScene();
        scene.sceneName = sceneName ?? scene.sceneName;
        currentSceneId = scene.sceneId;

        if (persistenceService != null)
        {
            persistenceService.SaveScene(scene);
        }

        Debug.Log($"Scene saved: {scene.sceneName} ({scene.sceneId})");
    }

    /// <summary>
    /// Load a scene
    /// </summary>
    public void LoadScene(string sceneId)
    {
        if (persistenceService == null)
            return;

        ARScene scene = persistenceService.LoadScene(sceneId);
        if (scene != null)
        {
            visualizationSystem.ClearScene();
            visualizationSystem.VisualizeScene(scene);
            currentSceneId = sceneId;
            currentSceneObjects = new List<ARObject>(scene.objects);

            Debug.Log($"Scene loaded: {scene.sceneName} ({sceneId})");
        }
        else
        {
            Debug.LogError($"Failed to load scene: {sceneId}");
        }
    }

    /// <summary>
    /// Get all saved scenes
    /// </summary>
    public List<ARScene> GetAllSavedScenes()
    {
        if (persistenceService == null)
            return new List<ARScene>();

        return persistenceService.GetAllScenes();
    }

    /// <summary>
    /// Clear current scene
    /// </summary>
    public void ClearScene()
    {
        visualizationSystem.ClearScene();
        currentSceneObjects.Clear();
        currentSceneId = null;

        Debug.Log("Scene cleared");
    }

    /// <summary>
    /// Handle gesture input
    /// </summary>
    private void HandleInputGesture(InputGestureSystem.GestureData gesture)
    {
        switch (gesture.gestureType)
        {
            case InputGestureSystem.GestureType.SingleTap:
                if (gesture.targetObject != null)
                {
                    Debug.Log($"Object tapped: {gesture.targetObject.name}");
                }
                break;

            case InputGestureSystem.GestureType.LongPress:
                Debug.Log($"Long press at {gesture.position}");
                break;

            case InputGestureSystem.GestureType.Pinch:
                Debug.Log($"Pinch gesture with magnitude: {gesture.magnitude}");
                break;

            case InputGestureSystem.GestureType.Swipe:
                Debug.Log($"Swipe gesture: {gesture.delta}");
                break;
        }
    }

    /// <summary>
    /// Handle remote object creation
    /// </summary>
    private void HandleRemoteObjectCreated(string objectId)
    {
        Debug.Log($"Remote object created: {objectId}");
    }

    /// <summary>
    /// Handle remote object update
    /// </summary>
    private void HandleRemoteObjectUpdated(string objectId)
    {
        Debug.Log($"Remote object updated: {objectId}");
    }

    /// <summary>
    /// Handle remote object deletion
    /// </summary>
    private void HandleRemoteObjectDeleted(string objectId)
    {
        Debug.Log($"Remote object deleted: {objectId}");
    }

    /// <summary>
    /// Get device ID
    /// </summary>
    private string GetDeviceId()
    {
        return SystemInfo.deviceUniqueIdentifier;
    }

    /// <summary>
    /// Get random color
    /// </summary>
    private string GetRandomColor()
    {
        Color randomColor = new Color(Random.value, Random.value, Random.value);
        return "#" + ColorUtility.ToHtmlStringRGB(randomColor);
    }

    /// <summary>
    /// Get application status
    /// </summary>
    public ARApplicationStatus GetApplicationStatus()
    {
        return new ARApplicationStatus
        {
            isInitialized = isInitialized,
            currentSceneId = currentSceneId,
            objectCount = currentSceneObjects.Count,
            isNetworkConnected = networkingSystem?.IsConnected() ?? false,
            syncMode = initialSyncMode.ToString(),
            deviceId = GetDeviceId()
        };
    }

    /// <summary>
    /// Print application status to console
    /// </summary>
    public void PrintStatus()
    {
        ARApplicationStatus status = GetApplicationStatus();
        Debug.Log("=== AR Application Status ===");
        Debug.Log($"Initialized: {status.isInitialized}");
        Debug.Log($"Current Scene ID: {status.currentSceneId}");
        Debug.Log($"Objects in Scene: {status.objectCount}");
        Debug.Log($"Network Connected: {status.isNetworkConnected}");
        Debug.Log($"Sync Mode: {status.syncMode}");
        Debug.Log($"Device ID: {status.deviceId}");
    }
}

/// <summary>
/// Data structure for application status
/// </summary>
public class ARApplicationStatus
{
    public bool isInitialized;
    public string currentSceneId;
    public int objectCount;
    public bool isNetworkConnected;
    public string syncMode;
    public string deviceId;
}

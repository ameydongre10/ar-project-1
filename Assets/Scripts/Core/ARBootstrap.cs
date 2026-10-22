using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Bootstrap scene for AR application
/// This is the entry point that initializes all systems
/// </summary>
public class ARBootstrap : MonoBehaviour
{
    [SerializeField] private bool debugMode = true;
    [SerializeField] private NetworkingSyncSystem.SyncMode syncMode = NetworkingSyncSystem.SyncMode.Local;

    private ARManager arManager;
    private ARCameraSetup cameraSetup;

    private void Awake()
    {
        // Ensure only one instance
        if (FindObjectsOfType<ARBootstrap>().Length > 1)
        {
            Destroy(gameObject);
            return;
        }

        DontDestroyOnLoad(gameObject);

        // Establish the manager before scene Start callbacks can use it.
        InitializeApplication();
    }

    private void Start()
    {
        Debug.Log("=== AR Glasses Application Starting ===");

        if (!CheckSystemRequirements())
        {
            Debug.LogError("System requirements not met!");
            return;
        }

        SetupDebugTools();
    }

    /// <summary>
    /// Check if system meets requirements
    /// </summary>
    private bool CheckSystemRequirements()
    {
        Debug.Log($"Device: {SystemInfo.deviceModel}");
        Debug.Log($"OS: {SystemInfo.operatingSystem}");
        Debug.Log($"RAM: {SystemInfo.systemMemorySize}MB");
        Debug.Log($"GPU: {SystemInfo.graphicsDeviceName}");

        // Check AR support
        if (!ARCameraSetup.IsARSupported())
        {
            Debug.LogWarning("Device may not fully support AR");
        }

        return true;
    }

    /// <summary>
    /// Initialize the AR application
    /// </summary>
    private void InitializeApplication()
    {
        if (ARManager.Instance == null)
        {
            GameObject arManagerGO = new GameObject("ARManager");
            arManager = arManagerGO.AddComponent<ARManager>();
        }
        else
        {
            arManager = ARManager.Instance;
        }

        if (FindObjectOfType<ARCameraSetup>() == null)
        {
            GameObject cameraSetupGO = new GameObject("ARCameraSetup");
            cameraSetup = cameraSetupGO.AddComponent<ARCameraSetup>();
        }
        else
        {
            cameraSetup = FindObjectOfType<ARCameraSetup>();
        }

        // Set application settings
        QualitySettings.vSyncCount = 1;
        Application.targetFrameRate = ARProjectConfig.TARGET_FPS;

        Debug.Log("Application initialized successfully");
    }

    /// <summary>
    /// Setup debug tools and UI
    /// </summary>
    private void SetupDebugTools()
    {
        if (!debugMode)
            return;

        Debug.Log("Debug mode enabled - press 'H' for help");
    }

    private void Update()
    {
        if (!debugMode)
            return;

        HandleDebugInput();
    }

    /// <summary>
    /// Handle debug keyboard input
    /// </summary>
    private void HandleDebugInput()
    {
        if (Input.GetKeyDown(KeyCode.H))
        {
            PrintDebugHelp();
        }

        if (Input.GetKeyDown(KeyCode.C))
        {
            CreateAtCamera("Cube");
        }

        if (Input.GetKeyDown(KeyCode.S))
        {
            CreateAtCamera("Sphere");
        }

        if (Input.GetKeyDown(KeyCode.P))
        {
            ARManager.Instance.PrintStatus();
        }

        if (Input.GetKeyDown(KeyCode.L))
        {
            var scenes = ARManager.Instance.GetAllSavedScenes();
            if (scenes.Count > 0)
            {
                ARManager.Instance.LoadScene(scenes[scenes.Count - 1].sceneId);
            }
        }

        if (Input.GetKeyDown(KeyCode.N))
        {
            ARManager.Instance.SaveCurrentScene($"Scene_{System.DateTime.Now.Ticks}");
        }

        if (Input.GetKeyDown(KeyCode.Delete))
        {
            ARManager.Instance.ClearScene();
        }
    }

    private void CreateAtCamera(string modelType)
    {
        if (Camera.main == null || ARManager.Instance == null)
        {
            Debug.LogWarning("Cannot create object: AR camera or manager is unavailable.");
            return;
        }

        Vector3 screenCenter = new Vector3(Screen.width * 0.5f, Screen.height * 0.5f, 0f);
        if (ARUtils.ScreenToWorldPointAR(screenCenter, out Vector3 position))
        {
            ARManager.Instance.CreateARObject(position, modelType);
        }
        else
        {
            Debug.LogWarning("Cannot place object until a tracked surface is detected.");
        }
    }

    /// <summary>
    /// Print debug help
    /// </summary>
    private void PrintDebugHelp()
    {
        Debug.Log(@"
=== AR GLASSES DEBUG COMMANDS ===
C - Create Cube object
S - Create Sphere object
P - Print status
L - Load last scene
N - Save new scene
Delete - Clear scene
H - Print this help
================================
        ");
    }
}

/// <summary>
/// Manages application lifecycle and state
/// </summary>
public class ARApplicationLifecycle : MonoBehaviour
{
    private static ARApplicationLifecycle instance;
    private bool isPaused = false;

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(gameObject);
            return;
        }

        instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void OnApplicationPause(bool pauseStatus)
    {
        isPaused = pauseStatus;

        if (pauseStatus)
        {
            Debug.Log("Application paused - saving state");
            SaveApplicationState();
        }
        else
        {
            Debug.Log("Application resumed - restoring state");
            RestoreApplicationState();
        }
    }

    private void OnApplicationQuit()
    {
        Debug.Log("Application quitting - final save");
        SaveApplicationState();
    }

    private void SaveApplicationState()
    {
        if (ARManager.Instance != null)
        {
            ARManager.Instance.SaveCurrentScene();
        }
    }

    private void RestoreApplicationState()
    {
        // Restore any necessary state
    }

    public bool IsPaused => isPaused;
}

/// <summary>
/// Scene initialization helper
/// </summary>
public class SceneInitializer : MonoBehaviour
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    public static void InitializeOnLoad()
    {
        Debug.Log("Initializing AR Scene...");

        // Create a bootstrap before scene Awake/Start callbacks. The bootstrap
        // creates the manager in Awake, so dependent scene scripts see it in time.
        if (FindObjectOfType<ARBootstrap>() == null)
        {
            GameObject bootstrapGO = new GameObject("ARBootstrap");
            bootstrapGO.AddComponent<ARBootstrap>();
            bootstrapGO.AddComponent<ARApplicationLifecycle>();
        }
    }
}

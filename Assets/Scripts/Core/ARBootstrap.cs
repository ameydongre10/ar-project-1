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
    }

    private void Start()
    {
        Debug.Log("=== AR Glasses Application Starting ===");

        if (!CheckSystemRequirements())
        {
            Debug.LogError("System requirements not met!");
            return;
        }

        InitializeApplication();
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
        // Create AR Manager
        GameObject arManagerGO = new GameObject("ARManager");
        arManager = arManagerGO.AddComponent<ARManager>();

        // Create Camera Setup
        GameObject cameraSetupGO = new GameObject("ARCameraSetup");
        cameraSetup = cameraSetupGO.AddComponent<ARCameraSetup>();

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
            Vector3 spawnPos = Camera.main.transform.position + Camera.main.transform.forward * 2f;
            ARManager.Instance.CreateARObject(spawnPos, "Cube");
        }

        if (Input.GetKeyDown(KeyCode.S))
        {
            Vector3 spawnPos = Camera.main.transform.position + Camera.main.transform.forward * 2f;
            ARManager.Instance.CreateARObject(spawnPos, "Sphere");
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

        // Ensure AR Manager exists
        if (FindObjectOfType<ARManager>() == null)
        {
            GameObject bootstrapGO = new GameObject("ARBootstrap");
            bootstrapGO.AddComponent<ARBootstrap>();
            bootstrapGO.AddComponent<ARApplicationLifecycle>();
        }
    }
}

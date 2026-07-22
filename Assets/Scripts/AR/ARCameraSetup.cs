using UnityEngine;
using UnityEngine.XR.ARFoundation;

/// <summary>
/// Configures AR Foundation for mobile AR (ARCore/ARKit)
/// Handles plane detection, lighting estimation, and camera setup
/// </summary>
public class ARCameraSetup : MonoBehaviour
{
    [SerializeField] private ARSession arSession;
    [SerializeField] private ARCameraManager arCameraManager;
    [SerializeField] private ARPlaneManager arPlaneManager;
    [SerializeField] private ARLightEstimationManager arLightManager;

    [SerializeField] private bool enablePlaneDetection = true;
    [SerializeField] private bool enableLightEstimation = true;
    [SerializeField] private ARPlaneManager.DetectionMode planeDetectionMode = ARPlaneManager.DetectionMode.Horizontal;

    private Camera mainCamera;

    private void Awake()
    {
        SetupARComponents();
        SetupCamera();
    }

    /// <summary>
    /// Setup AR Foundation components
    /// </summary>
    private void SetupARComponents()
    {
        // Get AR Session
        if (arSession == null)
        {
            arSession = FindObjectOfType<ARSession>();
            if (arSession == null)
            {
                Debug.LogWarning("No ARSession found in scene. Creating one...");
                GameObject sessionGO = new GameObject("ARSession");
                arSession = sessionGO.AddComponent<ARSession>();
            }
        }

        // Get AR Camera Manager
        if (arCameraManager == null)
        {
            arCameraManager = FindObjectOfType<ARCameraManager>();
            if (arCameraManager == null)
            {
                Debug.LogWarning("No ARCameraManager found. AR camera features may not work.");
            }
        }

        // Setup Plane Manager
        if (enablePlaneDetection)
        {
            if (arPlaneManager == null)
            {
                arPlaneManager = FindObjectOfType<ARPlaneManager>();
            }

            if (arPlaneManager != null)
            {
                arPlaneManager.detectionMode = planeDetectionMode;
                Debug.Log($"Plane detection enabled: {planeDetectionMode}");
            }
        }

        // Setup Light Estimation
        if (enableLightEstimation)
        {
            if (arLightManager == null)
            {
                arLightManager = FindObjectOfType<ARLightEstimationManager>();
            }

            if (arLightManager != null)
            {
                Debug.Log("Light estimation enabled");
            }
        }

        Debug.Log("AR components setup complete");
    }

    /// <summary>
    /// Setup main camera
    /// </summary>
    private void SetupCamera()
    {
        mainCamera = Camera.main;

        if (mainCamera == null)
        {
            GameObject cameraGO = new GameObject("Main Camera");
            mainCamera = cameraGO.AddComponent<Camera>();
            cameraGO.tag = "MainCamera";
        }

        // Configure camera for AR
        mainCamera.nearClipPlane = 0.1f;
        mainCamera.farClipPlane = 1000f;
        mainCamera.fieldOfView = 60f;

        Debug.Log("Camera setup complete");
    }

    /// <summary>
    /// Check if AR is supported on this device
    /// </summary>
    public static bool IsARSupported()
    {
        return SystemInfo.supportsRayTracing || 
               (Application.platform == RuntimePlatform.Android || 
                Application.platform == RuntimePlatform.IPhonePlayer);
    }

    /// <summary>
    /// Enable/disable plane detection
    /// </summary>
    public void SetPlaneDetection(bool enabled)
    {
        if (arPlaneManager != null)
        {
            arPlaneManager.enabled = enabled;
        }
    }

    /// <summary>
    /// Enable/disable light estimation
    /// </summary>
    public void SetLightEstimation(bool enabled)
    {
        if (arLightManager != null)
        {
            arLightManager.enabled = enabled;
        }
    }

    /// <summary>
    /// Get detected planes
    /// </summary>
    public ARPlane[] GetDetectedPlanes()
    {
        if (arPlaneManager == null)
            return new ARPlane[0];

        return arPlaneManager.GetComponentsInChildren<ARPlane>();
    }
}

/// <summary>
/// Manages AR plane visualization and interaction
/// </summary>
public class ARPlaneInteraction : MonoBehaviour
{
    private ARPlaneManager planeManager;
    private Material planeMaterial;

    private void Start()
    {
        planeManager = FindObjectOfType<ARPlaneManager>();
        CreatePlaneMaterial();
    }

    /// <summary>
    /// Create material for plane visualization
    /// </summary>
    private void CreatePlaneMaterial()
    {
        planeMaterial = new Material(Shader.Find("Standard"));
        planeMaterial.SetColor("_Color", new Color(0, 1, 1, 0.3f));
        planeMaterial.SetFloat("_Metallic", 0.5f);
        planeMaterial.SetFloat("_Smoothness", 0.8f);
    }

    /// <summary>
    /// Toggle plane visualization
    /// </summary>
    public void SetPlanesVisible(bool visible)
    {
        if (planeManager == null)
            return;

        foreach (ARPlane plane in planeManager.trackables)
        {
            plane.GetComponent<Renderer>().enabled = visible;
        }
    }

    /// <summary>
    /// Place object on detected plane
    /// </summary>
    public bool TryPlaceObjectOnPlane(Vector3 screenPosition, out Vector3 worldPosition)
    {
        worldPosition = Vector3.zero;

        if (planeManager == null)
            return false;

        Ray ray = Camera.main.ScreenPointToRay(screenPosition);

        foreach (ARPlane plane in planeManager.trackables)
        {
            if (plane.GetComponent<Collider>().Raycast(ray, out RaycastHit hit, 1000))
            {
                worldPosition = hit.point;
                return true;
            }
        }

        return false;
    }
}

/// <summary>
/// Utility class for AR-specific operations
/// </summary>
public static class ARUtils
{
    /// <summary>
    /// Convert screen position to world position in AR space
    /// </summary>
    public static bool ScreenToWorldPointAR(Vector2 screenPosition, out Vector3 worldPosition)
    {
        worldPosition = Vector3.zero;
        Camera camera = Camera.main;

        if (camera == null)
            return false;

        Ray ray = camera.ScreenPointToRay(screenPosition);

        // Try to hit any AR plane or object
        if (Physics.Raycast(ray, out RaycastHit hit))
        {
            worldPosition = hit.point;
            return true;
        }

        // Fallback: place at fixed distance from camera
        worldPosition = ray.origin + ray.direction * 2f;
        return true;
    }

    /// <summary>
    /// Get distance from camera to point
    /// </summary>
    public static float GetDistanceFromCamera(Vector3 worldPosition)
    {
        Camera camera = Camera.main;
        if (camera == null)
            return 0;

        return Vector3.Distance(camera.transform.position, worldPosition);
    }

    /// <summary>
    /// Check if point is in camera view
    /// </summary>
    public static bool IsInCameraView(Vector3 worldPosition)
    {
        Camera camera = Camera.main;
        if (camera == null)
            return false;

        Vector3 screenPoint = camera.WorldToScreenPoint(worldPosition);
        return screenPoint.x > 0 && screenPoint.x < Screen.width &&
               screenPoint.y > 0 && screenPoint.y < Screen.height &&
               screenPoint.z > 0;
    }

    /// <summary>
    /// Get camera forward direction
    /// </summary>
    public static Vector3 GetCameraForward()
    {
        Camera camera = Camera.main;
        return camera != null ? camera.transform.forward : Vector3.forward;
    }

    /// <summary>
    /// Get camera position
    /// </summary>
    public static Vector3 GetCameraPosition()
    {
        Camera camera = Camera.main;
        return camera != null ? camera.transform.position : Vector3.zero;
    }
}

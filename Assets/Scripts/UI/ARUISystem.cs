using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

/// <summary>
/// Manages the AR UI overlay for object creation, manipulation, and scene management
/// </summary>
public class ARUISystem : MonoBehaviour
{
    public static ARUISystem Instance { get; private set; }

    [SerializeField] private Canvas mainCanvas;
    [SerializeField] private CanvasScaler canvasScaler;

    // UI Panels
    private GameObject mainMenuPanel;
    private GameObject objectCreationPanel;
    private GameObject objectPropertiesPanel;
    private GameObject sceneManagerPanel;
    private GameObject networkStatusPanel;

    // Current state
    private ARObject selectedObject;
    private bool isCreatingObject = false;

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
        InitializeUI();
        SetupEventListeners();
    }

    /// <summary>
    /// Initialize all UI panels
    /// </summary>
    private void InitializeUI()
    {
        if (mainCanvas == null)
        {
            GameObject canvasGO = new GameObject("ARUICanvas");
            mainCanvas = canvasGO.AddComponent<Canvas>();
            mainCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasScaler = canvasGO.AddComponent<CanvasScaler>();
        }

        CreateMainMenuPanel();
        CreateObjectCreationPanel();
        CreateObjectPropertiesPanel();
        CreateSceneManagerPanel();
        CreateNetworkStatusPanel();

        Debug.Log("AR UI System initialized");
    }

    /// <summary>
    /// Setup event listeners
    /// </summary>
    private void SetupEventListeners()
    {
        if (InputGestureSystem.Instance != null)
        {
            InputGestureSystem.Instance.OnGestureDetected += HandleGesture;
        }

        if (NetworkingSyncSystem.Instance != null)
        {
            NetworkingSyncSystem.Instance.OnConnectionStatusChanged += UpdateNetworkStatus;
        }
    }

    /// <summary>
    /// Create main menu panel
    /// </summary>
    private void CreateMainMenuPanel()
    {
        mainMenuPanel = new GameObject("MainMenuPanel");
        mainMenuPanel.transform.SetParent(mainCanvas.transform, false);

        RectTransform rt = mainMenuPanel.AddComponent<RectTransform>();
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = new Vector2(1, 0.15f);
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;

        Image bgImage = mainMenuPanel.AddComponent<Image>();
        bgImage.color = new Color(0, 0, 0, 0.7f);

        // Create buttons
        CreateButton("New Object", mainMenuPanel.transform, 0.1f, () => ShowObjectCreationPanel());
        CreateButton("Load Scene", mainMenuPanel.transform, 0.35f, () => ShowSceneManagerPanel());
        CreateButton("Save Scene", mainMenuPanel.transform, 0.6f, () => SaveCurrentScene());
        CreateButton("Settings", mainMenuPanel.transform, 0.85f, () => Debug.Log("Settings clicked"));
    }

    /// <summary>
    /// Create object creation panel
    /// </summary>
    private void CreateObjectCreationPanel()
    {
        objectCreationPanel = new GameObject("ObjectCreationPanel");
        objectCreationPanel.transform.SetParent(mainCanvas.transform, false);
        objectCreationPanel.SetActive(false);

        RectTransform rt = objectCreationPanel.AddComponent<RectTransform>();
        rt.anchorMin = new Vector2(0.5f, 0.5f);
        rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.sizeDelta = new Vector2(400, 500);

        Image bgImage = objectCreationPanel.AddComponent<Image>();
        bgImage.color = new Color(0.2f, 0.2f, 0.2f, 0.95f);

        // Add title
        Text titleText = CreateText("Create AR Object", objectCreationPanel.transform, 50);
        titleText.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 200);

        // Add model type selector
        CreateButton("Cube", objectCreationPanel.transform, -50, () => CreateARObject("Cube"));
        CreateButton("Sphere", objectCreationPanel.transform, 0, () => CreateARObject("Sphere"));
        CreateButton("Cylinder", objectCreationPanel.transform, 50, () => CreateARObject("Cylinder"));
        CreateButton("Capsule", objectCreationPanel.transform, 100, () => CreateARObject("Capsule"));

        // Close button
        CreateButton("Close", objectCreationPanel.transform, 200, () => HideObjectCreationPanel());
    }

    /// <summary>
    /// Create object properties panel
    /// </summary>
    private void CreateObjectPropertiesPanel()
    {
        objectPropertiesPanel = new GameObject("ObjectPropertiesPanel");
        objectPropertiesPanel.transform.SetParent(mainCanvas.transform, false);
        objectPropertiesPanel.SetActive(false);

        RectTransform rt = objectPropertiesPanel.AddComponent<RectTransform>();
        rt.anchorMin = new Vector2(1, 1);
        rt.anchorMax = new Vector2(1, 1);
        rt.anchoredPosition = new Vector2(-200, -150);
        rt.sizeDelta = new Vector2(350, 300);

        Image bgImage = objectPropertiesPanel.AddComponent<Image>();
        bgImage.color = new Color(0.2f, 0.2f, 0.2f, 0.9f);

        // Add content
        Text titleText = CreateText("Object Properties", objectPropertiesPanel.transform, 40);
        titleText.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 120);

        // Properties display (will be populated when object is selected)
    }

    /// <summary>
    /// Create scene manager panel
    /// </summary>
    private void CreateSceneManagerPanel()
    {
        sceneManagerPanel = new GameObject("SceneManagerPanel");
        sceneManagerPanel.transform.SetParent(mainCanvas.transform, false);
        sceneManagerPanel.SetActive(false);

        RectTransform rt = sceneManagerPanel.AddComponent<RectTransform>();
        rt.anchorMin = new Vector2(0.5f, 0.5f);
        rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.sizeDelta = new Vector2(400, 500);

        Image bgImage = sceneManagerPanel.AddComponent<Image>();
        bgImage.color = new Color(0.2f, 0.2f, 0.2f, 0.95f);

        Text titleText = CreateText("Scene Manager", sceneManagerPanel.transform, 50);
        titleText.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 200);

        // Load scenes dropdown would go here
        CreateButton("New Scene", sceneManagerPanel.transform, 50, () => CreateNewScene());
        CreateButton("Close", sceneManagerPanel.transform, 200, () => HideSceneManagerPanel());
    }

    /// <summary>
    /// Create network status panel
    /// </summary>
    private void CreateNetworkStatusPanel()
    {
        networkStatusPanel = new GameObject("NetworkStatusPanel");
        networkStatusPanel.transform.SetParent(mainCanvas.transform, false);

        RectTransform rt = networkStatusPanel.AddComponent<RectTransform>();
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = new Vector2(0.2f, 0.1f);
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;

        Image bgImage = networkStatusPanel.AddComponent<Image>();
        bgImage.color = new Color(0, 0, 0, 0.5f);

        Text statusText = CreateText("Offline", networkStatusPanel.transform, 20);
        statusText.alignment = TextAnchor.MiddleCenter;
        statusText.name = "NetworkStatusText";
    }

    /// <summary>
    /// Helper to create a button
    /// </summary>
    private void CreateButton(string text, Transform parent, float yOffset, System.Action onClick)
    {
        GameObject buttonGO = new GameObject(text + "Button");
        buttonGO.transform.SetParent(parent, false);

        RectTransform rt = buttonGO.AddComponent<RectTransform>();
        rt.sizeDelta = new Vector2(150, 40);
        rt.anchoredPosition = new Vector2(0, yOffset);

        Image btnImage = buttonGO.AddComponent<Image>();
        btnImage.color = new Color(0.2f, 0.7f, 1f, 0.8f);

        Button btn = buttonGO.AddComponent<Button>();
        btn.onClick.AddListener(() => onClick?.Invoke());

        Text btnText = CreateText(text, buttonGO.transform, 18);
        btnText.alignment = TextAnchor.MiddleCenter;
        btnText.color = Color.white;
    }

    /// <summary>
    /// Helper to create text UI element
    /// </summary>
    private Text CreateText(string content, Transform parent, int fontSize)
    {
        GameObject textGO = new GameObject(content + "Text");
        textGO.transform.SetParent(parent, false);

        RectTransform rt = textGO.AddComponent<RectTransform>();
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;

        Text txt = textGO.AddComponent<Text>();
        txt.text = content;
        txt.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        txt.fontSize = fontSize;
        txt.fontStyle = FontStyle.Bold;
        txt.alignment = TextAnchor.MiddleCenter;
        txt.color = Color.white;

        return txt;
    }

    /// <summary>
    /// Create a new AR object
    /// </summary>
    private void CreateARObject(string modelType)
    {
        ARObject obj = new ARObject
        {
            name = modelType + System.DateTime.Now.Millisecond,
            modelType = modelType,
            position = GetSpawnPosition(),
            textureColor = GetRandomColor()
        };

        GameObject visualized = ARVisualizationSystem.Instance.VisualizeARObject(obj);
        
        // Sync with network
        if (NetworkingSyncSystem.Instance != null)
        {
            NetworkingSyncSystem.Instance.SyncObjectCreation(obj, SystemInfo.deviceUniqueIdentifier);
        }

        // Save to persistence
        PersistenceService.Instance.SaveObject(obj);

        HideObjectCreationPanel();
    }

    /// <summary>
    /// Get spawn position
    /// </summary>
    private Vector3 GetSpawnPosition()
    {
        return Camera.main.transform.position + Camera.main.transform.forward * 2f;
    }

    /// <summary>
    /// Get random color
    /// </summary>
    private string GetRandomColor()
    {
        Color randomColor = new Color(
            Random.value,
            Random.value,
            Random.value
        );
        return "#" + ColorUtility.ToHtmlStringRGB(randomColor);
    }

    /// <summary>
    /// Save current scene
    /// </summary>
    private void SaveCurrentScene()
    {
        ARScene scene = ARVisualizationSystem.Instance.GetCurrentScene();
        PersistenceService.Instance.SaveScene(scene);
        Debug.Log("Scene saved: " + scene.sceneId);
    }

    /// <summary>
    /// Create new scene
    /// </summary>
    private void CreateNewScene()
    {
        ARVisualizationSystem.Instance.ClearScene();
        HideSceneManagerPanel();
    }

    /// <summary>
    /// Show/Hide panels
    /// </summary>
    public void ShowObjectCreationPanel()
    {
        objectCreationPanel.SetActive(true);
    }

    public void HideObjectCreationPanel()
    {
        objectCreationPanel.SetActive(false);
    }

    public void ShowSceneManagerPanel()
    {
        sceneManagerPanel.SetActive(true);
    }

    public void HideSceneManagerPanel()
    {
        sceneManagerPanel.SetActive(false);
    }

    public void ShowObjectPropertiesPanel(ARObject obj)
    {
        selectedObject = obj;
        objectPropertiesPanel.SetActive(true);
    }

    public void HideObjectPropertiesPanel()
    {
        objectPropertiesPanel.SetActive(false);
    }

    /// <summary>
    /// Handle gesture input
    /// </summary>
    private void HandleGesture(InputGestureSystem.GestureData gesture)
    {
        switch (gesture.gestureType)
        {
            case InputGestureSystem.GestureType.SingleTap:
                if (gesture.targetObject != null)
                {
                    ARObjectComponent comp = gesture.targetObject.GetComponent<ARObjectComponent>();
                    if (comp != null)
                    {
                        comp.SetSelected(true);
                        ShowObjectPropertiesPanel(comp.GetARObject());
                    }
                }
                break;
            case InputGestureSystem.GestureType.LongPress:
                ShowObjectCreationPanel();
                break;
        }
    }

    /// <summary>
    /// Update network status display
    /// </summary>
    private void UpdateNetworkStatus(bool isConnected)
    {
        Text statusText = networkStatusPanel.GetComponentInChildren<Text>();
        if (statusText != null)
        {
            statusText.text = isConnected ? "Connected" : "Offline";
            statusText.color = isConnected ? Color.green : Color.red;
        }
    }
}

using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// Manages the creation and visualization of AR objects in the 3D scene
/// </summary>
public class ARVisualizationSystem : MonoBehaviour
{
    public static ARVisualizationSystem Instance { get; private set; }

    [SerializeField] private Material defaultMaterial;
    [SerializeField] private float objectSpawnDistance = 2f;

    private Dictionary<string, GameObject> visualizedObjects = new Dictionary<string, GameObject>();
    private Dictionary<string, ARObject> arObjectsData = new Dictionary<string, ARObject>();

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

    /// <summary>
    /// Create and visualize an AR object in the scene
    /// </summary>
    public GameObject VisualizeARObject(ARObject arObject)
    {
        if (visualizedObjects.ContainsKey(arObject.id))
        {
            Debug.LogWarning($"AR object already visualized: {arObject.id}");
            return visualizedObjects[arObject.id];
        }

        // Create container
        GameObject container = new GameObject(arObject.name);
        container.transform.position = arObject.position;
        container.transform.rotation = arObject.rotation;
        container.transform.localScale = arObject.scale;

        // Create 3D mesh based on type
        GameObject meshObject = CreateMesh(arObject.modelType);
        meshObject.transform.SetParent(container.transform);
        meshObject.transform.localPosition = Vector3.zero;
        meshObject.transform.localRotation = Quaternion.identity;
        meshObject.transform.localScale = Vector3.one;

        // Apply material and color
        ApplyMaterial(meshObject, arObject.textureColor);

        // Add physics if enabled
        if (arObject.isPhysicsEnabled)
        {
            AddPhysics(container, arObject.mass);
        }

        // Add AR object component for tracking
        ARObjectComponent arComponent = container.AddComponent<ARObjectComponent>();
        arComponent.SetARObject(arObject);

        // Store references
        visualizedObjects[arObject.id] = container;
        arObjectsData[arObject.id] = arObject;

        Debug.Log($"AR object visualized: {arObject.name} ({arObject.id})");
        return container;
    }

    /// <summary>
    /// Create a 3D mesh based on model type
    /// </summary>
    private GameObject CreateMesh(string modelType)
    {
        GameObject meshObject = null;

        switch (modelType.ToLower())
        {
            case "cube":
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
                break;
            case "sphere":
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                break;
            case "cylinder":
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                break;
            case "capsule":
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Capsule);
                break;
            case "plane":
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Plane);
                break;
            default:
                meshObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
                break;
        }

        // Remove collider from primitive (we'll add our own if needed)
        Collider col = meshObject.GetComponent<Collider>();
        if (col != null)
            DestroyImmediate(col);

        return meshObject;
    }

    /// <summary>
    /// Apply material and color to object
    /// </summary>
    private void ApplyMaterial(GameObject obj, string colorHex)
    {
        Renderer renderer = obj.GetComponent<Renderer>();
        if (renderer == null)
            return;

        Material mat = new Material(Shader.Find("Standard"));

        if (ColorUtility.TryParseHtmlString(colorHex, out Color color))
        {
            mat.color = color;
        }

        renderer.material = mat;
    }

    /// <summary>
    /// Add physics components to object
    /// </summary>
    private void AddPhysics(GameObject obj, float mass)
    {
        Rigidbody rb = obj.AddComponent<Rigidbody>();
        rb.mass = mass;
        rb.isKinematic = false;

        if (obj.GetComponent<Collider>() == null)
        {
            obj.AddComponent<BoxCollider>();
        }
    }

    /// <summary>
    /// Remove an AR object from visualization
    /// </summary>
    public bool RemoveARObject(string objectId)
    {
        if (visualizedObjects.TryGetValue(objectId, out GameObject obj))
        {
            Destroy(obj);
            visualizedObjects.Remove(objectId);
            arObjectsData.Remove(objectId);
            Debug.Log($"AR object removed: {objectId}");
            return true;
        }
        return false;
    }

    /// <summary>
    /// Update an existing AR object
    /// </summary>
    public void UpdateARObject(ARObject arObject)
    {
        if (!visualizedObjects.TryGetValue(arObject.id, out GameObject obj))
        {
            Debug.LogWarning($"AR object not found for update: {arObject.id}");
            return;
        }

        obj.transform.position = arObject.position;
        obj.transform.rotation = arObject.rotation;
        obj.transform.localScale = arObject.scale;

        if (arObjectsData.ContainsKey(arObject.id))
        {
            arObjectsData[arObject.id] = arObject;
        }

        Debug.Log($"AR object updated: {arObject.id}");
    }

    /// <summary>
    /// Visualize an entire AR scene
    /// </summary>
    public void VisualizeScene(ARScene scene)
    {
        ClearScene();

        if (scene.objects != null)
        {
            foreach (ARObject obj in scene.objects)
            {
                VisualizeARObject(obj);
            }
        }

        Debug.Log($"Scene visualized with {scene.objects.Length} objects");
    }

    /// <summary>
    /// Clear all visualized objects
    /// </summary>
    public void ClearScene()
    {
        List<string> keysToRemove = new List<string>(visualizedObjects.Keys);
        foreach (string key in keysToRemove)
        {
            RemoveARObject(key);
        }
    }

    /// <summary>
    /// Get the current scene as ARScene object
    /// </summary>
    public ARScene GetCurrentScene()
    {
        ARScene scene = new ARScene();
        scene.objects = new ARObject[visualizedObjects.Count];

        int index = 0;
        foreach (var kvp in arObjectsData)
        {
            if (visualizedObjects.TryGetValue(kvp.Key, out GameObject obj))
            {
                ARObject data = kvp.Value.Clone();
                data.position = obj.transform.position;
                data.rotation = obj.transform.rotation;
                data.scale = obj.transform.localScale;
                scene.objects[index++] = data;
            }
        }

        return scene;
    }

    /// <summary>
    /// Get visualized object by ID
    /// </summary>
    public GameObject GetVisualizedObject(string objectId)
    {
        visualizedObjects.TryGetValue(objectId, out GameObject obj);
        return obj;
    }

    /// <summary>
    /// Get AR object data by ID
    /// </summary>
    public ARObject GetARObjectData(string objectId)
    {
        arObjectsData.TryGetValue(objectId, out ARObject obj);
        return obj;
    }
}

/// <summary>
/// Component attached to each AR object for tracking and interaction
/// </summary>
public class ARObjectComponent : MonoBehaviour
{
    private ARObject arObject;
    private bool isSelected = false;

    public void SetARObject(ARObject obj)
    {
        arObject = obj;
    }

    public ARObject GetARObject()
    {
        return arObject;
    }

    public void SetSelected(bool selected)
    {
        isSelected = selected;
        // Add visual feedback (highlight, outline, etc.)
        if (selected)
        {
            // Add outline or highlight effect
            GetComponent<Renderer>().material.color *= 1.2f;
        }
    }

    public bool IsSelected()
    {
        return isSelected;
    }

    private void OnMouseDown()
    {
        // Handle selection
        SetSelected(!isSelected);
    }
}

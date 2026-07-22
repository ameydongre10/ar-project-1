using UnityEngine;
using System.Collections.Generic;
using System.IO;

/// <summary>
/// Handles all data persistence operations (save/load) for AR scenes and objects
/// </summary>
public class PersistenceService : MonoBehaviour
{
    public static PersistenceService Instance { get; private set; }

    private string persistencePath;
    private const string SCENES_FOLDER = "ARScenes";
    private const string OBJECTS_FOLDER = "ARObjects";

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
        InitializePersistence();
    }

    private void InitializePersistence()
    {
        persistencePath = Path.Combine(Application.persistentDataPath, "ARData");

        // Create necessary directories
        string scenesPath = Path.Combine(persistencePath, SCENES_FOLDER);
        string objectsPath = Path.Combine(persistencePath, OBJECTS_FOLDER);

        if (!Directory.Exists(scenesPath))
            Directory.CreateDirectory(scenesPath);

        if (!Directory.Exists(objectsPath))
            Directory.CreateDirectory(objectsPath);

        Debug.Log($"Persistence initialized at: {persistencePath}");
    }

    /// <summary>
    /// Save an AR scene to local storage
    /// </summary>
    public bool SaveScene(ARScene scene)
    {
        try
        {
            string scenePath = Path.Combine(persistencePath, SCENES_FOLDER, $"{scene.sceneId}.json");
            string json = JsonUtility.ToJson(scene, true);
            File.WriteAllText(scenePath, json);
            Debug.Log($"Scene saved: {scenePath}");
            return true;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to save scene: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Load an AR scene from local storage
    /// </summary>
    public ARScene LoadScene(string sceneId)
    {
        try
        {
            string scenePath = Path.Combine(persistencePath, SCENES_FOLDER, $"{sceneId}.json");
            if (!File.Exists(scenePath))
            {
                Debug.LogWarning($"Scene not found: {scenePath}");
                return null;
            }

            string json = File.ReadAllText(scenePath);
            ARScene scene = JsonUtility.FromJson<ARScene>(json);
            Debug.Log($"Scene loaded: {scenePath}");
            return scene;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to load scene: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Get all saved scenes
    /// </summary>
    public List<ARScene> GetAllScenes()
    {
        List<ARScene> scenes = new List<ARScene>();
        try
        {
            string scenesPath = Path.Combine(persistencePath, SCENES_FOLDER);
            string[] files = Directory.GetFiles(scenesPath, "*.json");

            foreach (string file in files)
            {
                string json = File.ReadAllText(file);
                ARScene scene = JsonUtility.FromJson<ARScene>(json);
                if (scene != null)
                    scenes.Add(scene);
            }

            Debug.Log($"Loaded {scenes.Count} scenes from storage");
            return scenes;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to get all scenes: {ex.Message}");
            return scenes;
        }
    }

    /// <summary>
    /// Delete a saved scene
    /// </summary>
    public bool DeleteScene(string sceneId)
    {
        try
        {
            string scenePath = Path.Combine(persistencePath, SCENES_FOLDER, $"{sceneId}.json");
            if (File.Exists(scenePath))
            {
                File.Delete(scenePath);
                Debug.Log($"Scene deleted: {scenePath}");
                return true;
            }
            return false;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to delete scene: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Save a single AR object
    /// </summary>
    public bool SaveObject(ARObject obj)
    {
        try
        {
            string objectPath = Path.Combine(persistencePath, OBJECTS_FOLDER, $"{obj.id}.json");
            string json = JsonUtility.ToJson(obj, true);
            File.WriteAllText(objectPath, json);
            return true;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to save object: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Load a single AR object
    /// </summary>
    public ARObject LoadObject(string objectId)
    {
        try
        {
            string objectPath = Path.Combine(persistencePath, OBJECTS_FOLDER, $"{objectId}.json");
            if (!File.Exists(objectPath))
                return null;

            string json = File.ReadAllText(objectPath);
            return JsonUtility.FromJson<ARObject>(json);
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to load object: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Export scene to external format
    /// </summary>
    public bool ExportScene(ARScene scene, string exportPath)
    {
        try
        {
            string json = JsonUtility.ToJson(scene, true);
            File.WriteAllText(exportPath, json);
            Debug.Log($"Scene exported to: {exportPath}");
            return true;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to export scene: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Import scene from external format
    /// </summary>
    public ARScene ImportScene(string importPath)
    {
        try
        {
            if (!File.Exists(importPath))
                return null;

            string json = File.ReadAllText(importPath);
            ARScene scene = JsonUtility.FromJson<ARScene>(json);
            if (scene != null)
                SaveScene(scene);
            return scene;
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to import scene: {ex.Message}");
            return null;
        }
    }
}

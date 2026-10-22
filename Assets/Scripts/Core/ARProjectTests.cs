using UnityEngine;
using NUnit.Framework;
using System.Collections.Generic;

/// <summary>
/// Test suite for AR project core functionality
/// Run these tests via Window > TextExecution > Test Runner
/// </summary>
public class ARProjectTests
{
    private ARManager arManager;
    private ARVisualizationSystem visualizationSystem;
    private PersistenceService persistenceService;

    [SetUp]
    public void Setup()
    {
        // Create test objects
        var managerGO = new GameObject("ARManager");
        arManager = managerGO.AddComponent<ARManager>();

        var vizGO = new GameObject("ARVisualizationSystem");
        visualizationSystem = vizGO.AddComponent<ARVisualizationSystem>();

        var persistGO = new GameObject("PersistenceService");
        persistenceService = persistGO.AddComponent<PersistenceService>();
    }

    [TearDown]
    public void Teardown()
    {
        Object.Destroy(arManager.gameObject);
        Object.Destroy(visualizationSystem.gameObject);
        Object.Destroy(persistenceService.gameObject);
    }

    // ===== Data Model Tests =====

    [Test]
    public void TestARObjectCreation()
    {
        var obj = new ARObject();
        Assert.IsNotNull(obj.id);
        Assert.AreEqual(obj.scale, Vector3.one);
        Assert.AreEqual(obj.rotation, Quaternion.identity);
    }

    [Test]
    public void TestARObjectClone()
    {
        var obj = new ARObject { name = "Test", position = new Vector3(1, 2, 3) };
        var cloned = obj.Clone();

        Assert.AreEqual(obj.id, cloned.id);
        Assert.AreEqual(obj.position, cloned.position);
        Assert.AreNotEqual(obj, cloned); // Different instances
    }

    [Test]
    public void TestARSceneCreation()
    {
        var scene = new ARScene();
        Assert.IsNotNull(scene.sceneId);
        Assert.AreEqual(scene.objects.Length, 0);
    }

    // ===== Visualization System Tests =====

    [Test]
    public void TestARObjectVisualization()
    {
        var obj = new ARObject { modelType = "Cube" };
        var visualized = visualizationSystem.VisualizeARObject(obj);

        Assert.IsNotNull(visualized);
        Assert.AreEqual(visualized.name, obj.name);
    }

    [Test]
    public void TestRemoveARObject()
    {
        var obj = new ARObject { modelType = "Sphere" };
        visualizationSystem.VisualizeARObject(obj);

        bool removed = visualizationSystem.RemoveARObject(obj.id);
        Assert.IsTrue(removed);

        var retrieved = visualizationSystem.GetVisualizedObject(obj.id);
        Assert.IsNull(retrieved);
    }

    [Test]
    public void TestUpdateARObject()
    {
        var obj = new ARObject { modelType = "Cube", position = Vector3.zero };
        visualizationSystem.VisualizeARObject(obj);

        obj.position = new Vector3(1, 2, 3);
        visualizationSystem.UpdateARObject(obj);

        var retrieved = visualizationSystem.GetVisualizedObject(obj.id);
        Assert.AreEqual(retrieved.transform.position, new Vector3(1, 2, 3));
    }

    [Test]
    public void TestSceneVisualization()
    {
        var scene = new ARScene();
        scene.objects = new ARObject[2];
        scene.objects[0] = new ARObject { modelType = "Cube" };
        scene.objects[1] = new ARObject { modelType = "Sphere" };

        visualizationSystem.VisualizeScene(scene);

        var retrieved = visualizationSystem.GetCurrentScene();
        Assert.AreEqual(retrieved.objects.Length, 2);
    }

    // ===== Persistence Tests =====

    [Test]
    public void TestSaveARObject()
    {
        var obj = new ARObject { name = "PersistTest" };
        bool saved = persistenceService.SaveObject(obj);
        Assert.IsTrue(saved);
    }

    [Test]
    public void TestLoadARObject()
    {
        var original = new ARObject { name = "LoadTest" };
        persistenceService.SaveObject(original);

        var loaded = persistenceService.LoadObject(original.id);
        Assert.IsNotNull(loaded);
        Assert.AreEqual(loaded.id, original.id);
    }

    [Test]
    public void TestSaveLoadScene()
    {
        var scene = new ARScene();
        scene.objects = new ARObject[1];
        scene.objects[0] = new ARObject { name = "SceneObject" };

        bool saved = persistenceService.SaveScene(scene);
        Assert.IsTrue(saved);

        var loaded = persistenceService.LoadScene(scene.sceneId);
        Assert.IsNotNull(loaded);
        Assert.AreEqual(loaded.sceneId, scene.sceneId);
    }

    [Test]
    public void TestDeleteScene()
    {
        var scene = new ARScene();
        persistenceService.SaveScene(scene);

        bool deleted = persistenceService.DeleteScene(scene.sceneId);
        Assert.IsTrue(deleted);
    }

    // ===== AR Manager Tests =====

    [Test]
    public void TestCreateARObject()
    {
        var obj = arManager.CreateARObject(Vector3.zero, "Cube", "TestObject");
        Assert.IsNotNull(obj);
        Assert.AreEqual(obj.modelType, "Cube");
    }

    [Test]
    public void TestSaveScene()
    {
        arManager.CreateARObject(Vector3.zero, "Cube");
        arManager.SaveCurrentScene("TestScene");

        var scenes = arManager.GetAllSavedScenes();
        Assert.Greater(scenes.Count, 0);
    }

    // ===== Input System Tests =====

    [Test]
    public void TestInputGestureSystemInitialization()
    {
        var inputGO = new GameObject("InputGestureSystem");
        var inputSystem = inputGO.AddComponent<InputGestureSystem>();

        Assert.IsNotNull(inputSystem);
        Object.Destroy(inputGO);
    }

    // ===== Networking System Tests =====

    [Test]
    public void TestNetworkingSyncSystemInitialization()
    {
        var networkGO = new GameObject("NetworkingSyncSystem");
        var networkSystem = networkGO.AddComponent<NetworkingSyncSystem>();

        Assert.IsNotNull(networkSystem);
        Assert.AreEqual(networkSystem.IsConnected(), false);
        Object.Destroy(networkGO);
    }

    [Test]
    public void TestNetworkMessageSerialization()
    {
        var netObj = new NetworkingSyncSystem.NetworkedARObject
        {
            id = "test",
            name = "TestObject",
            position = Vector3.zero
        };

        string json = JsonUtility.ToJson(netObj);
        Assert.IsNotEmpty(json);

        var deserialized = JsonUtility.FromJson<NetworkingSyncSystem.NetworkedARObject>(json);
        Assert.AreEqual(deserialized.id, netObj.id);
    }

    // ===== Color & Utility Tests =====

    [Test]
    public void TestColorParsing()
    {
        bool parsed = ColorUtility.TryParseHtmlString("#FF0000", out Color color);
        Assert.IsTrue(parsed);
        Assert.AreEqual(color.r, 1f, 0.01f);
        Assert.AreEqual(color.g, 0f, 0.01f);
        Assert.AreEqual(color.b, 0f, 0.01f);
    }

    // ===== Integration Tests =====

    [Test]
    public void TestCompleteWorkflow()
    {
        // Create object
        var obj = arManager.CreateARObject(Vector3.zero, "Cube", "WorkflowTest");
        Assert.IsNotNull(obj);

        // Visualize it
        var visualized = visualizationSystem.GetVisualizedObject(obj.id);
        Assert.IsNotNull(visualized);

        // Save to persistence
        persistenceService.SaveObject(obj);
        var loaded = persistenceService.LoadObject(obj.id);
        Assert.IsNotNull(loaded);

        // Update object
        obj.position = new Vector3(1, 2, 3);
        arManager.UpdateARObject(obj);
        visualized = visualizationSystem.GetVisualizedObject(obj.id);
        Assert.AreEqual(visualized.transform.position, obj.position);

        // Delete object
        arManager.DeleteARObject(obj.id);
        visualized = visualizationSystem.GetVisualizedObject(obj.id);
        Assert.IsNull(visualized);
    }

    [Test]
    public void TestMultipleObjectsInScene()
    {
        // Create multiple objects
        for (int i = 0; i < 10; i++)
        {
            arManager.CreateARObject(new Vector3(i, 0, 0), "Sphere");
        }

        var scene = visualizationSystem.GetCurrentScene();
        Assert.AreEqual(scene.objects.Length, 10);

        // Save and load
        arManager.SaveCurrentScene("MultiObjectScene");
        var scenes = arManager.GetAllSavedScenes();
        Assert.Greater(scenes.Count, 0);
    }
}

/// <summary>
/// Regression coverage for AR placement failure behavior.
/// </summary>
public class ARPlacementRegressionTests
{
    private GameObject cameraObject;

    [SetUp]
    public void SetUp()
    {
        cameraObject = new GameObject("PlacementTestCamera");
        cameraObject.tag = "MainCamera";
        cameraObject.AddComponent<Camera>();
    }

    [TearDown]
    public void TearDown()
    {
        Object.DestroyImmediate(cameraObject);
    }

    [Test]
    public void ScreenToWorldPointReturnsFalseWhenNoSurfaceIsHit()
    {
        Vector3 position;
        bool placed = ARUtils.ScreenToWorldPointAR(new Vector2(Screen.width / 2f, Screen.height / 2f), out position);

        Assert.IsFalse(placed);
        Assert.AreEqual(Vector3.zero, position);
    }

    [Test]
    public void ScreenToWorldPointReturnsHitWhenColliderIsPresent()
    {
        GameObject target = GameObject.CreatePrimitive(PrimitiveType.Cube);
        target.transform.position = new Vector3(0f, 0f, 5f);
        try
        {
            Physics.SyncTransforms();
            bool placed = ARUtils.ScreenToWorldPointAR(new Vector2(Screen.width / 2f, Screen.height / 2f), out Vector3 position);

            Assert.IsTrue(placed);
            Assert.That(position.z, Is.GreaterThan(0f));
        }
        finally
        {
            Object.DestroyImmediate(target);
        }
    }
}

/// <summary>
/// Performance benchmark tests
/// </summary>
public class ARPerformanceBenchmarks
{
    [Test]
    [Performance]
    public void BenchmarkObjectCreation()
    {
        var arManager = new GameObject().AddComponent<ARManager>();

        Measure.Frames().Warmup(10).Run(() =>
        {
            arManager.CreateARObject(Vector3.zero, "Cube");
        });

        Object.Destroy(arManager.gameObject);
    }

    [Test]
    [Performance]
    public void BenchmarkSceneSaving()
    {
        var persistService = new GameObject().AddComponent<PersistenceService>();
        var scene = new ARScene();
        scene.objects = new ARObject[100];
        for (int i = 0; i < 100; i++)
        {
            scene.objects[i] = new ARObject();
        }

        Measure.Frames().Warmup(5).Run(() =>
        {
            persistService.SaveScene(scene);
        });

        Object.Destroy(persistService.gameObject);
    }
}

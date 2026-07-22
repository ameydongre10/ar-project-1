using UnityEngine;
using System;

/// <summary>
/// Represents a 3D object in the AR space with all necessary data for visualization and persistence
/// </summary>
[System.Serializable]
public class ARObject
{
    public string id;
    public string name;
    public string modelType; // Type of 3D model
    public Vector3 position;
    public Quaternion rotation;
    public Vector3 scale;
    public string textureColor; // Hex color or asset reference
    public bool isPhysicsEnabled;
    public float mass;
    public DateTime createdAt;
    public DateTime modifiedAt;
    public string metadata; // Additional JSON data
    public bool isSyncedWithServer;

    public ARObject()
    {
        id = System.Guid.NewGuid().ToString();
        name = "ARObject";
        modelType = "Cube";
        position = Vector3.zero;
        rotation = Quaternion.identity;
        scale = Vector3.one;
        textureColor = "#FFFFFF";
        isPhysicsEnabled = false;
        mass = 1f;
        createdAt = DateTime.UtcNow;
        modifiedAt = DateTime.UtcNow;
        metadata = "{}";
        isSyncedWithServer = false;
    }

    public ARObject Clone()
    {
        return new ARObject
        {
            id = id,
            name = name,
            modelType = modelType,
            position = position,
            rotation = rotation,
            scale = scale,
            textureColor = textureColor,
            isPhysicsEnabled = isPhysicsEnabled,
            mass = mass,
            createdAt = createdAt,
            modifiedAt = modifiedAt,
            metadata = metadata,
            isSyncedWithServer = isSyncedWithServer
        };
    }
}

/// <summary>
/// Container for multiple AR objects, used for persistence and transfer
/// </summary>
[System.Serializable]
public class ARScene
{
    public string sceneId;
    public string sceneName;
    public ARObject[] objects;
    public Vector3 sceneOrigin;
    public DateTime createdAt;
    public DateTime lastModified;

    public ARScene()
    {
        sceneId = System.Guid.NewGuid().ToString();
        sceneName = "New AR Scene";
        objects = new ARObject[0];
        sceneOrigin = Vector3.zero;
        createdAt = DateTime.UtcNow;
        lastModified = DateTime.UtcNow;
    }
}

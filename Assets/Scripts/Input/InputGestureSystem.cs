using UnityEngine;
using System;

/// <summary>
/// Handles all input and gesture detection for AR interactions
/// </summary>
public class InputGestureSystem : MonoBehaviour
{
    public static InputGestureSystem Instance { get; private set; }

    public enum GestureType
    {
        SingleTap,
        DoubleTap,
        LongPress,
        Pinch,
        Rotate,
        Swipe,
        None
    }

    public class GestureData
    {
        public GestureType gestureType;
        public Vector2 position;
        public Vector2 delta;
        public float magnitude;
        public float duration;
        public GameObject targetObject;
    }

    // Events
    public event Action<GestureData> OnGestureDetected;

    [SerializeField] private float tapThreshold = 0.1f;
    [SerializeField] private float doubleTapTimeWindow = 0.3f;
    [SerializeField] private float longPressThreshold = 0.5f;
    [SerializeField] private float pinchThreshold = 0.05f;
    [SerializeField] private float swipeThreshold = 50f;

    private float lastTapTime = 0f;
    private Vector2 lastTapPosition = Vector2.zero;
    private float pressStartTime = 0f;
    private bool isPressing = false;
    private Vector2 touchStartPosition = Vector2.zero;

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

    private void Update()
    {
        DetectTouchInput();
        DetectMouseInput();
    }

    /// <summary>
    /// Detect touch input (mobile)
    /// </summary>
    private void DetectTouchInput()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);

            switch (touch.phase)
            {
                case TouchPhase.Began:
                    HandleTouchBegan(touch);
                    break;
                case TouchPhase.Moved:
                    HandleTouchMoved(touch);
                    break;
                case TouchPhase.Ended:
                    HandleTouchEnded(touch);
                    break;
                case TouchPhase.Canceled:
                    isPressing = false;
                    break;
            }

            // Handle multi-touch gestures
            if (Input.touchCount == 2)
            {
                DetectPinch();
            }
        }
    }

    /// <summary>
    /// Detect mouse input (editor/desktop testing)
    /// </summary>
    private void DetectMouseInput()
    {
        if (Input.GetMouseButtonDown(0))
        {
            HandleMouseDown();
        }

        if (Input.GetMouseButton(0))
        {
            HandleMouseDrag();
        }

        if (Input.GetMouseButtonUp(0))
        {
            HandleMouseUp();
        }
    }

    private void HandleTouchBegan(Touch touch)
    {
        touchStartPosition = touch.position;
        pressStartTime = Time.time;
        isPressing = true;

        // Check for double tap
        if (Time.time - lastTapTime < doubleTapTimeWindow &&
            Vector2.Distance(touch.position, lastTapPosition) < tapThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.DoubleTap,
                position = touch.position,
                targetObject = GetObjectAtPosition(touch.position)
            });
            lastTapTime = 0f; // Reset to prevent triple tap
        }
        else
        {
            lastTapTime = Time.time;
            lastTapPosition = touch.position;
        }
    }

    private void HandleTouchMoved(Touch touch)
    {
        if (!isPressing)
            return;

        Vector2 delta = touch.position - touchStartPosition;
        float magnitude = delta.magnitude;

        // Check for swipe
        if (magnitude > swipeThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.Swipe,
                position = touch.position,
                delta = delta,
                magnitude = magnitude,
                targetObject = GetObjectAtPosition(touch.position)
            });
            isPressing = false;
        }
    }

    private void HandleTouchEnded(Touch touch)
    {
        if (!isPressing)
            return;

        float pressDuration = Time.time - pressStartTime;
        Vector2 delta = touch.position - touchStartPosition;

        // Check for long press
        if (pressDuration > longPressThreshold && delta.magnitude < tapThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.LongPress,
                position = touch.position,
                duration = pressDuration,
                targetObject = GetObjectAtPosition(touch.position)
            });
        }
        // Check for single tap
        else if (pressDuration < longPressThreshold && delta.magnitude < tapThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.SingleTap,
                position = touch.position,
                targetObject = GetObjectAtPosition(touch.position)
            });
        }

        isPressing = false;
    }

    private void HandleMouseDown()
    {
        touchStartPosition = Input.mousePosition;
        pressStartTime = Time.time;
        isPressing = true;
    }

    private void HandleMouseDrag()
    {
        if (!isPressing)
            return;

        Vector2 delta = (Vector2)Input.mousePosition - touchStartPosition;
        if (delta.magnitude > swipeThreshold)
        {
            isPressing = false;
        }
    }

    private void HandleMouseUp()
    {
        if (!isPressing)
            return;

        float pressDuration = Time.time - pressStartTime;
        Vector2 delta = (Vector2)Input.mousePosition - touchStartPosition;

        if (pressDuration > longPressThreshold && delta.magnitude < tapThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.LongPress,
                position = Input.mousePosition,
                duration = pressDuration,
                targetObject = GetObjectAtPosition(Input.mousePosition)
            });
        }
        else if (pressDuration < longPressThreshold && delta.magnitude < tapThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.SingleTap,
                position = Input.mousePosition,
                targetObject = GetObjectAtPosition(Input.mousePosition)
            });
        }

        isPressing = false;
    }

    /// <summary>
    /// Detect pinch gesture (two-finger zoom)
    /// </summary>
    private void DetectPinch()
    {
        Touch touch0 = Input.GetTouch(0);
        Touch touch1 = Input.GetTouch(1);

        float prevDistance = Vector2.Distance(touch0.position - touch0.deltaPosition,
                                            touch1.position - touch1.deltaPosition);
        float currentDistance = Vector2.Distance(touch0.position, touch1.position);

        float delta = Mathf.Abs(prevDistance - currentDistance);

        if (delta > pinchThreshold)
        {
            EmitGesture(new GestureData
            {
                gestureType = GestureType.Pinch,
                position = (touch0.position + touch1.position) / 2f,
                magnitude = delta * (currentDistance > prevDistance ? 1f : -1f),
                targetObject = GetObjectAtPosition((touch0.position + touch1.position) / 2f)
            });
        }
    }

    /// <summary>
    /// Get object at screen position
    /// </summary>
    private GameObject GetObjectAtPosition(Vector2 screenPosition)
    {
        Ray ray = Camera.main.ScreenPointToRay(screenPosition);
        if (Physics.Raycast(ray, out RaycastHit hit))
        {
            return hit.collider.gameObject;
        }
        return null;
    }

    /// <summary>
    /// Emit gesture event
    /// </summary>
    private void EmitGesture(GestureData gestureData)
    {
        OnGestureDetected?.Invoke(gestureData);
        Debug.Log($"Gesture detected: {gestureData.gestureType} at {gestureData.position}");
    }

    /// <summary>
    /// Get current gesture type
    /// </summary>
    public GestureType GetCurrentGestureType()
    {
        // Can be extended for more sophisticated gesture detection
        return GestureType.None;
    }
}

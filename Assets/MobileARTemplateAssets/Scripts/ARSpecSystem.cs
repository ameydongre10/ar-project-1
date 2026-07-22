using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace UnityEngine.XR.Templates.AR
{
    /// <summary>
    /// Tap-to-place AR system that swaps between product spec entries and shows a live overlay card.
    /// </summary>
    [RequireComponent(typeof(ARRaycastManager), typeof(ARAnchorManager))]
    public class ARSpecSystem : MonoBehaviour
    {
            [System.Serializable]
            public class SpecMetric
            {
                [SerializeField]
                public string label;

                [SerializeField]
                public string value;
            }

            [System.Serializable]
            public class SpecEntry
            {
                [SerializeField]
                public string displayName = "New Spec";

                [SerializeField]
                public string category = "Product";

                [TextArea(2, 5)]
                [SerializeField]
                public string summary = "Short summary shown in the overlay.";

                [TextArea(4, 10)]
                [SerializeField]
                public string description = "Longer product or object description goes here.";

                [SerializeField]
                public List<SpecMetric> metrics = new List<SpecMetric>();

                [SerializeField]
                public GameObject prefab;

                [SerializeField]
                public Sprite icon;

                [SerializeField]
                public Color accentColor = new Color(0.16f, 0.72f, 0.95f, 1f);

                [SerializeField]
                public Vector3 localPositionOffset = Vector3.zero;

                [SerializeField]
                public Vector3 localEulerOffset = Vector3.zero;

                [SerializeField]
                public Vector3 localScale = Vector3.one;
            }

            [Header("AR Placement")]
            [SerializeField]
            Camera m_ARCamera;

            [SerializeField]
            ARPlaneManager m_PlaneManager;

            [SerializeField]
            bool m_UseCenterScreenPlacement = true;

            [SerializeField]
            bool m_ReplaceCurrentPlacement = true;

            [SerializeField]
            float m_RotationSpeed = 0.12f;

            [SerializeField]
            float m_PinchScaleSpeed = 0.005f;

            [SerializeField]
            Vector2 m_MinPlacedScale = new Vector2(0.15f, 0.15f);

            [SerializeField]
            Vector2 m_MaxPlacedScale = new Vector2(3f, 3f);

            [Header("Spec Catalog")]
            [SerializeField]
            ARSpecCatalog m_SpecCatalog;

            [SerializeField]
            List<SpecEntry> m_SpecEntries = new List<SpecEntry>();

            [SerializeField]
            int m_StartingSpecIndex;

            [Header("Overlay Styling")]
            [SerializeField]
            Color m_PanelColor = new Color(0.08f, 0.09f, 0.12f, 0.88f);

            [SerializeField]
            Color m_PanelTextColor = new Color(0.95f, 0.96f, 0.98f, 1f);

            [SerializeField]
            Color m_ButtonColor = new Color(0.16f, 0.18f, 0.24f, 1f);

            [SerializeField]
            Vector2 m_PanelSize = new Vector2(520f, 320f);

            [SerializeField]
            Vector2 m_PanelOffset = new Vector2(24f, 24f);

            [SerializeField]
            int m_FontSizeTitle = 22;

            [SerializeField]
            int m_FontSizeBody = 16;

            [SerializeField]
            int m_FontSizeSmall = 14;

            readonly List<ARRaycastHit> m_Hits = new List<ARRaycastHit>();
            readonly StringBuilder m_StringBuilder = new StringBuilder(256);

            ARRaycastManager m_RaycastManager;
            ARAnchorManager m_AnchorManager;
            ARAnchor m_CurrentAnchor;
            GameObject m_PlacedInstance;
            Pose m_LastPlacementPose;
            TrackableId m_LastPlacementTrackableId = TrackableId.invalidId;
            bool m_HasPlacementPose;
            int m_SelectedSpecIndex = -1;

            Canvas m_RuntimeCanvas;
            Image m_PanelBackground;
            Image m_AccentBar;
            Image m_IconImage;
            Text m_CategoryText;
            Text m_TitleText;
            Text m_SummaryText;
            Text m_DetailsText;
            Text m_MetricsText;
            Text m_PageText;
            Text m_HintText;
            Button m_PreviousButton;
            Button m_NextButton;
            Button m_PlaceButton;
            Button m_ClearButton;

            /// <summary>
            /// Current selected spec entry.
            /// </summary>
            public SpecEntry currentSpec
            {
                get
                {
                    if (m_SelectedSpecIndex < 0 || m_SelectedSpecIndex >= m_SpecEntries.Count)
                        return null;

                    return m_SpecEntries[m_SelectedSpecIndex];
                }
            }

            void Awake()
            {
                m_RaycastManager = GetComponent<ARRaycastManager>();
                m_AnchorManager = GetComponent<ARAnchorManager>();

                if (m_RaycastManager == null)
                    m_RaycastManager = FindAnyObjectByType<ARRaycastManager>();

                if (m_AnchorManager == null)
                    m_AnchorManager = FindAnyObjectByType<ARAnchorManager>();

                if (m_PlaneManager == null)
                    m_PlaneManager = FindAnyObjectByType<ARPlaneManager>();

                if (m_SpecCatalog != null && m_SpecCatalog.specEntries != null && m_SpecCatalog.specEntries.Count > 0)
                    m_SpecEntries = new List<SpecEntry>(m_SpecCatalog.specEntries);

                if (m_ARCamera == null)
                    m_ARCamera = Camera.main;

                if (m_SpecEntries.Count > 0)
                    m_SelectedSpecIndex = Mathf.Clamp(m_StartingSpecIndex, 0, m_SpecEntries.Count - 1);

                BuildRuntimeOverlay();
                RefreshOverlay();
            }

            void Update()
            {
                if (TryManipulatePlacedInstance())
                    return;

                if (TryHandleTouchPlacement())
                    return;

                if (Input.GetMouseButtonDown(0))
                {
                    if (IsPointerOverUi(Input.mousePosition, -1))
                        return;

                    var screenPoint = m_UseCenterScreenPlacement
                        ? new Vector2(Screen.width * 0.5f, Screen.height * 0.5f)
                        : (Vector2)Input.mousePosition;
                    TryPlaceFromScreenPoint(screenPoint);
                }
            }

            bool TryHandleTouchPlacement()
            {
                if (Input.touchCount <= 0)
                    return false;

                var touch = Input.GetTouch(0);
                if (touch.phase != TouchPhase.Began)
                    return true;

                if (IsPointerOverUi(touch.position, touch.fingerId))
                    return true;

                var screenPoint = m_UseCenterScreenPlacement
                    ? new Vector2(Screen.width * 0.5f, Screen.height * 0.5f)
                    : touch.position;
                TryPlaceFromScreenPoint(screenPoint);
                return true;
            }

            bool TryManipulatePlacedInstance()
            {
                if (m_PlacedInstance == null)
                    return false;

                if (Input.touchCount == 1)
                {
                    var touch = Input.GetTouch(0);
                    if (touch.phase == TouchPhase.Moved && !IsPointerOverUi(touch.position, touch.fingerId))
                    {
                        m_PlacedInstance.transform.Rotate(Vector3.up, touch.deltaPosition.x * m_RotationSpeed, Space.World);
                        return true;
                    }
                }
                else if (Input.touchCount >= 2)
                {
                    var firstTouch = Input.GetTouch(0);
                    var secondTouch = Input.GetTouch(1);

                    if (firstTouch.phase == TouchPhase.Moved || secondTouch.phase == TouchPhase.Moved)
                    {
                        var previousDistance = (firstTouch.position - firstTouch.deltaPosition - (secondTouch.position - secondTouch.deltaPosition)).magnitude;
                        var currentDistance = (firstTouch.position - secondTouch.position).magnitude;
                        ApplyScaleDelta((currentDistance - previousDistance) * m_PinchScaleSpeed);
                        return true;
                    }
                }

                return false;
            }

            void ApplyScaleDelta(float scaleDelta)
            {
                var nextScale = m_PlacedInstance.transform.localScale + Vector3.one * scaleDelta;
                nextScale.x = Mathf.Clamp(nextScale.x, m_MinPlacedScale.x, m_MaxPlacedScale.x);
                nextScale.y = Mathf.Clamp(nextScale.y, m_MinPlacedScale.y, m_MaxPlacedScale.y);
                nextScale.z = Mathf.Clamp(nextScale.z, m_MinPlacedScale.x, m_MaxPlacedScale.x);
                m_PlacedInstance.transform.localScale = nextScale;
            }

            bool TryPlaceFromScreenPoint(Vector2 screenPoint)
            {
                if (m_SelectedSpecIndex < 0 || m_SelectedSpecIndex >= m_SpecEntries.Count)
                    return false;

                if (!m_RaycastManager.Raycast(screenPoint, m_Hits, TrackableType.PlaneWithinPolygon))
                    return false;

                m_LastPlacementTrackableId = m_Hits[0].trackableId;
                PlaceCurrentSpec(m_Hits[0].pose);
                return true;
            }

            /// <summary>
            /// Selects the next spec entry and refreshes the overlay.
            /// </summary>
            public void SelectNextSpec()
            {
                if (m_SpecEntries.Count == 0)
                    return;

                m_SelectedSpecIndex = (m_SelectedSpecIndex + 1) % m_SpecEntries.Count;
                RefreshOverlay();
                RebuildPlacementIfNeeded();
            }

            /// <summary>
            /// Selects the previous spec entry and refreshes the overlay.
            /// </summary>
            public void SelectPreviousSpec()
            {
                if (m_SpecEntries.Count == 0)
                    return;

                m_SelectedSpecIndex--;
                if (m_SelectedSpecIndex < 0)
                    m_SelectedSpecIndex = m_SpecEntries.Count - 1;

                RefreshOverlay();
                RebuildPlacementIfNeeded();
            }

            /// <summary>
            /// Places the selected spec at the center of the screen or at the last tapped pose.
            /// </summary>
            public void PlaceSelectedSpec()
            {
                if (m_HasPlacementPose)
                {
                    PlaceCurrentSpec(m_LastPlacementPose);
                    return;
                }

                TryPlaceFromScreenPoint(new Vector2(Screen.width * 0.5f, Screen.height * 0.5f));
            }

            /// <summary>
            /// Removes the currently placed object.
            /// </summary>
            public void ClearPlacedSpec()
            {
                if (m_PlacedInstance != null)
                    Destroy(m_PlacedInstance);

                if (m_CurrentAnchor != null)
                    Destroy(m_CurrentAnchor.gameObject);

                m_PlacedInstance = null;
                m_CurrentAnchor = null;
                m_HasPlacementPose = false;
                RefreshOverlay();
            }

            void PlaceCurrentSpec(Pose pose)
            {
                m_LastPlacementPose = pose;
                m_HasPlacementPose = true;

                if (m_ReplaceCurrentPlacement && m_PlacedInstance != null)
                    Destroy(m_PlacedInstance);

                if (m_ReplaceCurrentPlacement && m_CurrentAnchor != null)
                {
                    Destroy(m_CurrentAnchor.gameObject);
                    m_CurrentAnchor = null;
                }

                var spec = currentSpec;
                if (spec == null)
                    return;

                var placementParent = CreatePlacementAnchor(pose, m_LastPlacementTrackableId);

                GameObject instance;
                if (spec.prefab != null)
                {
                    instance = Instantiate(spec.prefab);
                }
                else
                {
                    instance = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    var renderer = instance.GetComponent<Renderer>();
                    if (renderer != null)
                        renderer.material.color = spec.accentColor;
                }

                if (placementParent != null)
                {
                    instance.transform.SetParent(placementParent, false);
                    instance.transform.localPosition = spec.localPositionOffset;
                    instance.transform.localRotation = Quaternion.Euler(spec.localEulerOffset);
                    instance.transform.localScale = spec.localScale;
                }
                else
                {
                    instance.transform.SetPositionAndRotation(
                        pose.position + pose.rotation * spec.localPositionOffset,
                        pose.rotation * Quaternion.Euler(spec.localEulerOffset));
                    instance.transform.localScale = spec.localScale;
                }

                m_PlacedInstance = instance;
                RefreshOverlay();
            }

            Transform CreatePlacementAnchor(Pose pose, TrackableId trackableId)
            {
                if (m_AnchorManager == null || m_PlaneManager == null || trackableId == TrackableId.invalidId)
                    return null;

                var plane = m_PlaneManager.GetPlane(trackableId);
                if (plane == null)
                    return null;

                m_CurrentAnchor = m_AnchorManager.AttachAnchor(plane, pose);
                if (m_CurrentAnchor == null)
                    return null;

                return m_CurrentAnchor.transform;
            }

            void RebuildPlacementIfNeeded()
            {
                if (!m_HasPlacementPose || !m_ReplaceCurrentPlacement)
                    return;

                PlaceCurrentSpec(m_LastPlacementPose);
            }

            void BuildRuntimeOverlay()
            {
                var canvasObject = new GameObject("AR Specs Overlay");
                var uiLayer = LayerMask.NameToLayer("UI");
                canvasObject.layer = uiLayer >= 0 ? uiLayer : 0;

                m_RuntimeCanvas = canvasObject.AddComponent<Canvas>();
                m_RuntimeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
                m_RuntimeCanvas.sortingOrder = 200;
                canvasObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                canvasObject.AddComponent<GraphicRaycaster>();

                var panelObject = new GameObject("Specs Panel");
                panelObject.transform.SetParent(canvasObject.transform, false);
                m_PanelBackground = panelObject.AddComponent<Image>();
                m_PanelBackground.color = m_PanelColor;

                var panelTransform = m_PanelBackground.rectTransform;
                panelTransform.anchorMin = new Vector2(0f, 0f);
                panelTransform.anchorMax = new Vector2(0f, 0f);
                panelTransform.pivot = new Vector2(0f, 0f);
                panelTransform.anchoredPosition = m_PanelOffset;
                panelTransform.sizeDelta = m_PanelSize;

                var accentObject = new GameObject("Accent Bar");
                accentObject.transform.SetParent(panelObject.transform, false);
                m_AccentBar = accentObject.AddComponent<Image>();
                m_AccentBar.color = new Color(0.16f, 0.72f, 0.95f, 1f);
                var accentTransform = m_AccentBar.rectTransform;
                accentTransform.anchorMin = new Vector2(0f, 0f);
                accentTransform.anchorMax = new Vector2(0f, 1f);
                accentTransform.pivot = new Vector2(0f, 0.5f);
                accentTransform.sizeDelta = new Vector2(8f, 0f);
                accentTransform.anchoredPosition = new Vector2(8f, 0f);

                var iconObject = new GameObject("Icon");
                iconObject.transform.SetParent(panelObject.transform, false);
                m_IconImage = iconObject.AddComponent<Image>();
                m_IconImage.color = new Color(1f, 1f, 1f, 0.15f);
                var iconTransform = m_IconImage.rectTransform;
                iconTransform.anchorMin = new Vector2(1f, 1f);
                iconTransform.anchorMax = new Vector2(1f, 1f);
                iconTransform.pivot = new Vector2(1f, 1f);
                iconTransform.sizeDelta = new Vector2(72f, 72f);
                iconTransform.anchoredPosition = new Vector2(-16f, -16f);

                m_CategoryText = CreateText(panelObject.transform, "Category", 14, TextAnchor.UpperLeft, new Vector2(24f, -18f), new Vector2(340f, 24f), m_PanelTextColor);
                m_TitleText = CreateText(panelObject.transform, "Title", m_FontSizeTitle, TextAnchor.UpperLeft, new Vector2(24f, -42f), new Vector2(420f, 32f), Color.white);
                m_SummaryText = CreateText(panelObject.transform, "Summary", m_FontSizeBody, TextAnchor.UpperLeft, new Vector2(24f, -76f), new Vector2(440f, 66f), m_PanelTextColor);
                m_DetailsText = CreateText(panelObject.transform, "Details", m_FontSizeBody, TextAnchor.UpperLeft, new Vector2(24f, -146f), new Vector2(468f, 90f), m_PanelTextColor);
                m_MetricsText = CreateText(panelObject.transform, "Metrics", m_FontSizeSmall, TextAnchor.UpperLeft, new Vector2(24f, -240f), new Vector2(468f, 52f), new Color(0.82f, 0.89f, 1f, 1f));
                m_PageText = CreateText(panelObject.transform, "Page", m_FontSizeSmall, TextAnchor.UpperRight, new Vector2(-24f, -22f), new Vector2(120f, 24f), new Color(0.72f, 0.76f, 0.82f, 1f));
                m_HintText = CreateText(panelObject.transform, "Hint", 13, TextAnchor.LowerLeft, new Vector2(24f, 22f), new Vector2(300f, 24f), new Color(0.72f, 0.76f, 0.82f, 1f));

                m_PreviousButton = CreateButton(panelObject.transform, "Prev", new Vector2(208f, 26f), new Vector2(0f, 0f), SelectPreviousSpec);
                m_NextButton = CreateButton(panelObject.transform, "Next", new Vector2(208f, 26f), new Vector2(214f, 0f), SelectNextSpec);
                m_PlaceButton = CreateButton(panelObject.transform, "Place", new Vector2(126f, 34f), new Vector2(24f, 18f), PlaceSelectedSpec);
                m_ClearButton = CreateButton(panelObject.transform, "Clear", new Vector2(126f, 34f), new Vector2(156f, 18f), ClearPlacedSpec);
            }

            Text CreateText(Transform parent, string name, int fontSize, TextAnchor alignment, Vector2 anchoredPosition, Vector2 sizeDelta, Color color)
            {
                var textObject = new GameObject(name);
                textObject.transform.SetParent(parent, false);

                var text = textObject.AddComponent<Text>();
                text.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
                text.fontSize = fontSize;
                text.alignment = alignment;
                text.color = color;
                text.supportRichText = true;
                text.horizontalOverflow = HorizontalWrapMode.Wrap;
                text.verticalOverflow = VerticalWrapMode.Overflow;

                var rectTransform = text.rectTransform;
                rectTransform.anchorMin = new Vector2(0f, 1f);
                rectTransform.anchorMax = new Vector2(0f, 1f);
                rectTransform.pivot = new Vector2(0f, 1f);
                rectTransform.anchoredPosition = anchoredPosition;
                rectTransform.sizeDelta = sizeDelta;
                return text;
            }

            Button CreateButton(Transform parent, string label, Vector2 sizeDelta, Vector2 anchoredPosition, UnityEngine.Events.UnityAction onClick)
            {
                var buttonObject = new GameObject(label + " Button");
                buttonObject.transform.SetParent(parent, false);

                var image = buttonObject.AddComponent<Image>();
                image.color = m_ButtonColor;

                var button = buttonObject.AddComponent<Button>();
                button.onClick.AddListener(onClick);

                var rectTransform = button.GetComponent<RectTransform>();
                rectTransform.anchorMin = new Vector2(0f, 0f);
                rectTransform.anchorMax = new Vector2(0f, 0f);
                rectTransform.pivot = new Vector2(0f, 0f);
                rectTransform.sizeDelta = sizeDelta;
                rectTransform.anchoredPosition = anchoredPosition;

                var textObject = new GameObject("Label");
                textObject.transform.SetParent(buttonObject.transform, false);

                var text = textObject.AddComponent<Text>();
                text.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
                text.text = label;
                text.fontSize = m_FontSizeSmall;
                text.alignment = TextAnchor.MiddleCenter;
                text.color = Color.white;

                var textRect = text.rectTransform;
                textRect.anchorMin = Vector2.zero;
                textRect.anchorMax = Vector2.one;
                textRect.offsetMin = Vector2.zero;
                textRect.offsetMax = Vector2.zero;

                return button;
            }

            void RefreshOverlay()
            {
                var spec = currentSpec;
                if (spec == null)
                {
                    if (m_CategoryText != null) m_CategoryText.text = "No spec entries";
                    if (m_TitleText != null) m_TitleText.text = "Add an entry to begin";
                    if (m_SummaryText != null) m_SummaryText.text = "Assign one or more spec entries in the inspector.";
                    if (m_DetailsText != null) m_DetailsText.text = string.Empty;
                    if (m_MetricsText != null) m_MetricsText.text = string.Empty;
                    if (m_PageText != null) m_PageText.text = "0 / 0";
                    if (m_HintText != null) m_HintText.text = "Add a spec catalog or entries, then press Place.";
                    if (m_PlaceButton != null) m_PlaceButton.interactable = false;
                    if (m_PreviousButton != null) m_PreviousButton.interactable = false;
                    if (m_NextButton != null) m_NextButton.interactable = false;
                    if (m_ClearButton != null) m_ClearButton.interactable = false;
                    return;
                }

                if (m_CategoryText != null)
                    m_CategoryText.text = spec.category.ToUpperInvariant();

                if (m_TitleText != null)
                    m_TitleText.text = spec.displayName;

                if (m_SummaryText != null)
                    m_SummaryText.text = spec.summary;

                if (m_DetailsText != null)
                    m_DetailsText.text = spec.description;

                if (m_AccentBar != null)
                    m_AccentBar.color = spec.accentColor;

                if (m_IconImage != null)
                {
                    m_IconImage.sprite = spec.icon;
                    m_IconImage.color = spec.icon != null ? Color.white : new Color(1f, 1f, 1f, 0.15f);
                }

                if (m_MetricsText != null)
                {
                    m_StringBuilder.Length = 0;
                    for (var index = 0; index < spec.metrics.Count; index++)
                    {
                        var metric = spec.metrics[index];
                        if (string.IsNullOrWhiteSpace(metric.label) && string.IsNullOrWhiteSpace(metric.value))
                            continue;

                        if (m_StringBuilder.Length > 0)
                            m_StringBuilder.AppendLine();

                        if (!string.IsNullOrWhiteSpace(metric.label))
                        {
                            m_StringBuilder.Append(metric.label);
                            if (!string.IsNullOrWhiteSpace(metric.value))
                                m_StringBuilder.Append(": ");
                        }

                        m_StringBuilder.Append(metric.value);
                    }

                    m_MetricsText.text = m_StringBuilder.Length > 0 ? m_StringBuilder.ToString() : string.Empty;
                }

                if (m_PageText != null)
                    m_PageText.text = (m_SelectedSpecIndex + 1).ToString() + " / " + m_SpecEntries.Count.ToString();

                if (m_HintText != null)
                    m_HintText.text = m_HasPlacementPose
                        ? "Drag to rotate and pinch to scale. Press Place to move the selected item to the last detected surface."
                        : "Tap a detected surface to place. Drag to rotate and pinch to scale after placement.";

                if (m_PlaceButton != null)
                    m_PlaceButton.interactable = true;

                if (m_PreviousButton != null)
                    m_PreviousButton.interactable = m_SpecEntries.Count > 1;

                if (m_NextButton != null)
                    m_NextButton.interactable = m_SpecEntries.Count > 1;

                if (m_ClearButton != null)
                    m_ClearButton.interactable = m_HasPlacementPose;
            }

            bool IsPointerOverUi(Vector2 pointerPosition, int pointerId)
            {
                if (EventSystem.current == null)
                    return false;

                if (pointerId >= 0)
                    return EventSystem.current.IsPointerOverGameObject(pointerId);

                return EventSystem.current.IsPointerOverGameObject();
            }
        }
    }
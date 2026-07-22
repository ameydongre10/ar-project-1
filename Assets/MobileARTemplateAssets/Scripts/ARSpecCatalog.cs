using System.Collections.Generic;
using UnityEngine;

namespace UnityEngine.XR.Templates.AR
{
    /// <summary>
    /// Reusable catalog of AR spec entries for mobile AR scenes.
    /// </summary>
    [CreateAssetMenu(fileName = "ARSpecCatalog", menuName = "AR/Spec Catalog")]
    public class ARSpecCatalog : ScriptableObject
    {
        [SerializeField]
        List<ARSpecSystem.SpecEntry> m_SpecEntries = new List<ARSpecSystem.SpecEntry>();

        /// <summary>
        /// Entries available in this catalog.
        /// </summary>
        public List<ARSpecSystem.SpecEntry> specEntries => m_SpecEntries;
    }
}
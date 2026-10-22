# Asset manifest

The repository is a Unity project. Existing Unity template and XR Interaction Toolkit sample assets are retained; this repair did not replace, convert, or optimize any 3D assets.

| Asset group | Purpose | Provenance/license | Runtime / changes |
|---|---|---|---|
| `Assets/MobileARTemplateAssets/` | Unity mobile AR template materials, UI and tutorial media | Existing repository content; individual package/vendor notices should be reviewed before redistribution | Unity only; unchanged by this repair |
| `Assets/Samples/XR Interaction Toolkit/3.3.0/` | Unity XR Interaction Toolkit sample models, materials, sprites and audio | Unity Package Manager sample content; retain associated package licensing/notices | Unity only; unchanged by this repair |
| Runtime primitives | Cube/sphere/cylinder/capsule/plane generated at runtime by `ARVisualizationSystem` | Unity built-in primitives | Unity only; no external mesh files |

No WebXR GLB/FBX runtime copy is present or claimed. No new external assets were sourced. The prior LFS pointer inconsistency means binary asset checkout should be checked before trusting local asset sizes/content.

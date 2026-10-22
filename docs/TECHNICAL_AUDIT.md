# Technical audit

## Discovery and baseline

- Repository: `ameydongre10/ar-project-1`; baseline commit `a19ed1a` on `main`; origin URL verified.
- Technology: Unity 6 mobile application using AR Foundation, ARCore/ARKit intended. Not WebXR.
- Project version: Unity 6000.4.3f1. Main repository scene: `Assets/Scenes/ar project.unity`.
- Dependencies are listed in `Packages/manifest.json`. No dedicated test assembly definition was present; test source is in the main Assets tree.
- The baseline `.github/workflows/dotnet.yml` ran dotnet restore/build/test against Unity-generated `.csproj` files that were absent. Baseline `dotnet restore` and `dotnet build --no-restore` fail with MSB3202 for five missing generated projects.
- Unity Editor, mobile device, and ARCore/ARKit hardware are unavailable in this environment. No physical tracking/performance claim is made.

## Confirmed problems and repairs

| Severity | Evidence / root cause | Repair | Acceptance |
|---|---|---|---|
| High | `ARBootstrap` was spawned by a `BeforeSceneLoad` callback, but created `ARManager` only in `Start`, after scene `Awake` callbacks could already require it. It could also create duplicate manager/camera setup objects. | `Assets/Scripts/Core/ARBootstrap.cs`: initialize during bootstrap `Awake`, reuse existing manager/camera setup, and create bootstrap (not just manager) before scene loading. Debug create actions now handle missing camera/manager and require valid placement. | Play-mode bootstrap test and scene lifecycle validation in Unity are still required. |
| High | `ARCameraSetup.IsARSupported` treated ray tracing or mobile platform as evidence of AR support. | `Assets/Scripts/AR/ARCameraSetup.cs`: report support only after ARSession reaches `Ready` or `SessionTracking`; avoids false startup success. | Validate state transitions with configured provider and unsupported hardware in Unity. |
| High | Screen placement fell back to an arbitrary point 2m in front of camera, returning success without a tracked surface. Plane interaction dereferenced absent camera/collider/renderer components. | `ARCameraSetup.cs`: no arbitrary placement success; plane interaction guards absent components. Added hit/no-hit regression tests. | Unity Test Runner and real ARCore/ARKit placement validation remain outstanding. |
| High | The Unity 6 / AR Foundation 6.4.3 package set does not provide `ARLightEstimationManager`; light estimation is requested through `ARCameraManager`. The tests also referenced Performance Test package attributes/APIs unavailable to the current assembly. | `ARCameraSetup.cs` now configures requested ambient intensity/color through `ARCameraManager`; removed the un-runnable performance benchmark class rather than introducing another assembly/package dependency. | Reopen in Unity 6000.4.3f1 and confirm there are no compile errors; device provider support for requested estimates still needs testing. |
| Medium | README gave nonexistent `Main.unity` and Unity 2021.3+, inconsistent with project scene/version. | `README.md` corrected to actual scene and editor version; feature claims qualified. | Documentation checked against repository metadata. |
| Medium | .NET workflow could not build Unity project in fresh checkout because generated csproj files are not committed. | Replaced with Unity project metadata integrity workflow; avoids claiming compilation. | Metadata workflow can run on GitHub; Unity compile/test remains a manual/batch requirement. |

## Remaining risks

- Project XR provider configuration and Android/iOS camera permission/player settings need inspection in Unity and on devices.
- Existing networking/cloud claims are not backed by an included configured service; README now states that service setup is required.
- First-clone LFS download surfaced 89 pointer inconsistencies, while a no-smudge checkout found the tracked binaries in repository Git history. Validate LFS/checkout on a standard developer clone before release.
- Do not infer WebXR compatibility from this Unity implementation. A WebXR port would be a separate implementation, not part of this repair.

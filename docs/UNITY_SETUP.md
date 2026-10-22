# Unity setup and validation

## Requirements

- Unity **6000.4.3f1**, as recorded in `ProjectSettings/ProjectVersion.txt`.
- Install Android Build Support for ARCore or iOS Build Support for ARKit in Unity Hub.
- Resolve packages using `Packages/manifest.json`; select the appropriate XR provider for the target device in XR Plug-in Management. Provider/device configuration has not been verified in this environment.

## Import and run

1. Clone the repository with Git LFS installed and validate assets after checkout.
2. Open the repository root in Unity Hub using the exact editor version above.
3. Wait for package resolution and asset import. Address all Console compile/import errors before continuing.
4. Open `Assets/Scenes/ar project.unity`.
5. Use Play mode for non-device checks. AR camera tracking and plane detection require a supported mobile device and configured provider.
6. Build for the selected platform, install on a supported ARCore/ARKit device, grant camera permission, and run the real-device checklist in `docs/TEST_REPORT.md`.

## Test runner

Open Window > General > Test Runner, run EditMode tests, and record results. Unity compilation and tests have not been run by this task environment. The project has no WebXR runtime. Its existing primitive AR assets remain Unity-native; no unsupported model export or optimization is claimed.

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Float, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useAR } from '../../context/ARContext';
import { ARPrimitive, MaterialType } from '../../types/ar';
import { QuestXRModal, QuestXRButton } from './QuestXRControls';

// Custom Mesh Renderer for an individual AR Primitive
const PrimitiveMesh: React.FC<{
  primitive: ARPrimitive;
  isSelected: boolean;
  shadingMode: 'pbr' | 'wireframe' | 'xray';
  onSelect: () => void;
}> = ({ primitive, isSelected, shadingMode, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  React.useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered]);

  // Subtle floating idle motion for non-plane objects
  useFrame((state, delta) => {
    if (meshRef.current && primitive.type !== 'plane') {
      if (hovered || isSelected) {
        meshRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  // Geometry selector
  const renderGeometry = () => {
    switch (primitive.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.65, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      case 'capsule':
        return <capsuleGeometry args={[0.4, 0.8, 16, 32]} />;
      case 'plane':
        return <planeGeometry args={[2, 2]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  // Material selector with precision optical properties
  const renderMaterial = () => {
    if (shadingMode === 'wireframe') {
      return (
        <meshBasicMaterial
          color={primitive.color}
          wireframe
        />
      );
    }

    if (shadingMode === 'xray') {
      return (
        <meshPhysicalMaterial
          color={primitive.color}
          transmission={0.8}
          opacity={0.6}
          transparent
          roughness={0.1}
          ior={1.4}
        />
      );
    }

    switch (primitive.material) {
      case 'glass':
        return (
          <meshPhysicalMaterial
            color={primitive.color}
            transmission={0.85}
            roughness={0.15}
            ior={1.52}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.9}
          />
        );
      case 'titanium':
        return (
          <meshStandardMaterial
            color={primitive.color}
            metalness={0.88}
            roughness={0.24}
            envMapIntensity={1.2}
          />
        );
      case 'phosphor':
        return (
          <meshStandardMaterial
            color={primitive.color}
            emissive={primitive.color}
            emissiveIntensity={0.65}
            roughness={0.3}
            metalness={0.1}
          />
        );
      case 'wireframe':
        return (
          <meshStandardMaterial
            color={primitive.color}
            wireframe
            roughness={0.4}
          />
        );
      case 'matte':
      default:
        return (
          <meshStandardMaterial
            color={primitive.color}
            metalness={0.15}
            roughness={0.82}
          />
        );
    }
  };

  return (
    <group
      position={primitive.position}
      rotation={[
        (primitive.rotation[0] * Math.PI) / 180,
        (primitive.rotation[1] * Math.PI) / 180,
        (primitive.rotation[2] * Math.PI) / 180,
      ]}
      scale={primitive.scale}
    >
      <mesh
        ref={meshRef}
        userData={{ primitiveId: primitive.id }}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {renderGeometry()}
        {renderMaterial()}
      </mesh>

      {/* Optical Selection Ring & Coordinate Callout */}
      {isSelected && (
        <group>
          {/* Outer high-contrast bounding bracket */}
          <lineSegments>
            <edgesGeometry args={[meshRef.current?.geometry || new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
            <lineBasicMaterial color="#00F5D4" linewidth={2} />
          </lineSegments>

          {/* Floating object metadata pill */}
          <group position={[0, primitive.type === 'plane' ? 0.3 : 1.1, 0]}>
            <Text
              fontSize={0.16}
              color="#00F5D4"
              anchorX="center"
              anchorY="bottom"
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwdSTmDX2.woff2"
            >
              {primitive.name}
            </Text>
          </group>
        </group>
      )}
    </group>
  );
};

// 6-DoF XR Interactive Controller System with Trigger Selection & Haptics
const XRInteractiveSystem: React.FC = () => {
  const { isXRPresenting, xrRenderer, selectPrimitive, exitXR } = useAR();
  const { scene } = useThree();

  React.useEffect(() => {
    if (!xrRenderer || !isXRPresenting) return;
    const controllers: THREE.Group[] = [];
    const lines: THREE.Line[] = [];
    const raycaster = new THREE.Raycaster();
    const tempMatrix = new THREE.Matrix4();

    for (let i = 0; i < 2; i++) {
      const controller = xrRenderer.xr.getController(i);

      // Visual phosphor laser ray
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -3.0)
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00f5d4,
        transparent: true,
        opacity: 0.85
      });
      const line = new THREE.Line(geom, mat);
      controller.add(line);

      // Trigger selection handler
      const onSelect = () => {
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const hit = intersects.find((int) => {
          let curr: THREE.Object3D | null = int.object;
          while (curr) {
            if (curr.userData?.primitiveId || curr.userData?.isExitButton) return true;
            curr = curr.parent;
          }
          return false;
        });

        if (hit) {
          let curr: THREE.Object3D | null = hit.object;
          let primId: string | null = null;
          let isExit = false;

          while (curr) {
            if (curr.userData?.isExitButton) {
              isExit = true;
              break;
            }
            if (curr.userData?.primitiveId) {
              primId = curr.userData.primitiveId;
              break;
            }
            curr = curr.parent;
          }

          if (isExit) {
            exitXR();
            return;
          }

          if (primId) {
            selectPrimitive(primId);
            // Trigger 6-DoF controller haptic pulse
            try {
              const session = xrRenderer.xr.getSession();
              const inputSource = session?.inputSources?.[i];
              if (inputSource?.gamepad?.hapticActuators?.length) {
                (inputSource.gamepad.hapticActuators[0] as any).pulse(0.5, 45);
              }
            } catch (e) {
              // Haptics optional on unsupported platforms
            }
          }
        }
      };

      controller.addEventListener('select', onSelect);
      controllers.push(controller);
      lines.push(line);
    }

    return () => {
      controllers.forEach((c, idx) => {
        c.remove(lines[idx]);
      });
    };
  }, [xrRenderer, isXRPresenting, scene, selectPrimitive, exitXR]);

  return null;
};

// Calibrated 3D Virtual Reality Studio Room (enclosed dome, cyber floor & plinth)
const VRStudioRoom: React.FC = () => {
  const { xrSessionMode, isXRPresenting, selectedPrimitive, exitXR } = useAR();
  if (!isXRPresenting || xrSessionMode !== 'vr') return null;

  return (
    <group>
      {/* Surrounding Virtual Cleanroom Sky Dome */}
      <mesh>
        <sphereGeometry args={[35, 24, 16]} />
        <meshBasicMaterial color="#05070A" side={THREE.BackSide} />
      </mesh>

      {/* Cyber Technical Grid Floor */}
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={0.4}
        cellThickness={0.8}
        cellColor="#00F5D4"
        sectionSize={2.0}
        sectionThickness={1.5}
        sectionColor="#1C2333"
        fadeDistance={24}
        fadeStrength={1.4}
      />

      {/* Ergonomic Spatial Inspection Pedestal */}
      <group position={[0, 0.45, -1.2]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[1.5, 1.7, 0.9, 32]} />
          <meshStandardMaterial
            color="#0E1117"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        {/* Phosphor Rim Ring */}
        <mesh position={[0, 0.455, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.5, 32]} />
          <meshBasicMaterial color="#00F5D4" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Floating VR Spatial HUD */}
      <group position={[0, 1.7, -1.2]}>
        <Text
          fontSize={0.08}
          color="#00F5D4"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwdSTmDX2.woff2"
        >
          {selectedPrimitive ? `ACTIVE // ${selectedPrimitive.name.toUpperCase()}` : 'VR STUDIO // AIM LASER & TRIGGER TO SELECT'}
        </Text>

        {/* 1-Tap Interactive Exit VR Button */}
        <group
          position={[0, -0.15, 0]}
          userData={{ isExitButton: true }}
          onClick={(e) => {
            e.stopPropagation();
            exitXR();
          }}
        >
          <mesh>
            <planeGeometry args={[0.38, 0.09]} />
            <meshStandardMaterial color="#E11D48" roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.04}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            EXIT VR
          </Text>
        </group>
      </group>
    </group>
  );
};

export const Studio3D: React.FC = () => {
  const {
    primitives,
    selectedId,
    selectPrimitive,
    shadingMode,
    gridVisible,
    setXRRenderer,
    isXRPresenting,
    xrSessionMode
  } = useAR();

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [3.8, 3.2, 4.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows
        onCreated={({ gl }) => {
          gl.xr.enabled = true;
          setXRRenderer(gl);
        }}
        onPointerMissed={() => selectPrimitive(null)}
      >
        {/* 6-DoF XR Interactive Controller System */}
        <XRInteractiveSystem />

        {/* Calibrated 3D VR Environment */}
        <VRStudioRoom />

        {/* Calibrated Optical Studio Lighting */}
        <ambientLight intensity={isXRPresenting ? 0.85 : 0.4} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-4, 2, -3]} intensity={0.5} color="#00F5D4" />
        <pointLight position={[3, -1, 3]} intensity={0.3} color="#FB5607" />

        {/* Studio Ground Grid (Subtle during desktop & hidden in AR) */}
        {gridVisible && !isXRPresenting && (
          <Grid
            renderOrder={-1}
            position={[0, -0.01, 0]}
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#1C2333"
            sectionSize={2}
            sectionThickness={1.2}
            sectionColor="#2A344D"
            fadeDistance={25}
            fadeStrength={1.5}
          />
        )}

        {/* Ambient Contact Shadows */}
        {!isXRPresenting && (
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.65}
            scale={14}
            blur={1.8}
            far={6}
            resolution={512}
            color="#030406"
          />
        )}

        {/* Interactive Primitive Renders - Positioned at ergonomic desk/workbench height in XR */}
        <group position={isXRPresenting ? [0, 1.0, -1.2] : [0, 0, 0]}>
          {primitives.map((primitive) => (
            <PrimitiveMesh
              key={primitive.id}
              primitive={primitive}
              isSelected={primitive.id === selectedId}
              shadingMode={shadingMode}
              onSelect={() => selectPrimitive(primitive.id)}
            />
          ))}
        </group>

        <OrbitControls
          makeDefault
          enabled={!isXRPresenting}
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going underneath ground plane
        />
      </Canvas>

      {/* Meta Quest & VR WebXR Modal */}
      <QuestXRModal />
    </div>
  );
};

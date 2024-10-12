import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type ActionName = "Take 01";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    TERRE1_0: THREE.Mesh;
    Sphere002_0: THREE.Mesh;
    Circle643_0: THREE.Mesh;
    Circle455_0: THREE.Mesh;
    Icosphere002_0: THREE.Mesh;
    Circle_0: THREE.Mesh;
  };
  materials: {
    ["Material.005"]: THREE.MeshStandardMaterial;
    ["Material.006"]: THREE.MeshStandardMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
    ["Material.007"]: THREE.MeshStandardMaterial;
    ["Material.008"]: THREE.MeshStandardMaterial;
    ["Material.010"]: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export default function Earth(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF("/earth.gltf") as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // Optional: Start an animation if needed
  useEffect(() => {
    if (actions && actions["Take 01"]) {
      actions["Take 01"].play();
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.306}
        >
          <group name="Root">
            <group name="TERRE1" scale={3.27}>
              <mesh
                name="TERRE1_0"
                geometry={nodes.TERRE1_0.geometry}
                material={materials["Material.005"]}
              />
            </group>
            <group name="Sphere002" rotation={[0, 0, -3.015]} scale={0.965}>
              <mesh
                name="Sphere002_0"
                geometry={nodes.Sphere002_0.geometry}
                material={materials["Material.006"]}
              />
            </group>
            <group name="Circle643" scale={4.787}>
              <mesh
                name="Circle643_0"
                geometry={nodes.Circle643_0.geometry}
                material={materials["Material.004"]}
              />
            </group>
            <group name="Circle455" scale={0.176}>
              <mesh
                name="Circle455_0"
                geometry={nodes.Circle455_0.geometry}
                material={materials["Material.007"]}
                morphTargetDictionary={nodes.Circle455_0.morphTargetDictionary}
                morphTargetInfluences={nodes.Circle455_0.morphTargetInfluences}
              />
            </group>
            <group name="Circle" scale={6.128}>
              <group name="Icosphere002" position={[1, 0, 0]} scale={0.063}>
                <mesh
                  name="Icosphere002_0"
                  geometry={nodes.Icosphere002_0.geometry}
                  material={materials["Material.008"]}
                />
              </group>
              <mesh
                name="Circle_0"
                geometry={nodes.Circle_0.geometry}
                material={materials["Material.010"]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/earth.gltf");

import Head from 'next/head';
// import styles from '../styles/Home.module.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
const bananaImage = '/banana.glb';
import { useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import AddHtml from './../components/AddHtml';
function Banana({ z }) {
  const [clicked, setClicked] = useState(false);
  const { nodes, materials } = useGLTF('/banana-transformed.glb');

  const ref = useRef();
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);
  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });
  useFrame((state) => {
    ref.current.position.set(data.x * width, (data.y += 0.1), z);
    ref.current.rotation.set((data.rX += 0.005), (data.rY += 0.005), (data.rZ += 0.005));
    if (data.y > height) {
      data.y = -height;
    }
    // ref.current.rotation.z = THREE.MathUtils.lerp(
    //   ref.current.position.z,
    //   clicked ? 1 : 0,
    //   0.1
    // );
  });

  return (
    // <mesh ref={ref} onClick={() => setClicked(!clicked)}>
    //   <boxGeometry />
    //   <meshBasicMaterial color='red' />
    // </mesh>
    <mesh
      ref={ref}
      geometry={nodes.Object_2.geometry}
      material={materials.Banana_High}
      position={[0.35, 1.45, 0.01]}
      rotation={[-1.51, 0, 0]}
      material-emissive='orange'
    />
  );
}

// function Banana(props) {
//   const { scene } = useGLTF(bananaImage);
// //scene.traverse
//   return <primitive object={scene} {...props} />; // tranport existing object into the scene
// }

// function Banana({ ...props }) {
//   const group = useRef();
//   const { nodes, materials } = useGLTF('/banana-transformed.glb');
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <mesh
//         geometry={nodes.Object_2.geometry}
//         material={materials.Banana_High}
//         position={[0.35, 1.45, 0.01]}
//         rotation={[-1.51, 0, 0]}
//         material-emissive='orange'
//       />
//     </group>
//   );
// }

export default function Home({ count = 100, depth = 80 }) {
  return (
    <>
      <Canvas
        style={{ height: '100vh', maxWidth: '100%' }}
        gl={{ alpha: false }}
        camera={{ near: 0.01, far: 110 }}
      >
        <color attach={'background'} args={['#ffd863']} />
        {/* <ambientLight intensity={0.2} /> */}
        <spotLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset='sunset' />
          {Array.from({ length: count }, (item, i) => (
            <Banana key={i} z={-(i / count) * depth} />
          ))}
          {/*  <Banana scale={0.5} /> */}
          <EffectComposer>
            <DepthOfField
              target={[0, 0, depth / 2]}
              focalLength={0.6}
              bokehScale={11}
              height={700}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <AddHtml />
    </>
  );
}

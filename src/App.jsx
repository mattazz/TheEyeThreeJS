import { Canvas, useFrame, useLoader , extend} from '@react-three/fiber'
import './App.css'
import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useMotionValue, useSpring } from 'framer-motion'
import {motion} from 'framer-motion-3d'
import { option } from 'framer-motion/client'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import {PlaneGeometry} from 'three'

import GrainShader from './grainShader'




function App() {

  return (
    <div className='main'>
    <Canvas>
      <OrbitControls enableZoom={false} enableDamping={true} enablePan={false} enableRotate={false} />
      <ambientLight intensity={2} />
      <directionalLight position={[2,1,1]} intensity={2} />
      <Eye  position={[0,0,-2]} />
      <GrainBackground />
    </Canvas>
    <h1 className='title'>The Eye</h1>
    </div>
  )
} 

function GrainBackground() {
  const materialRef = useRef();

  useFrame(({ clock, size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      materialRef.current.uniforms.u_resolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh position={[0,0,-10]}>
      <planeGeometry args={[100,100]} />
      <shaderMaterial ref={materialRef} attach="material" {...GrainShader} />
    </mesh>
  );
}


function Eye({ position }) {
  const eyeball_location = `${import.meta.env.VITE_BASE_URL}assets/eyeball/eyeball.obj`;
  const mtlPath = `${import.meta.env.VITE_BASE_URL}assets/eyeball/eyeball.mtl`;

  const materials = useLoader(MTLLoader, mtlPath);
  const eyeball = useLoader(OBJLoader, eyeball_location, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  // Gets reference to mesh 
  const mesh = useRef(null);

  const options = {
    damping : 20
  }

  // creates motionValue for mouse.x and mouse.y
  const mouse ={
    x: useSpring(useMotionValue(0), options),
    y: useSpring(useMotionValue(0), options)
  }
  //triggers for every mouse move
  const manageMouseMove = (e) =>{
    const {innerWidth, innerHeight} = window;
    // Client mouse position
    const {clientX, clientY} = e;

    // value between 0 - 1 depending on where the mouse is
    const x = -0.5 + (clientX / innerWidth); 
    const y = -0.5 + (clientY / innerHeight);

    mouse.x.set(x);
    mouse.y.set(y);
  }

  // triggers for every touch move
const manageTouchMove = (e) => {
  const { innerWidth, innerHeight } = window;
  // Client touch position
  const { clientX, clientY } = e.touches[0];

  // value between 0 - 1 depending on where the touch is
  const x = -0.5 + (clientX / innerWidth);
  const y = -0.5 + (clientY / innerHeight);

  mouse.x.set(x);
  mouse.y.set(y);
};


useEffect(() => {
  window.addEventListener('mousemove', manageMouseMove);
  window.addEventListener('touchmove', manageTouchMove);

  return () => {
    window.removeEventListener('mousemove', manageMouseMove);
    window.removeEventListener('touchmove', manageTouchMove);
  };
}, []);
  const rotationSpeed = 0.5

  useFrame((state,delta) =>{
    // mesh.current.rotation.x += delta * rotationSpeed;
    const time = state.clock.getElapsedTime()
    mesh.current.position.y = position[1] + Math.sin(time) * 0.5  ;
    // console.log(mesh.current.position.y);
    
  })
  return (
    <motion.mesh ref={mesh} rotation-y={mouse.x} rotation-x={mouse.y} position={position}>
      {/* <boxGeometry args={[2.5,2.5,2.5]} />
      <meshStandardMaterial  color="orange"/> */}
      <primitive object={eyeball} />
    </motion.mesh>
  )
}

export default App

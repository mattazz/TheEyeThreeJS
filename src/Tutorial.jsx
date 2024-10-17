import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useSpring, useMotionValue } from 'framer-motion';

function Eye() {
    const meshRef = useRef();

    const eyeball_location = `assets/eyeball/eyeball.obj`;
    const mtlPath = `assets/eyeball/eyeball.mtl`;

    const materials = useLoader(MTLLoader, mtlPath);
    const eyeball = useLoader(OBJLoader, eyeball_location, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const options = {
        damping: 20
    };

    const mouse = {
        x: useSpring(useMotionValue(0), options),
        y: useSpring(useMotionValue(0), options)
    };

    const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const { clientX, clientY } = e;

        const x = -0.5 +(clientX / innerWidth);
        const y = -0.5 + (clientY / innerHeight);

        mouse.x.set(x);
        mouse.y.set(y);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = mouse.y.get();
            meshRef.current.rotation.y = mouse.x.get() ;

            console.log(meshRef.current.rotation.x);
            console.log(meshRef.current.rotation.y);
            
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -3]}>
            <primitive object={eyeball} />
        </mesh>
    );
}

function Tutorial() {
    return (
        <div className="main">
            <Canvas>
                <ambientLight intensity={2} />
                <directionalLight position={[2, 2, 2]} intensity={4} />
                <OrbitControls />
                <Eye />
            </Canvas>
        </div>
    );
}

export default Tutorial;
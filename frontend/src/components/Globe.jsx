import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

function RotatingGlobe() {
  const globeRef = useRef()
  const mousePosition = useRef({ x: 0, y: 0 })
  const lastMouseMove = useRef(Date.now())
  const defaultRotationSpeed = 0.001
  const lerpSpeed = 0.1

  // Load Earth textures
  const [colorMap, bumpMap, cloudsMap, waterMap, starsMap] = useLoader(THREE.TextureLoader, [
    'src/assets/earth/2_no_clouds_4k.jpg',
    'src/assets/earth/elev_bump_4k.jpg',
    'src/assets/earth/fair_clouds_4k.png',
    'src/assets/earth/water_4k.png',
    'src/assets/earth/galaxy_starfield.png',
  ])

  useFrame(({ mouse }) => {
    if (!globeRef.current) return

    // Update mouse position from Three.js mouse coordinates
    mousePosition.current = { x: mouse.x, y: mouse.y }
    const timeSinceLastMove = Date.now() - lastMouseMove.current
    const isMouseStatic = timeSinceLastMove > 100

    if (isMouseStatic) {
      // Default rotation when mouse is static
      globeRef.current.rotation.y += defaultRotationSpeed
      
      // Reset position smoothly to center
      globeRef.current.position.x = THREE.MathUtils.lerp(
        globeRef.current.position.x,
        0,
        lerpSpeed
      )
      globeRef.current.position.y = THREE.MathUtils.lerp(
        globeRef.current.position.y,
        0,
        lerpSpeed
      )
    } else {
      // Follow mouse position with enhanced sensitivity
      globeRef.current.position.x = THREE.MathUtils.lerp(
        globeRef.current.position.x,
        mousePosition.current.x * 0.5,
        lerpSpeed
      )
      globeRef.current.position.y = THREE.MathUtils.lerp(
        globeRef.current.position.y,
        mousePosition.current.y * 0.5,
        lerpSpeed
      )
      lastMouseMove.current = Date.now()
    }
  })

  return (
    <>
      {/* Background stars sphere */}
      <Sphere args={[100, 64, 64]}>
        <meshBasicMaterial map={starsMap} side={THREE.BackSide} />
      </Sphere>

      {/* Earth sphere */}
      <group ref={globeRef}>
        <Sphere args={[1.4, 64, 64]}>
          <meshPhongMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={1}
            specularMap={waterMap}
            specular={new THREE.Color(0x666666)}
            shininess={5}
          />
        </Sphere>

        {/* Cloud layer */}
        <Sphere args={[1.5, 64, 64]}>
          <meshPhongMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.9}
            depthWrite={false}
          />
        </Sphere>

        {/* Wire sphere */}
        <Sphere args={[1.6, 32, 32]}>
          <meshBasicMaterial
            color="#ffffff"
            wireframe={true}
            transparent={true}
            opacity={0.1}
          />
        </Sphere>
      </group>
    </>
  )
}

function Globe() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: '#000'
      }}
    >
      <Canvas camera={{ position: [0, 0, 2.6] }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <hemisphereLight 
          groundColor={new THREE.Color(0x000000)}
          intensity={1}
        />
        <RotatingGlobe />
      </Canvas>
    </div>
  )
}

export default Globe;
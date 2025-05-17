"use client"
import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import * as THREE from "three"

// Human character that evolves with level
function HumanCharacter({ character, level }) {
  // Base character properties
  const baseScale = 1.5
  const baseColor = new THREE.Color("#9333ea") // Purple base

  // Level-based modifications
  const scale = baseScale + level * 0.1 // Character grows with level
  const accessories = []

  // Character type specific colors
  let characterColor
  switch (character) {
    case "bgmi":
      characterColor = new THREE.Color("#3b82f6") // Blue
      break
    case "cyberpunk":
      characterColor = new THREE.Color("#9333ea") // Purple
      break
    case "doodle":
      characterColor = new THREE.Color("#f59e0b") // Amber
      break
    case "solo-leveling":
      characterColor = new THREE.Color("#ef4444") // Red
      break
    default:
      characterColor = baseColor
  }

  // Add accessories based on level
  if (level >= 3) {
    // Add a sword at level 3+
    accessories.push(
      <mesh key="sword" position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.8, 0.05]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>,
    )
  }

  if (level >= 5) {
    // Add a shield at level 5+
    accessories.push(
      <mesh key="shield" position={[-0.5, 0, 0.2]} rotation={[0, Math.PI / 6, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.6]} />
        <meshStandardMaterial color="#964B00" metalness={0.5} roughness={0.5} />
        <mesh position={[0, 0, 0.01]} scale={[0.8, 0.8, 1]}>
          <circleGeometry args={[0.25, 32]} />
          <meshStandardMaterial color={characterColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </mesh>,
    )
  }

  if (level >= 7) {
    // Add a crown/helmet at level 7+
    accessories.push(
      <mesh key="crown" position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.2, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>,
    )
  }

  if (level >= 10) {
    // Add a cape at level 10+
    accessories.push(
      <mesh key="cape" position={[0, 0.3, -0.3]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color={characterColor} transparent={true} opacity={0.8} side={THREE.DoubleSide} />
      </mesh>,
    )
  }

  // Animation state
  const [animState, setAnimState] = useState({
    idle: true,
    wave: false,
    jump: false,
    spin: false,
  })

  // Random animations with smoother transitions
  useEffect(() => {
    const animInterval = setInterval(() => {
      const rand = Math.random()
      if (rand < 0.25) {
        setAnimState({ idle: false, wave: true, jump: false, spin: false })
        setTimeout(() => setAnimState({ idle: true, wave: false, jump: false, spin: false }), 2000)
      } else if (rand < 0.5) {
        setAnimState({ idle: false, wave: false, jump: true, spin: false })
        setTimeout(() => setAnimState({ idle: true, wave: false, jump: false, spin: false }), 1000)
      } else if (rand < 0.75) {
        setAnimState({ idle: false, wave: false, jump: false, spin: true })
        setTimeout(() => setAnimState({ idle: true, wave: false, jump: false, spin: false }), 1500)
      }
    }, 5000)

    return () => clearInterval(animInterval)
  }, [])

  return (
    <group
      scale={[scale, scale, scale]}
      rotation={[0, animState.spin ? Math.PI * 2 : 0, 0]}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={characterColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#F5DEB3" />

        {/* Eyes */}
        <mesh position={[0.08, 0.05, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0.05, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>

      {/* Arms */}
      <mesh
        position={[0.4, 0.1, 0]}
        rotation={[0, 0, animState.wave ? -Math.PI / 4 : -Math.PI / 8]}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color={characterColor} />
      </mesh>
      <mesh
        position={[-0.4, 0.1, 0]}
        rotation={[0, 0, animState.wave ? Math.PI / 4 : Math.PI / 8]}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color={characterColor} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.2, -0.6, 0]} rotation={[animState.jump ? -Math.PI / 8 : 0, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial color="#1E40AF" /> {/* Blue jeans */}
      </mesh>
      <mesh position={[-0.2, -0.6, 0]} rotation={[animState.jump ? Math.PI / 8 : 0, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
        <meshStandardMaterial color="#1E40AF" /> {/* Blue jeans */}
      </mesh>

      {/* Level indicator */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        backgroundColor="#9333ea"
        padding={0.05}
        borderRadius={0.1}
      >
        Level {level}
      </Text>

      {/* Add all accessories */}
      {accessories}
    </group>
  )
}

export default function CharacterViewer({ character = "cyberpunk", level = 1 }) {
  const [animateCharacter, setAnimateCharacter] = useState(true)

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <HumanCharacter character={character} level={level} />

        <OrbitControls
          enableZoom={false}
          autoRotate={animateCharacter}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

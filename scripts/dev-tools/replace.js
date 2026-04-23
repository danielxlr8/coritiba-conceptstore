/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const filepath = 'src/components/fit-guide/AiSizeGuideModal.tsx';
let txt = fs.readFileSync(filepath, 'utf8');

const splitRegex = /\/\/ ──+ Background plane ──.*/;
const match = txt.match(/(\/\/\s*─+\s*Background plane\s*─+[\s\S]*)/i);

if (!match) {
  // Try another anchor
  console.log("Could not find background plane anchor.");
}

const anchorKey = "function useNormalizedGLTF";
const anchorIdx = txt.indexOf(anchorKey);

const topPart = txt.substring(0, anchorIdx);

const bottomReplacement = `// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZED GLTF HOOK (Spatial & Origin Fixer)
// ─────────────────────────────────────────────────────────────────────────────
function useNormalizedGLTF(path: string) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale = 2 / Math.max(size.y, 1);

    return {
      object: clone,
      scale,
      position: [-center.x, -center.y + size.y / 2, -center.z] as [number, number, number],
    };
  }, [scene]);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPORTIONAL FIT LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const FIT_CONFIG: Record<Size, { scale: [number, number, number]; position: [number, number, number] }> = {
  P: { scale: [0.95, 0.98, 0.95], position: [0, 0, 0] },
  M: { scale: [1, 1, 1], position: [0, 0, 0.01] },
  G: { scale: [1.08, 1.02, 1.08], position: [0, -0.02, 0.02] },
  GG: { scale: [1.15, 1.05, 1.15], position: [0, -0.05, 0.03] }
};

if (typeof window !== 'undefined') {
  useGLTF.preload('/moldes/human.glb');
  useGLTF.preload('/moldes/tshirtweb.glb');
  useGLTF.preload('/moldes/tshirtmobile.glb');
}

// ─────────────────────────────────────────────────────────────────────────────
// BODY MODEL
// ─────────────────────────────────────────────────────────────────────────────
function BodyModel({ height, weight }: { height: number; weight: number }) {
  const { object, scale, position } = useNormalizedGLTF('/moldes/human.glb');

  // fallback to 175 and 75 if height/weight are somehow missing (failsafe)
  const safeHeight = height || 175;
  const safeWeight = weight || 75;

  const heightScale = safeHeight / 175;
  const weightScale = safeWeight / 75;

  return (
    <group
      scale={[scale * weightScale, scale * heightScale, scale * weightScale]}
      position={position}
      rotation={[0, Math.PI, 0]} // corrige costas
    >
      <primitive object={object} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIRT MODEL
// ─────────────────────────────────────────────────────────────────────────────
function ShirtModel({ size, height, weight }: { size: Size; height: number; weight: number }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shirtPath = isMobile ? '/moldes/tshirtmobile.glb' : '/moldes/tshirtweb.glb';
  const { object, scale, position } = useNormalizedGLTF(shirtPath);

  const fit = FIT_CONFIG[size];
  
  const safeHeight = height || 175;
  const safeWeight = weight || 75;
  const heightScale = safeHeight / 175;
  const weightScale = safeWeight / 75;

  // We multiply the base normalization scale by the proportion modifiers
  return (
    <group
      scale={[
        scale * fit.scale[0] * weightScale,
        scale * fit.scale[1] * heightScale,
        scale * fit.scale[2] * weightScale,
      ]}
      position={[
        position[0] + fit.position[0],
        position[1] + fit.position[1],
        position[2] + fit.position[2],
      ]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={object} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR COMBINATION (Sincronização Corpo + Camisa)
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ height, weight, size }: { height: number; weight: number; size: Size }) {
  return (
    <group>
      <BodyModel height={height} weight={weight} />
      <ShirtModel size={size} height={height} weight={weight} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROTAÇÃO 360 (Mouse + Idle)
// ─────────────────────────────────────────────────────────────────────────────
function RotationController({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const rotation = useRef(0);

  useFrame((state) => {
    rotation.current += 0.002; // idle rotation

    if (ref.current) {
      // Using pointer or mouse depending on r3f version (commonly state.pointer in v8+)
      const pointerX = state.pointer?.x || state.mouse?.x || 0;
      ref.current.rotation.y = rotation.current + pointerX * 0.5;
    }
  });

  return <group ref={ref}>{children}</group>;
}

// ── Suspense Fallback ────────────────────────────────────────────────────────
function Loader() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 2;
  });
  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
      <meshBasicMaterial color="#3d9958" wireframe />
    </mesh>
  );
}

// ── CAMERA CONTROLLER ─────────────────────────────────────────────────────────
function CameraController({ targetZ }: { targetZ: number }) {
  useFrame((state, delta) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3);
    state.camera.lookAt(0, 1, 0);
  });
  return null;
}

// ── Scene assembler ───────────────────────────────────────────────────────────
function Scene({ height, weight, shirtSize }: { height: number; weight: number; shirtSize: Size }) {
  return (
    <group>
      <Suspense fallback={<Loader />}>
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 3]} intensity={1} />
        
        <RotationController>
          <Avatar height={height} weight={weight} size={shirtSize} />
        </RotationController>
        
        <ContactShadows position={[0, 0, 0]} opacity={0.5} blur={2} />
      </Suspense>
    </group>
  );
}

// ── Visualizer ────────────────────────────────────────────────────────────────
function Visualizer({ height, weight, shirtSize }: { height: number; weight: number; shirtSize: Size }) {
  const [zoomTarget, setZoomTarget] = useState(6);

  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseRef.current.y = ((e.clientY - rect.top)  / rect.height - 0.5) * -2;
  };

  const handleZoom = (dir: 1 | -1) =>
    setZoomTarget(prev => Math.max(3, Math.min(10, prev + dir * 1.5)));

  return (
    <div
      className="relative w-full h-full min-h-[520px] flex items-center justify-center select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #0d1f11 0%, #050a06 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
    >
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[42%] h-[54%] bg-[#1c6b2e]/8 blur-[64px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[46%] h-[52px] bg-[#1c6b2e]/14 blur-[28px] pointer-events-none rounded-full" />

      <Canvas
        camera={{ position: [0, 1.2, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <CameraController targetZ={zoomTarget} />
        <Scene height={height} weight={weight} shirtSize={shirtSize} />
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 78% 78% at 50% 46%, transparent 32%, rgba(3,7,4,0.62) 100%)'
        }}
      />

      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => handleZoom(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/55 hover:bg-white/10 hover:text-white text-xl leading-none transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/55 hover:bg-white/10 hover:text-white text-xl leading-none transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      <div className="absolute bottom-5 left-4 text-[9px] uppercase tracking-widest text-white/18 pointer-events-none font-mono select-none">
        Virtual Try-On
      </div>
    </div>
  );
}

export default AISizeGuideModal;
`;

fs.writeFileSync(filepath, topPart + bottomReplacement);
console.log('Replacement complete.');

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface LocalGLBViewerProps {
  modelPath: string;
  modelName: string;
  onReady?: () => void;
  onError?: () => void;
}

export function LocalGLBViewer({ modelPath, modelName, onReady, onError }: LocalGLBViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let animFrameId: number;
    let isMounted = true;

    const init = async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js" as string);
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js" as string);
        if (!isMounted) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x07080b);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 10000);
        camera.position.set(0, 5, 20);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xfff3d6, 0.6));
        const sun = new THREE.DirectionalLight(0xffd700, 1.8);
        sun.position.set(10, 20, 10);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xd4af37, 0.4);
        fill.position.set(-10, 5, -10);
        scene.add(fill);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
        controls.minDistance = 1;
        controls.maxDistance = 500;

        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf: any) => {
            if (!isMounted) return;
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 10 / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            scene.add(model);
            const scaledSize = maxDim * scale;
            camera.position.set(0, scaledSize * 0.5, scaledSize * 2);
            controls.target.set(0, 0, 0);
            controls.update();
            setStatus("ready");
            onReady?.();
          },
          (progress: any) => {
            if (progress.total > 0) setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
          },
          (error: any) => {
            console.error("GLB load error:", error);
            if (!isMounted) return;
            setStatus("error");
            onError?.();
          }
        );

        const handleResize = () => {
          if (!container || !isMounted) return;
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        const animate = () => {
          animFrameId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        cleanupRef.current = () => {
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(animFrameId);
          controls.dispose();
          renderer.dispose();
          if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
      } catch (err) {
        console.error("Three.js init error:", err);
        if (!isMounted) return;
        setStatus("error");
        onError?.();
      }
    };

    init();
    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameId);
      cleanupRef.current?.();
    };
  }, [modelPath]);

  return (
    <div className="relative w-full h-full bg-[#07080b] rounded-2xl overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#07080b] z-10">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-[#E8DFD1]/80 text-sm font-semibold">Loading {modelName}...</p>
            {loadProgress > 0 && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-300" style={{ width: `${loadProgress}%` }} />
                </div>
                <p className="text-[#D4AF37] text-xs font-mono">{loadProgress}%</p>
              </div>
            )}
            <p className="text-[#E8DFD1]/40 text-xs">Offline 3D Model - Three.js</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#07080b] z-10">
          <p className="text-[#E8DFD1]/60 text-sm">Could not load local 3D model</p>
          <p className="text-[#E8DFD1]/30 text-xs">{modelPath}</p>
        </div>
      )}
      {status === "ready" && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="text-[10px] font-mono text-[#34D399] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[#34D399]/30">
            Offline 3D - Auto-rotating - Drag to orbit
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

export interface StlViewerProps {
  /** Path under /public to a .stl file. Encoded before fetch. */
  src: string;
  /** Screen-reader description of the model. */
  alt: string;
  /** Drag-to-orbit when true (default); auto-rotate-only preview when false. */
  interactive?: boolean;
  className?: string;
}

type Status = "loading" | "ready" | "failed";

/**
 * Interactive viewer for raw Fusion 360 STL exports.
 *
 * three.js is a large bundle, so it is imported only once the element scrolls
 * near the viewport (mirrors model-viewer.tsx). Changing `src` reloads the
 * geometry and disposes the previous mesh. All GPU resources are released on
 * unmount so a page full of viewers doesn't leak WebGL contexts.
 */
export function StlViewer({
  src,
  alt,
  interactive = true,
  className = "",
}: StlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  // Latest src, read inside the async setup closure without re-running it.
  // Seeded from the initial src; kept in sync by the reload effect below.
  const srcRef = useRef(src);

  // Imperative handle onto the live three.js scene, set once ready.
  const apiRef = useRef<{ load: (path: string) => void; dispose: () => void } | null>(
    null,
  );

  // Set up renderer/scene once the element nears the viewport.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();

        Promise.all([
          import("three"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          import("three/examples/jsm/loaders/STLLoader.js"),
        ])
          .then(([three, { OrbitControls }, { STLLoader }]) => {
            if (cancelled || !containerRef.current) return;
            const T = three as typeof THREE;

            const width = node.clientWidth || 1;
            const height = node.clientHeight || 1;

            const scene = new T.Scene();
            const camera = new T.PerspectiveCamera(40, width / height, 0.1, 5000);
            const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(width, height);
            if (!interactive) renderer.domElement.style.pointerEvents = "none";
            node.appendChild(renderer.domElement);

            scene.add(new T.HemisphereLight(0xffffff, 0x2a3442, 1.1));
            const key = new T.DirectionalLight(0xffffff, 1.5);
            key.position.set(1, 1, 1);
            scene.add(key);

            const prefersReducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;

            let controls: InstanceType<typeof OrbitControls> | null = null;
            if (interactive) {
              controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.enablePan = false;
              controls.autoRotate = !prefersReducedMotion;
              controls.autoRotateSpeed = 1.1;
            }
            const autoSpin = !interactive && !prefersReducedMotion;

            const material = new T.MeshStandardMaterial({
              color: 0x9fb2c8,
              metalness: 0.1,
              roughness: 0.65,
            });

            let mesh: THREE.Mesh | null = null;
            const loader = new STLLoader();

            const load = (path: string) => {
              setStatus("loading");
              loader.load(
                encodeURI(path),
                (geometry) => {
                  if (cancelled) return;
                  if (mesh) {
                    scene.remove(mesh);
                    mesh.geometry.dispose();
                  }
                  geometry.center();
                  geometry.computeBoundingSphere();
                  const radius = geometry.boundingSphere?.radius ?? 1;
                  mesh = new T.Mesh(geometry, material);
                  scene.add(mesh);
                  camera.position.set(radius * 0.8, radius * 0.6, radius * 2.4);
                  camera.near = radius / 100;
                  camera.far = radius * 100;
                  camera.updateProjectionMatrix();
                  camera.lookAt(0, 0, 0);
                  controls?.update();
                  setStatus("ready");
                },
                undefined,
                () => {
                  if (!cancelled) setStatus("failed");
                },
              );
            };

            const resize = () => {
              const w = node.clientWidth || 1;
              const h = node.clientHeight || 1;
              renderer.setSize(w, h);
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", resize);

            let raf = 0;
            const animate = () => {
              raf = requestAnimationFrame(animate);
              if (autoSpin && mesh) mesh.rotation.y += 0.006;
              controls?.update();
              renderer.render(scene, camera);
            };
            animate();

            apiRef.current = {
              load,
              dispose: () => {
                cancelAnimationFrame(raf);
                window.removeEventListener("resize", resize);
                controls?.dispose();
                material.dispose();
                if (mesh) mesh.geometry.dispose();
                renderer.dispose();
                renderer.domElement.remove();
              },
            };

            load(srcRef.current);
          })
          .catch(() => {
            if (!cancelled) setStatus("failed");
          });
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [interactive]);

  // Reload geometry when the selected version changes.
  useEffect(() => {
    srcRef.current = src;
    apiRef.current?.load(src);
  }, [src]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panel ${className}`}
    >
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-ground/85 px-2.5 py-1 font-mono text-hud uppercase text-muted backdrop-blur-sm">
        {status === "failed"
          ? "3D unavailable"
          : status === "ready"
            ? interactive
              ? "Drag to orbit"
              : "3D model"
            : "Loading 3D…"}
      </span>
    </div>
  );
}

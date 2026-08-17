"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight, DoubleSide, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, PerspectiveCamera, PointLight, Scene, SphereGeometry,
  TorusGeometry, WebGLRenderer,
} from "three";

export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 760) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearAlpha(0);
    host.appendChild(renderer.domElement);

    const group = new Group();
    scene.add(group);
    const coreGeometry = new IcosahedronGeometry(1.06, 2);
    const coreMaterial = new MeshPhysicalMaterial({
      color: 0x42d8a7,
      emissive: 0x073b31,
      roughness: 0.26,
      metalness: 0.12,
      transparent: true,
      opacity: 0.82,
      wireframe: true,
    });
    const core = new Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const ringMaterial = new MeshBasicMaterial({ color: 0x70e4bc, transparent: true, opacity: 0.23, side: DoubleSide });
    const ringGeometry = new TorusGeometry(1.72, 0.006, 6, 160);
    const ringA = new Mesh(ringGeometry, ringMaterial);
    ringA.rotation.x = 1.18;
    ringA.rotation.y = 0.3;
    group.add(ringA);
    const ringB = ringA.clone();
    ringB.scale.setScalar(1.28);
    ringB.rotation.x = 0.45;
    ringB.rotation.z = 0.85;
    group.add(ringB);

    const dotGeometry = new SphereGeometry(0.045, 12, 12);
    const dotMaterial = new MeshBasicMaterial({ color: 0xb0ffe2 });
    const dotA = new Mesh(dotGeometry, dotMaterial);
    dotA.position.set(1.45, 0.9, 0.2);
    group.add(dotA);
    const dotB = dotA.clone();
    dotB.position.set(-1.78, -0.35, 0.1);
    group.add(dotB);

    const light = new PointLight(0x6be8bd, 18, 12);
    light.position.set(2, 2, 4);
    scene.add(light);
    scene.add(new AmbientLight(0xffffff, 0.65));

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.25;
    };
    const onResize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const draw = (time: number) => {
      group.rotation.y += 0.0022;
      ringA.rotation.z += 0.0015;
      ringB.rotation.y -= 0.0012;
      group.rotation.x += (pointerY - group.rotation.x) * 0.018;
      group.rotation.z += (pointerX - group.rotation.z) * 0.018;
      core.scale.setScalar(1 + Math.sin(time * 0.0012) * 0.025);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-scene" ref={hostRef} />;
}

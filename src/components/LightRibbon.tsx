import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const vertexShader = `
uniform float time;
uniform vec2 mousePosition;
uniform float mouseInfluence;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 pos = position;
  vUv = uv;

  vec2 toMouse = mousePosition - vec2(modelViewMatrix * vec4(position, 1.0));
  float mouseDistance = length(toMouse);
  float mouseEffect = exp(-mouseDistance * 2.0) * mouseInfluence;

  float angle = uv.x * 6.28318;
  float radius = uv.y;

  float wave1 = sin(angle * 3.0 + time * 1.5) * 0.18;
  float wave2 = cos(radius * 8.0 - time * 1.2) * 0.12;
  float wave3 = sin((angle + radius) * 4.0 + time * 0.8) * 0.08;
  float displacement = wave1 + wave2 + wave3;
  displacement += mouseEffect * 0.3;

  vec3 newPosition = position + normal * displacement;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vNormal = normal;
}
`;

const fragmentShader = `
uniform float time;
varying vec2 vUv;

void main() {
  float r = vUv.y * 0.35 + sin(time * 0.4 + vUv.x * 4.0) * 0.12 + 0.02;
  float g = vUv.y * 0.3 + cos(time * 0.3 + vUv.y * 5.0) * 0.1 + 0.02;
  float b = vUv.y * 0.45 + sin(time * 0.5 + vUv.x * 3.0) * 0.15 + 0.08;
  float intensity = smoothstep(0.0, 0.6, vUv.y);
  vec3 finalColor = vec3(r, g, b) * intensity;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function LightRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    mouseActive: false,
    disposed: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const state = stateRef.current;
    state.disposed = false;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const C = 5;
    const camera = new THREE.OrthographicCamera(-C, C, C, -C, 0, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0c0c1a);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // Spline
    const controlPoints = [
      new THREE.Vector3(-3.2, -3.9, -0.6),
      new THREE.Vector3(7.7, -5.5, -0.4),
      new THREE.Vector3(-2.3, 6.8, -0.3),
      new THREE.Vector3(-7.8, -1.4, 1.4),
      new THREE.Vector3(2.4, -3.1, -1.1),
      new THREE.Vector3(3.4, -8, -1.2),
    ];
    const curve = new THREE.CatmullRomCurve3(controlPoints, false, "centripetal", 0.5);

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0.0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        mouseInfluence: { value: 0.0 },
      },
      side: THREE.DoubleSide,
    });

    // Main tube
    const geometry = new THREE.TubeGeometry(curve, 512, 0.4, 64, false);
    const tube = new THREE.Mesh(geometry, material);

    // Second tube (pink accent)
    const geometry2 = new THREE.TubeGeometry(curve, 512, 0.02, 32, false);
    const material2 = new THREE.MeshBasicMaterial({
      color: 0xff4ecd,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const tube2 = new THREE.Mesh(geometry2, material2);

    const group = new THREE.Group();
    group.add(tube);
    group.add(tube2);
    scene.add(group);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.0,
      0.5,
      0.0
    );
    composer.addPass(bloomPass);

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onMouseEnter = () => { state.mouseActive = true; };
    const onMouseLeave = () => { state.mouseActive = false; };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    // Animation
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      if (state.disposed) return;
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      material.uniforms.time.value = elapsed;
      material.uniforms.mousePosition.value.set(state.mouseX, state.mouseY);

      const currentInfluence = material.uniforms.mouseInfluence.value;
      const targetInfluence = state.mouseActive ? 1.0 : 0.0;
      material.uniforms.mouseInfluence.value += (targetInfluence - currentInfluence) * 0.05;

      group.rotation.z = Math.sin(elapsed * 0.2) * 0.15;

      composer.render();
    };
    animate();

    // Resize
    const onResize = () => {
      if (state.disposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      state.disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      geometry.dispose();
      geometry2.dispose();
      material.dispose();
      material2.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

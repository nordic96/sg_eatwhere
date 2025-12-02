import * as THREE from "three";
import { useMemo } from "react";
import { AdditiveBlending } from "three";

export function generateGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // radial gradient but stretched to oval later
  const grd = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size * 0.5,
  );

  grd.addColorStop(0, "rgba(255,220,160,1)");
  grd.addColorStop(0.4, "rgba(255,180,120,0.7)");
  grd.addColorStop(1, "rgba(255,150,80,0)");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function Glow({ color = "#ffcc88", intensity = 1, scale = [3, 2] }) {
  const texture = useMemo(() => generateGlowTexture(), []);

  return (
    <sprite scale={new THREE.Vector3(...scale)}>
      <spriteMaterial
        attach="material"
        map={texture}
        color={color}
        depthWrite={false}
        transparent
        blending={AdditiveBlending}
        opacity={0.9 * intensity}
      />
    </sprite>
  );
}

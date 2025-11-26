// components/River.tsx
"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type RiverProps = {
  // curve points in map units (x,z). y will be small (height above plane)
  points: Array<[number, number]>;
  width?: number; // river half-width
  flowSpeed?: number; // texture scroll speed
  color?: string;
  position?: [number, number, number];
};

function makeRiverShape(points: Array<[number, number]>, halfWidth: number) {
  // Build left and right offsets along the polyline to create a polygon
  if (points.length < 2) return new THREE.Shape();

  const left: THREE.Vector2[] = [];
  const right: THREE.Vector2[] = [];

  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i];
    // direction vector
    const prev = i === 0 ? points[i] : points[i - 1];
    const next = i === points.length - 1 ? points[i] : points[i + 1];
    const dir = new THREE.Vector2(next[0] - prev[0], next[1] - prev[1]).normalize();

    // normal to the direction (rotate 90°)
    const normal = new THREE.Vector2(-dir.y, dir.x);

    left.push(new THREE.Vector2(x, z).addScaledVector(normal, halfWidth));
    right.push(new THREE.Vector2(x, z).addScaledVector(normal, -halfWidth));
  }

  // Build shape by going along left then reversed right
  const shape = new THREE.Shape();
  const left0 = left[0];
  shape.moveTo(left0.x, left0.y);
  for (const p of left) shape.lineTo(p.x, p.y);
  for (let i = right.length - 1; i >= 0; i--) shape.lineTo(right[i].x, right[i].y);
  shape.closePath();
  return shape;
}

// simple canvas texture: soft gradient + subtle stripes for cartoony flow
function createFlowTexture(color = "#5fb3ff") {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // base gradient
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, "#68c2ff");
  g.addColorStop(1, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // subtle diagonal lighter streaks
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 8;
  for (let i = -size; i < size * 2; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, -size);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }

  // convert to texture
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1.5); // repeat to give flow tiling
  tex.anisotropy = 4;
  return tex;
}

export default function River({
  points,
  width = 1.8,
  flowSpeed = 0.02,
  color = "#5fb3ff",
  position = [0, 0.01, 0],
}: RiverProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => createFlowTexture(color), [color]);
  const shape = useMemo(() => makeRiverShape(points, width), [points, width]);
  const geo = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);

  // animate texture offset
  useFrame(({ clock }) => {
    // eslint-disable-next-line react-hooks/immutability
    tex.offset.x = -clock.getElapsedTime() * flowSpeed;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        map={tex}
        transparent={false}
        roughness={0.6}
        metalness={0.0}
        side={THREE.DoubleSide}
        // a flatter look: remove specular shine with higher roughness
      />
    </mesh>
  );
}

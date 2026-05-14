// utils/calcEnvironment.ts
import { Vector3Tuple } from 'three';

export interface EnvironmentState {
  isDay: boolean;
  isNight: boolean;
  sunPosition: Vector3Tuple;
  moonPosition: Vector3Tuple;
  ambientIntensity: number;
  sunIntensity: number;
}

export function calculateEnvironment(): EnvironmentState {
  // Get hour in Singapore time
  const hrs = Number(
    new Date().toLocaleString('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Singapore',
    }),
  );

  const isDay = hrs >= 6 && hrs < 18;
  const isNight = !isDay;

  // Sun position (moves across the sky)
  const sunAngle = ((hrs - 6) / 12) * Math.PI; // 0 → PI
  const sunX = Math.cos(sunAngle) * 50;
  const sunY = Math.sin(sunAngle) * 50;

  // Moon position (opposite side)
  const moonAngle = sunAngle + Math.PI;
  const moonX = Math.cos(moonAngle) * 70;
  const moonY = Math.sin(moonAngle) * 30;

  return {
    isDay,
    isNight,
    sunPosition: [sunX, sunY, -20],
    moonPosition: [moonX, moonY, 20],
    ambientIntensity: isDay ? 2.5 : 0.25,
    sunIntensity: isDay ? 1.1 : 0.05,
  };
}

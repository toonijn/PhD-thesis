import * as THREE from "three";

export function hexToGLSL(color: string) {
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;
  return `vec3(${r}, ${g}, ${b})`;
}

export function asThreeColor(color: string, output?: THREE.Color) {
  return (output || new THREE.Color()).setStyle(color, "srgb-linear");
}

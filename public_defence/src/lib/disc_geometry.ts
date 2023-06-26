import * as THREE from "three";

export default class DiscGeometry extends THREE.BufferGeometry {
  constructor(radial_segments: number, angular_segments: number) {
    super();

    const positions: number[] = [];
    const indices: number[] = [];
    const uv: number[] = [];

    const rn = radial_segments;
    const tn = angular_segments;
    for (let r = 0; r <= rn; r++) {
      const radius = r / rn;
      for (let t = 0; t <= tn; t++) {
        const theta = (t / tn) * 2 * Math.PI;
        positions.push(radius * Math.cos(theta), radius * Math.sin(theta), 0);
        uv.push(r / rn, 1 - t / tn);
      }
      if (r > 0) {
        const s = r * (tn + 1);
        for (let t = 0; t < tn; t++) {
          indices.push(s + t, s + t + 1, s - tn - 1 + t);
          indices.push(s - tn - 1 + t, s + t + 1, s - tn + t);
        }
      }
    }

    this.setIndex(indices);
    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  }
}

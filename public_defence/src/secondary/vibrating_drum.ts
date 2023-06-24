import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import LinearCombinationPlot from "../lib/linear_combination_plot";
import drum from "../assets/computed/drum.json";
import ugent from "../lib/theme";
import { asThreeColor } from "../lib/color";

const rn = 40;
const tn = 120;

const disc = (() => {
  const disc = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const uv: number[] = [];

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
  console.log(indices.reduce((a, b) => Math.max(a, b)));
  console.log(positions.length / 3);
  console.log(positions);

  disc.setIndex(indices);
  disc.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  disc.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));

  return disc;
})();

const initial = [[0], [0, 0.5], [0.5, 1], [0.2], [0, 1]];
const offset = initial.map((a) => a.map(() => 2 * Math.PI * Math.random()));

export default new (class extends ThreeSlide {
  plot = new LinearCombinationPlot(
    drum.eigs.flatMap(({ E, zs }) => {
      return zs.map((z) => {
        const t = new THREE.DataTexture(
          new Float32Array(z.flat()),
          z[0].length,
          z.length,
          THREE.RedFormat,
          THREE.FloatType
        );
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.wrapT = THREE.RepeatWrapping;
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.needsUpdate = true;
        return t;
      });
    }),
    disc
  );
  camera: THREE.OrthographicCamera;
  time = 0;

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    this.plot.add(
      new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.015, 12, tn),
        new THREE.MeshBasicMaterial({
          color: asThreeColor(ugent.wit).multiplyScalar(0.3),
        })
      )
    );
    this.plot.scale.setScalar(0.9);

    this.scene.add(this.plot);
  }

  resize() {
    super.resize();
    const { x: width, y: height } = this.size;
    if (width > height) {
      this.camera.right = width / height;
      this.camera.left = -this.camera.right;
      this.camera.bottom = -1;
      this.camera.top = 1;
    } else {
      this.camera.top = height / width;
      this.camera.bottom = -this.camera.top;
      this.camera.left = -1;
      this.camera.right = 1;
    }
    this.camera.updateProjectionMatrix();
  }

  activate(element: HTMLElement) {
    super.activate(element);
    this.time = 0;
  }

  onFrame(dt: number) {
    this.time += dt;
    this.plot.weights = drum.eigs.flatMap(({ E }, i) => {
      return initial[i].map(
        (v, j) => v * Math.sin(offset[i][j] + 0.3 * Math.sqrt(E) * this.time)
      );
    });

    super.onFrame(dt);
  }
})();

import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import eigenfunctions from "../assets/computed/title_eigenfunctions.json";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import LinearCombinationPlot from "../lib/linear_combination_plot";

class NoiseGenerator {
  noise: NoiseFunction2D[];

  constructor(dimensions: number) {
    this.noise = [];
    for (let i = 0; i < dimensions; i++) {
      this.noise.push(createNoise2D());
    }
  }

  generate(x: number, y: number) {
    const result: number[] = [];
    for (let i = 0; i < this.noise.length; i++) {
      result.push(this.noise[i](x, y));
    }
    return result;
  }
}

const zoom = 1.5;

const n = eigenfunctions.eigenfunctions.length;

export default new (class extends ThreeSlide {
  plot = new LinearCombinationPlot(
    eigenfunctions.eigenfunctions.map((data) => {
      const t = new THREE.DataTexture(
        new Float32Array(data),
        eigenfunctions.width,
        eigenfunctions.height,
        THREE.RedFormat,
        THREE.FloatType
      );
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.needsUpdate = true;
      return t;
    }),
    new THREE.PlaneGeometry(2 * zoom, 2 * zoom)
  );
  camera: THREE.OrthographicCamera;
  noise: NoiseGenerator | undefined;

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

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
  activate(element) {
    super.activate(element);
    this.noise = new NoiseGenerator(n);
  }
  onFrame() {
    if (this.noise === undefined) return;

    const t = (0.2 * +new Date()) / 1000;
    const phi = (1 + Math.sqrt(5)) / 2;
    const weights = this.noise.generate(
      (1 + Math.cos(t * phi)) / 2,
      (1 + Math.sin(t)) / 2
    );
    const s = Math.hypot(...weights);
    this.plot.weights = weights.map((w) => w / s);

    super.onFrame();
  }
})();

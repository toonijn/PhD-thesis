import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import LinearCombinationPlot from "../lib/linear_combination_plot";
import drum from "../assets/computed/drum.json";
import ugent from "../lib/theme";
import { asThreeColor } from "../lib/color";
import AnimationSlide from "../lib/animation_slide";
import DiscGeometry from "../lib/disc_geometry";

const rows = 2;
const cols = 3;

const angular_segments = 120;
const disc = new DiscGeometry(40, angular_segments);

const textures = drum.eigs.slice(0, cols * rows).map(({ E, zs }) => {
  const z = zs[0];

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

const borderGeometry = new THREE.TorusGeometry(1, 0.015, 12, angular_segments);
const borderMaterial = new THREE.MeshBasicMaterial({
  color: asThreeColor(ugent.wit).multiplyScalar(0.3),
});

export default new (class extends AnimationSlide {
  renderer: THREE.WebGLRenderer | undefined;
  canvas: HTMLCanvasElement | undefined;
  plots = textures.map((t) => new LinearCombinationPlot([t], disc));
  scenes: THREE.Scene[] = [];
  camera: THREE.OrthographicCamera;
  size = new THREE.Vector2(1, 1);
  time = 0;

  constructor() {
    super();

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    this.plots = textures.map((t) => {
      const p = new LinearCombinationPlot([t], disc);
      p.add(new THREE.Mesh(borderGeometry, borderMaterial));
      p.scale.setScalar(0.9);
      return p;
    });
    this.scenes = this.plots.map((p) => {
      const scene = new THREE.Scene();
      scene.add(p);
      return scene;
    });
  }

  initialize(element: HTMLElement) {
    super.initialize(element);
    this.canvas = element.querySelector("canvas") as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClear = false;

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.getSize(this.size);
  }

  activate(element: HTMLElement) {
    super.activate(element);
    this.resize();
    this.time = 0;
  }

  onFrame(dt: number) {
    if (this.renderer) {
      const renderer = this.renderer;
      renderer.getSize(this.size);
      const { x: width, y: height } = this.size;
      const cell_size = 0.9 * Math.min(width / cols, height / rows);
      this.time += dt;

      renderer.clear();

      this.plots.forEach((p, i) => {
        p.weights = [Math.cos(0.3 * Math.sqrt(drum.eigs[i].E) * this.time)];
      });

      this.scenes.forEach((s, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        renderer.setViewport(
          (width / cols) * col + (width / cols - cell_size) / 2,
          (height / rows) * (rows - 1 - row) + (height / rows - cell_size) / 2,
          cell_size,
          cell_size
        );
        renderer.render(s, this.camera);
      });
    }

    super.onFrame(dt);
  }
})();

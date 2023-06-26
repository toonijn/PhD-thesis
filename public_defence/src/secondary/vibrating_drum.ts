import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import LinearCombinationPlot from "../lib/linear_combination_plot";
import drum from "../assets/computed/drum.json";
import ugent from "../lib/theme";
import { asThreeColor } from "../lib/color";
import DiscGeometry from "../lib/disc_geometry";

const angular_segments = 120;
const disc = new DiscGeometry(40, angular_segments);

const initial = [[0], [0, 0.5], [0.5, 1], [0.2], [0, 1], [0, 0]];
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
        new THREE.TorusGeometry(1, 0.015, 12, angular_segments),
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

import * as THREE from "three";
import { asThreeColor } from "../lib/color";
import ugent from "../lib/theme";
import AnimationSlide from "../lib/animation_slide";
// @ts-ignore
import ugent_matcap from "../assets/matcap.png";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const texture_size = 128;
const surface_size = 48;
const border_radius = 0.015;

const left_panel = 0.4;

const border_color = asThreeColor(ugent.wit).multiplyScalar(0.3);

const eigenfunction = (x: number, y: number) => {
  return Math.sin(2 * Math.PI * x) * Math.sin(2 * Math.PI * y);
};

const toColor = (() => {
  const blauw = asThreeColor(ugent.blauw);
  const wit = asThreeColor(ugent.wit);
  const rood = asThreeColor(ugent.rood);
  return (value: number, color: THREE.Color) => {
    const v = Math.abs(value);
    let f = 1 - Math.pow(1 - v, 2.2);
    f = Math.min(Math.max(f, 0), 1);
    color.copy(wit).lerp(value < 0 ? blauw : rood, f);
  };
})();

const texture = (() => {
  const tmpColor = new THREE.Color();
  const data = new Float32Array(texture_size * texture_size * 4);

  for (let i = 0; i < texture_size; i++) {
    for (let j = 0; j < texture_size; j++) {
      const index = 4 * (i * texture_size + j);
      const x = (i + 0.5) / texture_size;
      const y = (j + 0.5) / texture_size;
      const value = eigenfunction(x, y);
      toColor(value, tmpColor);
      tmpColor.toArray(data, index);
      data[index + 3] = 1; // Alpha channel
    }
  }

  const t = new THREE.DataTexture(
    data,
    texture_size,
    texture_size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
})();

const surface = (() => {
  const geometry = new THREE.PlaneGeometry(2, 2, surface_size, surface_size);
  const pos = geometry.getAttribute("position");

  for (let i = 0; i <= pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = 0.6 * eigenfunction(0.5 * (x + 1), 0.5 * (y + 1));
    pos.setXYZ(i, x, z, y);
  }

  geometry.computeVertexNormals();

  return geometry;
})();

const border_geometry = (() => {
  const r = border_radius;
  const n = 6;
  const cylinder = new THREE.CylinderGeometry(r, r, 2, 2 * n, 2);
  cylinder.rotateZ(Math.PI / 2);
  cylinder.translate(0, -1, 0);
  const sphere = new THREE.SphereGeometry(r, 12, n);
  sphere.translate(1, -1, 0);

  const side = BufferGeometryUtils.mergeGeometries([cylinder, sphere]);
  const two_sides = BufferGeometryUtils.mergeGeometries([
    side,
    side.clone().rotateZ(Math.PI / 2),
  ]);
  return BufferGeometryUtils.mergeGeometries([
    two_sides,
    two_sides.clone().rotateZ(Math.PI),
  ]);
})();

const matcap = new THREE.TextureLoader().load(ugent_matcap);

const camera_offset = 1 + border_radius / 2;

export default new (class extends AnimationSlide {
  renderer: THREE.WebGLRenderer | undefined;
  canvas: HTMLCanvasElement | undefined;
  scene_left = new THREE.Scene();
  scene_right = new THREE.Scene();
  camera_left = new THREE.OrthographicCamera(
    -camera_offset,
    camera_offset,
    camera_offset,
    -camera_offset,
    -1,
    1
  );
  camera_right = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  size = new THREE.Vector2(1, 1);
  time = 0;

  constructor() {
    super();

    this.scene_left.add(this.camera_left);
    this.scene_left.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 1, 1),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
      )
    );
    this.scene_left.add(
      new THREE.Mesh(
        border_geometry,
        new THREE.MeshBasicMaterial({
          color: border_color,
        })
      )
    );

    this.scene_right.add(this.camera_right);
    const surface_mesh = new THREE.Mesh(
      surface,
      new THREE.MeshMatcapMaterial({
        map: texture,
        side: THREE.DoubleSide,
        matcap: matcap,
      })
    );
    surface_mesh.scale.setScalar(0.55);
    this.scene_right.add(surface_mesh);
    surface_mesh.add(
      new THREE.Mesh(
        border_geometry,
        new THREE.MeshMatcapMaterial({
          color: border_color,
          side: THREE.DoubleSide,
          matcap: matcap,
        })
      ).rotateX(Math.PI / 2)
    );
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

  activate(element: HTMLElement) {
    super.activate(element);
    this.resize();
    this.time = 0;
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.getSize(this.size);

    this.camera_right.aspect = ((1 - left_panel) * this.size.x) / this.size.y;
    this.camera_right.updateProjectionMatrix();
  }

  onFrame(dt: number): void {
    this.time += dt;
    if (this.renderer) {
      this.renderer.getSize(this.size);
      const left_size = 0.8 * Math.min(left_panel * this.size.x, this.size.y);

      const a = 0.3 * this.time;
      this.camera_right.position.set(
        2.2,
        0.4 + 0.1 * Math.cos((1 / 1.61803398875) * a),
        -0.3 - 0.7 * Math.cos(a + 0.1)
      );
      this.camera_right.lookAt(0, 0, 0);

      this.renderer.clear();

      this.renderer.setViewport(
        (left_panel * this.size.x - left_size) / 2,
        (this.size.y - left_size) / 2,
        left_size,
        left_size
      );
      this.renderer.render(this.scene_left, this.camera_left);

      this.renderer.setViewport(
        left_panel * this.size.x,
        0,
        (1 - left_panel) * this.size.x,
        this.size.y
      );
      this.renderer.render(this.scene_right, this.camera_right);
    }
    super.onFrame(dt);
  }
})();

import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import ugent from "../lib/theme";
import ugent_matcap from "../assets/matcap.png";
import {
  GraphContainer,
  GraphScalarFunction,
  GraphGroup,
  Axis,
} from "../lib/graph/graph";

const surface_geometry = (() => {
  const geometry = new THREE.PlaneGeometry(2, 2, 21, 21);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    positions.setXYZ(i, x, x * y, y);
  }
  geometry.computeVertexNormals();
  return geometry;
})();

function construct1DPlot() {
  const container = new GraphContainer();
  container.setBounds(-1, 1.6, -2.1, 0.4);

  const options = { position: 0, arrowHead: 0.05, arrowFilled: true };
  const axes = [
    new Axis({ type: "x", min: -0.9, max: 1.5, ...options }),
    new Axis({ type: "y", reverse: true, min: -2, max: 0.2, ...options }),
  ];
  axes.forEach((axis) => {
    axis.setAttribute("stroke", ugent.zwart);
    axis.setAttribute("fill", ugent.zwart);
    axis.setAttribute("stroke-width", "0.01");
    container.add(axis);
  });
  const curve = new GraphScalarFunction({
    f: (x) => -x * x,
    min: -0.9,
    max: 1.3,
  });
  curve.setAttribute("stroke", ugent.blauw);
  curve.setAttribute("stroke-width", "0.04");

  container.add(curve);

  return container;
}

export default new (class extends ThreeSlide {
  camera: THREE.PerspectiveCamera | undefined;

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.scene.add(
      new THREE.Mesh(
        surface_geometry,
        new THREE.MeshMatcapMaterial({
          side: THREE.DoubleSide,
          matcap: new THREE.TextureLoader().load(ugent_matcap),
        }) as any as THREE.MeshBasicMaterial
      )
    );
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        color: ugent.zwart,
        side: THREE.DoubleSide,
        opacity: 0.1,
        transparent: true,
      })
    );
    plane.rotateX(Math.PI / 2);
    this.scene.add(plane);
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    element.querySelector(".plot1d")?.appendChild(construct1DPlot().element);
  }

  resize() {
    super.resize();
    if (!this.camera || !this.canvas) return;
    const { width, height } = this.canvas;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  onFrame() {
    if (!this.camera) return;

    const t = (0.2 * +new Date()) / 1000;
    this.camera.position.x = 3 * Math.cos(t);
    this.camera.position.y = 1;
    this.camera.position.z = 3 * Math.sin(t);
    this.camera.lookAt(0, 0, 0);

    super.onFrame();
  }
})();

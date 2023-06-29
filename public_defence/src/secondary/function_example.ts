import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import ugent from "../lib/theme";
// @ts-ignore
import ugent_matcap from "../assets/matcap.png";
import {
  GraphContainer,
  GraphScalarFunction,
  GraphGroup,
  Axis,
  GraphLine,
  GraphCircle,
  GraphPath,
} from "../lib/graph/graph";
import { asThreeColor } from "../lib/color";

const surface_geometry = (() => {
  const geometry = new THREE.PlaneGeometry(2, 2, 60, 60);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    positions.setXYZ(
      i,
      x,
      2 * Math.sin(-Math.sqrt(3) * y) * Math.exp(-3 * (x * x + y * y)),
      y
    );
  }
  geometry.computeVertexNormals();
  return geometry;
})();

const smiley = (happy: boolean) => {
  let path = "";

  if (happy) {
    path += "M -0.2 -0.2 L 0.2 -0.2";
    path += "M 0 0 L 0 -0.4";
    path += " M -0.5 0.2 Q 0 0.8 0.5 0.2";
  } else {
    path += "M -0.2 -0.2 L 0.2 -0.2";
    path += " M -0.5 0.5 Q 0 0 0.5 0.5";
  }

  const p = new GraphPath();
  p.d = path;
  p.setAttribute("stroke", ugent.groen);
  p.setAttribute("stroke-width", "0.08");
  p.setAttribute("stroke-linecap", "round");

  p.setAttribute("fill", "none");
  return p;
};

class Plot1D {
  container = new GraphContainer();
  tangent = new GraphGroup();

  constructor() {
    this.container.setBounds(-1.2, 1.8, -2, 1.1);

    const options = { position: 0, arrowHead: 0.05, arrowFilled: true };
    const axes = [
      new Axis({ type: "x", min: -0.9, max: 1.5, ...options }),
      new Axis({ type: "y", reverse: true, min: -1.1, max: 0.6, ...options }),
    ];
    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", "0.01");
      this.container.add(axis);
    });
    const curve = new GraphScalarFunction({
      f: (x) => -(x * x * x - x),
      min: -0.9,
      max: 1.3,
    });
    curve.setAttribute("stroke", ugent.blauw);
    curve.setAttribute("stroke-width", "0.04");

    const x = 1.05;
    const fx = x * x * x - x;
    const dx = 3 * x * x - 1;
    const h = 0.2;

    const line = new GraphLine();
    line.setLocation([x - h, -(fx - h * dx)], [x + h, -(fx + h * dx)]);
    line.setAttribute("stroke", ugent.rood);
    line.setAttribute("stroke-width", "0.02");

    const point = new GraphCircle();
    point.setLocation([x, -fx], 0.05);
    point.setAttribute("fill", ugent.rood);

    const mountain = smiley(false);
    mountain.setAttribute(
      "transform",
      `translate(${-0.58}, ${-0.55}) scale(0.35)`
    );

    const valley = smiley(true);
    valley.setAttribute("transform", `translate(${0.58}, ${0.18}) scale(0.35)`);

    this.tangent.add(line, point, mountain, valley);

    this.container.add(curve, this.tangent);
  }
}

export default new (class extends ThreeSlide {
  camera: THREE.PerspectiveCamera | undefined;
  time: number = 0;
  plot1d = new Plot1D();

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.scene.add(
      new THREE.Mesh(
        surface_geometry,
        new THREE.MeshMatcapMaterial({
          color: asThreeColor(ugent.blauw),
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
    // this.scene.add(plane);

    this.setState("derivatives");
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    element
      .querySelector(".plot1d")
      ?.appendChild(this.plot1d.container.element);
  }

  setState(state?: string): void {
    if (state == "derivatives") {
      this.plot1d.tangent.element.style.display = "";
    } else {
      this.plot1d.tangent.element.style.display = "none";
    }
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.time = 0;
  }

  resize() {
    super.resize();
    if (!this.camera || !this.canvas) return;
    const { width, height } = this.canvas;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  onFrame(dt: number) {
    if (!this.camera) return;

    this.time += dt;
    const t = 0.05 - 0.3 * Math.sin(0.3 * this.time);
    this.camera.position.x = 3 * Math.cos(t);
    this.camera.position.y = Math.cos(1 + 1.6181 * t);
    this.camera.position.z = 3 * Math.sin(t);
    this.camera.lookAt(0, 0, 0);

    super.onFrame(dt);
  }
})();

import ThreeSlide from "./three_slide.js";
import * as THREE from "three";
import ugent from "../theme.js";
import ugent_matcap from "../assets/matcap.png";

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

export default new (class extends ThreeSlide {
  constructor() {
    super((element) => element.querySelector("canvas"));

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.scene.add(
      new THREE.Mesh(
        surface_geometry,
        new THREE.MeshMatcapMaterial({
          side: THREE.DoubleSide,
          matcap: new THREE.TextureLoader().load(ugent_matcap),
        })
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
  resize() {
    super.resize();
    const { width, height } = this.canvas;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  onFrame() {
    const t = (0.2 * +new Date()) / 1000;
    this.camera.position.x = 3 * Math.cos(t);
    this.camera.position.y = 1;
    this.camera.position.z = 3 * Math.sin(t);
    this.camera.lookAt(0, 0, 0);

    super.onFrame();
  }
})();

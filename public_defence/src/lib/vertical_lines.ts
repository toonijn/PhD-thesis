import * as THREE from "three";

export default class VerticalLines extends THREE.Object3D {
  line_mesh: THREE.LineSegments | undefined = undefined;

  constructor(
    public line_material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2,
    })
  ) {
    super();
  }

  setLocations(data: number[], low = -1, high = 1) {
    console.log(data);
    if (this.line_mesh) {
      this.line_mesh.geometry.dispose();
      this.remove(this.line_mesh);
    }
    this.line_mesh = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(
        data
          .map((x) => {
            return [new THREE.Vector2(x, low), new THREE.Vector2(x, high)];
          })
          .flat()
      ),
      this.line_material
    );
    this.line_mesh.computeLineDistances();
    this.add(this.line_mesh);
  }
}

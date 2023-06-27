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
} from "../lib/graph/graph";
import { asThreeColor } from "../lib/color";
import strands from "../assets/computed/drum_strands.json";

const radius = 0.015;

function skinned_cylinder(bones: number) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    bones - 1,
    16,
    1 + 4 * (bones - 1),
    true
  );
  const positions = geometry.getAttribute("position");
  const skinIndices: number[] = [];
  const skinWeights: number[] = [];
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i) + (bones - 1) / 2;
    positions.setY(i, 0);
    const index = Math.floor(y);
    skinIndices.push(index, index == bones - 1 ? 0 : index + 1, 0, 0);
    skinWeights.push(1 - (y - index), y - index, 0, 0);
  }
  positions.needsUpdate = true;
  geometry.setAttribute(
    "skinIndex",
    new THREE.Uint16BufferAttribute(skinIndices, 4)
  );
  geometry.setAttribute(
    "skinWeight",
    new THREE.Float32BufferAttribute(skinWeights, 4)
  );
  return geometry;
}

const initial = [[0], [0, 0.5], [0.5, 1], [0.2], [0, 1], [0, 0]];
// const initial = [[0], [1, 1], [0, 0], [0], [0, 0], [0, 0]];
const offset = initial.map((a) => a.map(() => 2 * Math.PI * Math.random()));

const matcap = new THREE.TextureLoader().load(ugent_matcap);

const strand_material_blauw = new THREE.MeshMatcapMaterial({
  color: asThreeColor(ugent.blauw),
  side: THREE.DoubleSide,
  matcap: matcap,
});

const strand_material_rood = new THREE.MeshMatcapMaterial({
  color: asThreeColor(ugent.rood),
  side: THREE.DoubleSide,
  matcap: matcap,
});

interface StrandData {
  t: number;
  ts: number[];
  strand: [number, number][];
}

class Strand extends THREE.SkinnedMesh {
  bones: THREE.Bone[];
  constructor(bone_count: number, material: THREE.Material) {
    super(skinned_cylinder(bone_count), material);
    this.frustumCulled = false;
    this.bones = [];
    for (let i = 0; i < bone_count; i++) {
      const bone = new THREE.Bone();
      bone.matrixAutoUpdate = false;
      this.add(bone);
      this.bones.push(bone);
    }
    const skeleton = new THREE.Skeleton(this.bones);
    skeleton.calculateInverses();
    this.bind(skeleton);
    this.pose();
  }

  update(data: StrandData) {
    this.bones.forEach((bone, i) => {
      bone.matrix.makeRotationX(Math.atan(data.strand[i][1]));
      bone.matrix.setPosition(data.t, data.ts[i], data.strand[i][0]);
      bone.updateMatrixWorld();
    });
  }
}

function weighted_sum(
  weights: number[][],
  data: [number, number][][][]
): [number, number][] {
  let r = data[0][0].map(() => [0, 0] as [number, number]);
  weights.forEach((ws, i) =>
    ws.forEach((w, j) => {
      data[i][j].forEach((d, k) => {
        r[k][0] += w * d[0];
        r[k][1] += w * d[1];
      });
    })
  );
  return r;
}

export default new (class extends ThreeSlide {
  camera: THREE.PerspectiveCamera | undefined;
  strands: { t: number; ts: number[]; strand: Strand }[];
  data: [number, number][][][][] = [];
  time: number = 0;

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);

    this.strands = [];
    strands.eigs[0].zs[0].x.forEach((data, j) => {
      const s = new Strand(data.strand.length, strand_material_blauw);
      s.rotateX(-Math.PI / 2);
      s.rotateZ(-Math.PI / 2);
      this.data.push(
        strands.eigs.map(({ zs }) =>
          zs.map((z) => (z.x[j] as StrandData).strand)
        )
      );
      this.strands.push({ t: data.t, ts: data.ts, strand: s });
      this.scene.add(s);
      s.update(data as StrandData);
    });
    strands.eigs[0].zs[0].y.forEach((data, j) => {
      const s = new Strand(data.strand.length, strand_material_rood);
      s.rotateX(-Math.PI / 2);
      s.scale.set(1, -1, 1);

      this.data.push(
        strands.eigs.map(({ zs }) =>
          zs.map((z) => (z.y[j] as StrandData).strand)
        )
      );
      this.strands.push({ t: data.t, ts: data.ts, strand: s });
      this.scene.add(s);
      s.update(data as StrandData);
    });

    const border = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 12, 100),
      new THREE.MeshMatcapMaterial({
        color: asThreeColor(ugent.wit).multiplyScalar(0.3),
        side: THREE.DoubleSide,
        matcap: matcap,
      })
    );
    border.rotateX(Math.PI / 2);
    this.scene.add(border);
  }

  resize() {
    super.resize();
    if (!this.camera || !this.canvas) return;
    const { width, height } = this.canvas;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  activate(element: HTMLElement) {
    super.activate(element);
    this.time = 0;
  }

  onFrame(dt: number) {
    if (!this.camera) return;

    this.time += dt;

    const t = 0.2 * Math.sin(0.2 * this.time);
    this.camera.position.x = 2 * Math.cos(t);
    this.camera.position.y = 1;
    this.camera.position.z = 2 * Math.sin(t);
    this.camera.lookAt(0, -0.1, 0);

    const weights = strands.eigs.map(({ E }, i) => {
      return initial[i].map(
        (v, j) =>
          0.4 * (v * Math.sin(offset[i][j] + 0.2 * Math.sqrt(E) * this.time))
      );
    });

    this.strands.forEach(({ t, ts, strand }, i) => {
      strand.update({
        t,
        ts,
        strand: weighted_sum(weights, this.data[i]),
      });
    });

    super.onFrame(dt);
  }
})();

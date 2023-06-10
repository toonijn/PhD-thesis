import ThreeSlide from "../lib/three_slide.ts";
import * as THREE from "three";
import eigenfunctions from "../assets/computed/title_eigenfunctions.json";
import { createNoise2D } from "simplex-noise";

class NoiseGenerator {
  constructor(dimensions) {
    this.noise = [];
    for (let i = 0; i < dimensions; i++) {
      this.noise.push(createNoise2D());
    }
  }

  generate(x, y) {
    const result = [];
    for (let i = 0; i < this.noise.length; i++) {
      result.push(this.noise[i](x, y));
    }
    return result;
  }
}

const zoom = 1.5;

const n = eigenfunctions.eigenfunctions.length;
const interpolation_shader = new THREE.ShaderMaterial({
  uniforms: {
    textures: { value: [0, 1] },
    weights: { value: [0, 0] },
  },
  side: THREE.DoubleSide,
  vertexShader: `\
        precision highp float;
        
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
  fragmentShader: `\
        precision highp float;
        precision highp sampler2D;

        varying vec2 vUv;
        uniform sampler2D textures[${n}];
        uniform float weights[${n}];
        
        void main() {
          float r = 0.;
          ${Array.from(
            { length: n },
            (_, i) => `r += weights[${i}] * texture2D(textures[${i}], vUv).r;`
          ).join("\n")}
          gl_FragColor = vec4(1. + r, 1. - r, 1., 1.);
        }`,
});

export default new (class extends ThreeSlide {
  constructor() {
    super((element) => element.querySelector("canvas"));

    this.textures = [
      ...eigenfunctions.eigenfunctions.map((data) => {
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
    ];

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    interpolation_shader.uniforms.textures.value = this.textures;
    interpolation_shader.uniforms.textures.needsUpdate = true;

    this.scene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2 * zoom, 2 * zoom),
        interpolation_shader
      )
    );
  }
  resize() {
    super.resize();
    const { width, height } = this.canvas;
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
    const t = (0.2 * +new Date()) / 1000;
    const phi = (1 + Math.sqrt(5)) / 2;
    const weights = this.noise.generate(
      (1 + Math.cos(t * phi)) / 2,
      (1 + Math.sin(t)) / 2
    );
    const s = Math.hypot(...weights);
    interpolation_shader.uniforms.weights.value = weights.map((w) => w / s);
    interpolation_shader.uniforms.weights.needsUpdate = true;

    super.onFrame();
  }
})();

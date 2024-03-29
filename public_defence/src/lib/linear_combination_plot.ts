import { asThreeColor, hexToGLSL } from "./color";
import ugent from "./theme";
import * as THREE from "three";

const interpolationMaterial = (() => {
  const cache = {};
  return (n: number) => {
    if (cache[n] !== undefined) return cache[n].clone();
    return (cache[n] = new THREE.ShaderMaterial({
      uniforms: {
        theme_red: { value: asThreeColor(ugent.rood, undefined, true) },
        theme_white: { value: asThreeColor(ugent.wit, undefined, true) },
        theme_blue: { value: asThreeColor(ugent.blauw, undefined, true) },
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
  
          uniform vec3 theme_red;
          uniform vec3 theme_white;
          uniform vec3 theme_blue;
  
          varying vec2 vUv;
          uniform sampler2D textures[${n}];
          uniform float weights[${n}];
  
          vec3 cmap(float t) {
            t = clamp(t, -1.0, 1.0);
            float f = 1.0 - pow(1.0 - abs(t), 3.0);
            if(t < 0.0)
              return mix(theme_white, theme_blue, f);
            else
              return mix(theme_white, theme_red, f);
          }
          
          void main() {
            float r = 0.;
            ${Array.from(
              { length: n },
              (_, i) => `r += weights[${i}] * texture2D(textures[${i}], vUv).r;`
            ).join("\n")}
            gl_FragColor = vec4(cmap(r), 1.);
          }`,
    }));
  };
})();

export default class LinearCombinationPlot extends THREE.Mesh {
  material: THREE.ShaderMaterial;
  constructor(
    public readonly textures: THREE.Texture[],
    geometry: THREE.BufferGeometry = new THREE.PlaneGeometry(1, 1)
  ) {
    super(geometry, interpolationMaterial(textures.length));
    this.material.uniforms.textures.value = this.textures;
    this.weights = textures.map(() => 1);
  }

  set weights(weights: number[]) {
    this.material.uniforms.weights.value = weights;
  }
}

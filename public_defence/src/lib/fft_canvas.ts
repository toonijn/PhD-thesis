import * as THREE from "three";
import ugent from "./theme";
import { asThreeColor } from "./color";

const bar_material = new THREE.RawShaderMaterial({
  vertexShader: `
  precision highp float;
  
  attribute vec2 position;
  attribute float frequency;
  attribute float amplitude;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float depth;

  void main() {
    float a = 0.01 + 1.5 * exp(amplitude * 0.03) * 0.99;
      gl_Position = projectionMatrix * modelViewMatrix
                    * vec4( position.x + frequency, a * position.y, depth, 1.0 );
  }`,
  fragmentShader: `
  precision highp float;

  uniform vec3 color;
  
  void main() {
      gl_FragColor = vec4(color, 1.0);
  }`,
  side: THREE.DoubleSide,
  uniforms: {
    color: { value: new THREE.Color(0xff0000) },
    depth: { value: 0.0 },
  },
});

class Bars extends THREE.Mesh {
  data_attribute: THREE.InstancedBufferAttribute;
  material: any;

  constructor(bar_count: number, bar_width: number) {
    super(
      (() => {
        const bw = bar_width;
        const geom = new THREE.InstancedBufferGeometry();
        geom.instanceCount = bar_count;
        geom.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([0, 0, 0, 1, bw, 1, 0, 0, bw, 1, bw, 0]),
            2
          )
        );
        const offset: number[] = [];
        for (let i = 0; i < bar_count; i++) {
          offset.push(i * bw);
        }
        geom.setAttribute(
          "frequency",
          new THREE.InstancedBufferAttribute(
            new Float32Array(offset),
            1,
            false,
            1
          )
        );
        geom.boundingSphere = new THREE.Sphere();

        return geom;
      })(),
      bar_material.clone() as any
    );

    this.frustumCulled = false;

    const data = new Float32Array(bar_count);
    data.fill(-Infinity);

    this.data_attribute = new THREE.InstancedBufferAttribute(data, 1, false, 1);

    this.geometry.setAttribute("amplitude", this.data_attribute);
  }

  get data() {
    return this.data_attribute.array as Float32Array;
  }

  set needsUpdate(value: boolean) {
    this.data_attribute.needsUpdate = value;
  }
}

export default class FFTCanvas extends THREE.Group {
  analyser: AnalyserNode | undefined = undefined;
  audio_context: AudioContext | undefined = undefined;

  bars: Bars;
  delayed_bars: Bars;

  readonly fft_size: number;
  readonly bar_count: number;

  constructor(size: number, highest_frequency: number) {
    super();
    this.fft_size = size;  
    const bar_width = (1 / (size / 2)) * (44100 / 2 / highest_frequency);
    this.bar_count = Math.min(Math.ceil(1 / bar_width), this.fft_size / 2);

    this.bars = new Bars(this.bar_count, bar_width);
    asThreeColor(ugent.blauw, this.bars.material.uniforms.color.value, true);
    this.delayed_bars = new Bars(this.bar_count, bar_width);
    asThreeColor(ugent.geel, this.delayed_bars.material.uniforms.color.value, true);
    this.delayed_bars.material.uniforms.depth.value = -0.1;

    this.add(this.delayed_bars);
    this.add(this.bars);

    this.resumeAudio();
  }

  public resumeAudio() {
    if (this.audio_context && this.audio_context.state === "running") return;
    this.analyser = undefined;
    this.audio_context = undefined;

    const context = new AudioContext();
    if (context.state === "running") {
      this.audio_context = context;
      const analyser = context.createAnalyser();
      this.analyser = analyser;
      this.analyser.fftSize = this.fft_size;

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          const source = context.createMediaStreamSource(stream);
          source.connect(analyser);
        });
    }
  }

  public update() {
    this.resumeAudio();

    if (this.analyser) {
      const data = this.bars.data;
      this.analyser.getFloatFrequencyData(data);

      const delayed_data = this.delayed_bars.data;
      const f = 0.95;
      for (let i = 0; i < this.bar_count; i++) {
        delayed_data[i] = Math.max(
          f * delayed_data[i] + (1 - f) * data[i],
          data[i]
        );
      }

      this.bars.needsUpdate = true;
      this.delayed_bars.needsUpdate = true;
    }
  }

  public deactivate() {
    if (this.audio_context) {
      this.audio_context.suspend();
      this.audio_context.close();
      this.audio_context = undefined;
      this.analyser = undefined;
    }
  }
}

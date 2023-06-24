import AnimationSlide from "./animation_slide";
import * as THREE from "three";

export default class ThreeSlide extends AnimationSlide {
  get_canvas: (element: HTMLElement) => HTMLCanvasElement;
  scene = new THREE.Scene();
  camera: THREE.Camera | undefined = undefined;
  renderer: THREE.WebGLRenderer | undefined = undefined;
  canvas: HTMLCanvasElement | undefined = undefined;
  size: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor(get_canvas: (element: HTMLElement) => HTMLCanvasElement) {
    super();
    this.get_canvas = get_canvas;
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.getSize(this.size);
  }

  initialize(element: HTMLElement) {
    super.initialize(element);
    this.canvas = this.get_canvas(element);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener("resize", () => this.resize());
  }

  activate(element: HTMLElement) {
    super.activate(element);
    this.resize();
  }

  onFrame(dt:number) {
    if (this.renderer && this.camera)
      this.renderer.render(this.scene, this.camera);
  }
}

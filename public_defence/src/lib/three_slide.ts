import AnimationSlide from "./animation_slide";
import { Camera, Scene, WebGLRenderer } from "three";

export default class ThreeSlide extends AnimationSlide {
  get_canvas: (element: HTMLElement) => HTMLCanvasElement;
  scene: Scene = new Scene();
  camera: Camera | undefined = undefined;
  renderer: WebGLRenderer | undefined = undefined;
  canvas: HTMLCanvasElement | undefined = undefined;

  constructor(get_canvas: (element: HTMLElement) => HTMLCanvasElement) {
    super();
    this.get_canvas = get_canvas;
  }

  resize() {
    if (!this.renderer || !this.canvas) return;
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  initialize(element: HTMLElement) {
    super.initialize(element);
    this.canvas = this.get_canvas(element);
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener("resize", () => this.resize());
  }

  activate(element: HTMLElement) {
    super.activate(element);
    this.resize();
  }

  onFrame() {
    if (this.renderer && this.camera)
      this.renderer.render(this.scene, this.camera);
  }
}

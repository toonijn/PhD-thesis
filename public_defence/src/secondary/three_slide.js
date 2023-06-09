import AnimationSlide from "./animation_slide";
import { Scene, WebGLRenderer } from "three";

export default class ThreeSlide extends AnimationSlide {
  constructor(get_canvas) {
    super();
    this.get_canvas = get_canvas;
    this.scene = new Scene();
    this.camera = null;
  }

  resize() {
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  initialize(element) {
    super.initialize(element);
    this.canvas = this.get_canvas(element);
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener("resize", () => this.resize());
  }

  activate(element) {
    super.activate(element);
    this.resize();
  }

  onFrame() {
    if (this.camera) this.renderer.render(this.scene, this.camera);
  }
}

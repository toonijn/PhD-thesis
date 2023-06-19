import * as THREE from "three";
import ThreeSlide from "../lib/three_slide";
import FFTCanvas from "../lib/fft_canvas";

export default new (class FFTCello extends ThreeSlide {
  fft = new FFTCanvas(1024*4, 2000);

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
    this.scene.add(this.fft);
  }

  onFrame() {
    this.fft.update();
    super.onFrame();
  }

  deactivate() {
    super.deactivate();
    this.fft.deactivate();
  }
})();

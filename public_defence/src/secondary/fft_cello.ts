import * as THREE from "three";
import ThreeSlide from "../lib/three_slide";
import FFTCanvas from "../lib/fft_canvas";
import VerticalLines from "../lib/vertical_lines";
import ugent from "../lib/theme";

const max_frequency = 2000;
const base_frequency = 442 / 2;

export default new (class FFTCello extends ThreeSlide {
  fft = new FFTCanvas(1024 * 8, max_frequency);
  vertical_lines = new VerticalLines(
    new THREE.LineDashedMaterial({
      linewidth: 3,
      dashSize: 0.025,
      gapSize: 0.015,
      color: new THREE.Color().setStyle(ugent.zwart, "srgb-linear"),
    })
  );

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
    this.scene.add(this.fft);
    const locations: number[] = [];
    for (let i = base_frequency; i <= max_frequency; i += base_frequency)
      locations.push(i / max_frequency);

    this.vertical_lines.setLocations(locations);
    this.scene.add(this.vertical_lines);
    this.vertical_lines.position.z = -0.5;
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

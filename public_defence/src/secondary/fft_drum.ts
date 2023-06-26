import * as THREE from "three";
import ThreeSlide from "../lib/three_slide";
import FFTCanvas from "../lib/fft_canvas";
import VerticalLines from "../lib/vertical_lines";
import ugent from "../lib/theme";
import { asThreeColor } from "../lib/color";

const max_frequency = 500;
const base_frequency = 40;

const frequencies = [
  2.404825557695773, 3.8317059702075125, 5.135622301840683, 5.520078110286311,
  6.380161895923984, 7.015586669815619, 7.5883424345038035, 8.417244140399864,
  8.653727912911013, 8.771483815959954, 9.76102312998167, 9.936109524217684,
  10.173468135062722, 11.064709488501185, 11.086370019245084, 11.61984117214906,
  11.791534439014281, 12.225092264004656, 12.338604197466944,
  13.015200721698434, 13.323691936314223, 13.35430047743533, 13.589290170541217,
  14.37253667161759, 14.475500686554541, 14.795951782351262, 14.821268727013171,
  14.930917708487787, 15.589847884455486, 15.70017407971167, 16.03777419088771,
  16.223466160318768, 16.470630050877634, 16.698249933848246,
  17.003819667816014, 17.24122038248913, 17.615966049804832, 17.80143515328244,
  17.959819494987826, 18.28758283248173, 18.43346366696658, 18.899997953174022,
  18.98013387517992, 19.409415226435012, 19.554536430997054, 19.61596690396692,
  19.994430629816385, 20.320789213566506, 20.789906360078444,
  20.807047789264107,
];

export default new (class FFTCello extends ThreeSlide {
  fft = new FFTCanvas(1024 * 16, max_frequency);
  vertical_lines = new VerticalLines(
    new THREE.LineDashedMaterial({
      linewidth: 3,
      dashSize: 0.025,
      gapSize: 0.015,
      color: asThreeColor(ugent.zwart),
    })
  );

  constructor() {
    super((element) => element.querySelector("canvas") as HTMLCanvasElement);
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
    this.scene.add(this.fft);
    this.vertical_lines.setLocations(
      frequencies.map((f) => (f * base_frequency) / max_frequency)
    );
    this.scene.add(this.vertical_lines);
    this.vertical_lines.position.z = -0.5;
  }

  initialize(element: HTMLElement): void {
    super.initialize(element);
  }

  onFrame(dt: number) {
    this.fft.update();
    super.onFrame(dt);
  }

  deactivate() {
    super.deactivate();
    this.fft.deactivate();
  }
})();

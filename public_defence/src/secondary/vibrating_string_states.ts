import ugent from "../lib/theme";
import AnimationSlide from "../lib/animation_slide";
import {
  Axis,
  GraphContainer,
  GraphGroup,
  GraphPath,
  GraphScalarFunction,
  GraphText,
  GraphTextOptions,
} from "../lib/graph/graph";
import * as odex from "odex";

const n = 80;
const xs: number[] = [];
const h = 1 / (n + 1);
for (let x = 0; x < 1 + h / 2; x += h) xs.push(x);

class VibratingString {
  container = new GraphContainer();
  curve = new GraphPath();
  time = 0;

  constructor(public state: number, public frequency: number) {
    this.container.setBounds(-20, 220, -60, 60);

    this.curve.setAttribute("stroke", ugent.blauw);
    this.curve.setAttribute("fill", "none");
    this.curve.setAttribute("stroke-width", "3");
    this.curve.setAttribute("stroke-linecap", "round");
    this.curve.setAttribute("stroke-linejoin", "round");

    const options = { position: 0, arrowHead: 4, arrowFilled: true };
    const axes = [
      new Axis({ type: "x", min: 0, max: 210, ...options }),
      new Axis({ type: "y", reverse: true, min: -50, max: 50, ...options }),
    ];
    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", "0.8");
    });

    this.container.add(
      ...axes,
      this.curve,
      new GraphText("x", {
        x: 200,
        y: -11,
        width: 100,
        height: 100,
        scale: 0.4,
        halign: "center",
        math: true,
      }),
      new GraphText(`y_{${this.state}}(x)`, {
        x: 16,
        y: -45,
        width: 100,
        height: 100,
        scale: 0.4,
        halign: "center",
        math: true,
      }),
      new GraphText(
        `E_{${this.state}} = ${(1 + this.state) * (1 + this.state)}`,
        {
          x: 100,
          y: -60,
          width: 100,
          height: 100,
          scale: 0.4,
          halign: "center",
          math: true,
        }
      )
    );
  }

  reset() {
    this.time = 0;
    this.updateDrawing();
  }

  tick(dt: number) {
    this.time += dt;
    this.updateDrawing();
  }

  f(x: number) {
    return (
      Math.sin(0.3 * this.time * this.frequency * Math.PI) *
      Math.sin(x * (1 + this.state) * Math.PI)
    );
  }

  updateDrawing() {
    this.curve.d =
      `M 0 0` +
      xs.map((x, i) => `L ${x * 200} ${-this.f(x) * 50}`).join(" ") +
      `L 200 0`;
  }
}

export default new (class extends AnimationSlide {
  strings: VibratingString[] = [];

  initialize(element: HTMLElement) {
    super.initialize(element);

    for (let i = 0; i < 4; ++i) {
      const string = new VibratingString(i, 1 + i);
      element
        .querySelector(`.vibrating-string-state-${i}`)
        ?.appendChild(string.container.element);
      this.strings.push(string);
    }
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.strings.forEach((string) => string.reset());
  }

  onFrame(dt: number) {
    super.onFrame(dt);
    this.strings.forEach((string) => string.tick(dt));
  }
})();

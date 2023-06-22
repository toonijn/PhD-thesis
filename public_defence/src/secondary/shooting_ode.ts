import ThreeSlide from "../lib/three_slide";
import * as THREE from "three";
import ugent from "../lib/theme";
import {
  GraphContainer,
  GraphScalarFunction,
  GraphGroup,
  Axis,
  GraphCircle,
  GraphLine,
  GraphPath,
} from "../lib/graph/graph";
import AnimationSlide from "../lib/animation_slide";
import * as odex from "odex";

const ratio = 3;
const scale = 100;

const square = (x: number) => x * x;

const f = (E: number) => (x: number, fdf: number[]) => {
  const [f, df] = fdf;
  return [df, (120 * square(x) - E) * f];
};

const xs: number[] = [];
const n = 80;
for (let i = 0; i <= n; ++i) xs.push(i / n);

class EGuesser {
  element = new GraphPath();

  constructor() {
    this.element.setAttribute("stroke", ugent.blauw);
    this.element.setAttribute("fill", "none");
    this.element.setAttribute("stroke-width", (0.03 * scale).toString());
    this.element.setAttribute("stroke-linecap", "round");
  }

  setE(E: number) {
    const solver = new odex.Solver(f(E), 2);
    const r = solver.integrate(0, [0, ratio]);
    const points = xs.map((x) => [x, r(x)[0]]);

    this.element.d =
      "M " +
      points.map(([x, y]) => `${scale * ratio * x},${-scale * y}`).join(" L ");
  }
}

export default new (class extends AnimationSlide {
  guesser = new EGuesser();
  time = 0;
  lastE = 0;

  constructor() {
    super();
    this.guesser.setE(0);
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    const container = new GraphContainer();
    container.setBounds(
      -0.1 * ratio * scale,
      1.2 * ratio * scale,
      -scale,
      scale
    );

    const options = { position: 0, arrowHead: 0.02 * scale, arrowFilled: true };
    const axes = [
      new Axis({
        type: "x",
        min: 0,
        max: 1.1 * ratio * scale,
        ticks: [ratio * scale],
        tickSize: 0.05 * scale,
        ...options,
      }),
      new Axis({
        type: "y",
        reverse: true,
        min: -scale,
        max: scale,
        ...options,
      }),
    ];
    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", (0.015 * scale).toString());
      container.add(axis);
    });

    container.add(this.guesser.element);

    element.querySelector(".shooting-ode")?.appendChild(container.element);
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.time = 0;
  }

  onFrame(dt: number): void {
    this.time += dt;

    const exact = 130.38600971949495;
    const start = 100;
    const E = exact + (start - exact) * Math.exp(-this.time / 5);
    if (Math.abs(E - this.lastE) > 1e-3) {
      this.guesser.setE(E);
      this.lastE = E;
    }

    super.onFrame(dt);
  }
})();

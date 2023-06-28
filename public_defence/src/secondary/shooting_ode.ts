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
  GraphText,
} from "../lib/graph/graph";
import AnimationSlide from "../lib/animation_slide";
import * as odex from "odex";
import katex from "katex";

const ratio = 2;
const scale = 100;

const exact = 130.38600971949495;
const start = 100;

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
    this.element.setAttribute("stroke-width", (0.02 * scale).toString());
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
  adjusting = false;
  textE = new GraphText("", {
    x: 30,
    y: -50,
    width: 100,
    height: 100,
    scale: 0.35,
    halign: "left",
  });

  constructor() {
    super();
    this.guesser.setE(0);
    this.setState();
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    const container = new GraphContainer();
    container.setBounds(
      -0.1 * ratio * scale,
      1.2 * ratio * scale,
      -0.6 * scale,
      0.3 * scale
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
        min: -0.6 * scale,
        max: 0.4 * scale,
        ...options,
      }),
    ];
    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", (0.01 * scale).toString());
      container.add(axis);
    });

    container.add(
      this.guesser.element,
      this.textE,
      new GraphText("x", {
        x: 215,
        y: -14,
        width: 100,
        height: 100,
        scale: 0.3,
        halign: "center",
        math: true,
      }),
      new GraphText("1", {
        x: 200,
        y: 8,
        width: 100,
        height: 100,
        scale: 0.3,
        halign: "center",
        math: true,
      }),
      new GraphText("0", {
        x: -5,
        y: 0,
        width: 100,
        height: 100,
        scale: 0.3,
        halign: "center",
        math: true,
      }),
      new GraphText(
        `f(x)`,
        {
          x: 13,
          y: -62,
          width: 100,
          height: 100,
          scale: 0.3,
          halign: "center",
          math: true,
        }
      )
    );

    element.querySelector(".shooting-ode")?.appendChild(container.element);
  }

  setState(state?: string) {
    this.lastE = 0;
    if (state === "adjust-E") {
      this.adjusting = true;
      this.time = 0;
    } else {
      this.adjusting = false;
    }
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.time = 0;
  }

  getE() {
    if (!this.adjusting) return start;
    return (
      exact +
      (start - exact) * Math.exp(-Math.ceil(Math.pow(this.time, 2.5) / 30) / 4)
    );
  }

  onFrame(dt: number): void {
    this.time += dt;

    const E = this.getE();
    if (Math.abs(E - this.lastE) > 1e-5) {
      this.guesser.setE(E);
      this.lastE = E;
      const sE = E.toFixed(3);
      this.textE.setText(
        katex.renderToString(
          `E \\stackrel{${sE == exact.toFixed(3) ? "!" : "?"}}{=} ${sE}`
        ),
        true
      );
    }

    super.onFrame(dt);
  }
})();

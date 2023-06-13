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

const interval = 25; // period in seconds
const smooth_step_factor = 4;
const n = 50;
const xs: number[] = [];
const h = 1 / (n + 1);
for (let x = h; x < 1 - h / 2; x += h) xs.push(x);

const smoothstep = (x: number) => {
  x = (x + 1) / 2;
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
};

class HeatedRod {
  Ts: number[] = xs.map(() => 0);
  solver: odex.Solver;
  integrator: (t: number) => [number, number] = () => [0, 0];
  time = 0;

  container = new GraphContainer();
  curve = new GraphPath();

  constructor() {
    this.container.setBounds(-20, 220, -110, -10);

    this.curve.setAttribute("stroke", ugent.blauw);
    this.curve.setAttribute("fill", "none");
    this.curve.setAttribute("stroke-width", "3");
    this.curve.setAttribute("stroke-linecap", "round");
    this.curve.setAttribute("stroke-linejoin", "round");

    const options = { position: 0, arrowHead: 4, arrowFilled: true };
    const axes = [
      new Axis({ type: "x", min: 0, max: 210, ...options }),
      new Axis({ type: "y", reverse: true, min: -110, max: 0, ...options }),
    ];

    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", "0.8");
    });

    this.container.add(
      new GraphText("x", {
        x: 200,
        y: -11,
        width: 100,
        height: 100,
        scale: 0.25,
        halign: "center",
        math: true,
      }),
      new GraphText(`T(t, x)`, {
        x: 21,
        y: -105,
        width: 100,
        height: 100,
        scale: 0.25,
        halign: "center",
        math: true,
      })
    );
    this.container.add(...axes, this.curve);

    this.reset();
  }

  reset() {
    this.time = interval / 4;
    this.Ts = xs.map(() => 0);
    this.integrator = new odex.Solver(
      (t: number, Ts: number[]) => {
        const b = this.boundary(t);
        const get = (i: number) => {
          if (0 <= i && i < n) return Ts[i];
          else return b;
        };
        const r = Ts.map(
          (T, i) =>
            0.005 *
            ((-get(i - 2) +
              16 * get(i - 1) -
              30 * T +
              16 * get(i + 1) -
              get(i + 2)) /
              (12 * h * h))
        );
        return r;
      },
      n,
      { absoluteTolerance: 1e-8, maxSteps: 1e7 }
    ).integrate(0, this.Ts) as any as typeof this.integrator;
    this.updateDrawing();
  }

  tick(dt: number) {
    this.time += dt;
    this.Ts = this.integrator(this.time);
    this.updateDrawing();
  }

  boundary(t = this.time) {
    t = t % interval;
    const s = (4 / interval) * smooth_step_factor;
    if (t < interval / 2) return smoothstep(s * (t - interval / 4));
    return 1 - smoothstep(s * (t - (3 * interval) / 4));
  }

  updateDrawing() {
    const boundary = -this.boundary() * 100;

    this.curve.d =
      `M 0 ${boundary}` +
      this.Ts.map((T, i) => `L ${xs[i] * 200} ${-T * 100}`).join(" ") +
      `L 200 ${boundary}`;
  }
}

export default new (class extends AnimationSlide {
  rod: HeatedRod;

  initialize(element: HTMLElement) {
    super.initialize(element);

    this.rod = new HeatedRod();

    element
      .querySelector(".heated-rod")
      ?.appendChild(this.rod.container.element);
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.rod.reset();
  }

  onFrame(dt: number) {
    this.rod.tick(dt);
  }
})();

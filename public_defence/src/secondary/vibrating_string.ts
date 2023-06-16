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
const n = 60;
const xs: number[] = [];
const h = 1 / (n + 1);
for (let x = h; x < 1 - h / 2; x += h) xs.push(x);

const idst = (c: number[]) => {
  return (x: number) => {
    let r = 0;
    for (let k = 1; k <= c.length; k++)
      r += c[k - 1] * Math.sin(k * Math.PI * x);
    return r;
  };
};

class HeatedRod {
  ydy = [...xs, ...xs].map(() => 0);
  solver: odex.Solver;
  integrator: (t: number) => number[] = () => [];
  time = 0;

  container = new GraphContainer();
  curve = new GraphPath();

  constructor() {
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
      new GraphText("x", {
        x: 200,
        y: -11,
        width: 100,
        height: 100,
        scale: 0.25,
        halign: "center",
        math: true,
      }),
      new GraphText(`y(t, x)`, {
        x: 16,
        y: -45,
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
    this.time = 0;
    this.ydy = [
      ...xs.map((x) => idst([0.712, 0.356, -0.237, -0.177])(x)),
      ...xs.map(() => 0),
    ];
    this.integrator = new odex.Solver(
      (t: number, ydy: number[]) => {
        const get = (i: number) => {
          if (0 <= i && i < n) return ydy[i];
          else return 0;
        };
        const r = ydy.map((_, i) => {
          if (i < n) return ydy[i + n];
          i -= n;
          return (
            ((-get(i - 2) +
              16 * get(i - 1) -
              30 * get(i) +
              16 * get(i + 1) -
              get(i + 2)) /
              (12 * h * h))
          );
        });
        return r;
      },
      2 * n,
      { absoluteTolerance: 1e-8, maxSteps: 1e7 }
    ).integrate(0, this.ydy);
    this.updateDrawing();
  }

  tick(dt: number) {
    this.time += dt;
    this.ydy = this.integrator(0.3*this.time);
    this.updateDrawing();
  }

  updateDrawing() {
    // console.log(this.ydy.slice(0, n));
    this.curve.d =
      `M 0 0` +
      xs.map((x, i) => `L ${x * 200} ${-this.ydy[i] * 50}`).join(" ") +
      `L 200 0`;
  }
}

export default new (class extends AnimationSlide {
  rod: HeatedRod;

  initialize(element: HTMLElement) {
    super.initialize(element);

    this.rod = new HeatedRod();

    element
      .querySelector(".vibrating-string")
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

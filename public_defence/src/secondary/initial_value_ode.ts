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
} from "../lib/graph/graph";
import AnimationSlide from "../lib/animation_slide";

const square = (x:number) => x * x;

const f = (x: number, fdf: number[]) => {
  const [f, df] = fdf;
  return [df, (120*square(x) - 100) * f];
};

function ode_step(
  h: number,
  f: (t: number, y: number[]) => number[],
  t0: number,
  y0: number[]
) {
  // Runge-Kutta second order
  const k1 = f(t0, y0);
  const k2 = f(
    t0 + h,
    y0.map((y, i) => y + h * k1[i])
  );
  return y0.map((y, i) => y + (h / 2) * (k1[i] + k2[i]));
}

function construct_plot() {
  const container = new GraphContainer();
  const ratio = 3;
  const [xmin, xmax] = [0, ratio];
  const [ymin, ymax] = [-1, 1];
  const b = 0.1;

  container.setBounds(xmin - b, xmax + b, ymin - b, ymax + b);

  const options = { position: 0, arrowHead: 0.05, arrowFilled: true };
  const axes = [
    new Axis({ type: "x", min: xmin, max: xmax, ...options }),
    new Axis({ type: "y", reverse: true, min: ymin, max: ymax, ...options }),
  ];
  axes.forEach((axis) => {
    axis.setAttribute("stroke", ugent.zwart);
    axis.setAttribute("fill", ugent.zwart);
    axis.setAttribute("stroke-width", "0.01");
    container.add(axis);
  });
  const tick = new GraphLine();
  tick.setLocation([ratio, -0.1], [ratio, 0.1]);
  tick.setAttribute("stroke", ugent.zwart);
  tick.setAttribute("fill", ugent.zwart);
  tick.setAttribute("stroke-width", "0.01");
  container.add(tick);

  const add_point = (x: number, fdf: number[]) => {
    const [y, dy] = fdf;
    const c = new GraphCircle();
    c.setLocation([ratio * x, -y], 0.04);
    c.setAttribute("fill", ugent.rood);
    container.add(c);
    const l = new GraphLine();

    const scale = 0.1 / Math.hypot(ratio, dy);
    const tx = ratio * scale;
    const ty = -dy * scale;
    l.setLocation([ratio * x - tx, -y - ty], [ratio * x + tx, -y + ty]);
    l.setAttribute("stroke", ugent.rood);
    l.setAttribute("stroke-width", "0.02");
    container.add(l);
  };

  let f0 = [0, 3];
  const h = 0.08;
  let x = 0;
  while (x - h / 2 <= 1) {
    add_point(x, f0);
    f0 = ode_step(h, f, x, f0);
    x += h;
  }

  return container;
}

export default new (class extends AnimationSlide {
  constructor() {
    super();
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    element
      .querySelector(".initial-value-example")
      ?.appendChild(construct_plot().element);
  }
})();

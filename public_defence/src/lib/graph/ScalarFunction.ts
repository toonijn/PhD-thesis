import { GraphPath } from "./Path";

interface ScalarFunctionOptions {
  min: number;
  max: number;
  steps: number;
  f: (x: number) => number;
}

export class GraphScalarFunction extends GraphPath {
  options: ScalarFunctionOptions = {
    min: -1,
    max: 1,
    steps: 100,
    f: (x) => x,
  };
  points: [number, number][] = [];

  constructor(options: Partial<ScalarFunctionOptions>) {
    super();
    this.options = { ...this.options, ...options };
    this.element.setAttribute("fill", "none");
    this.setAttribute("stroke-linecap", "round");
    this.setAttribute("stroke-linejoin", "round");
    this.update();
  }

  update() {
    const { min, max, f, steps } = this.options;
    this.points = [];
    const dx = (max - min) / steps;
    this.points.push([min, f(min)]);
    for (let i = 1; i < steps; i++) {
      const x = min + (i + 0.5 * (Math.random() - 0.5)) * dx;
      this.points.push([x, f(x)]);
    }
    this.points.push([max, f(max)]);

    const path: string[] = [];
    this.points.forEach(([x, y], i) => {
      path.push(`${i === 0 ? "M" : "L"} ${x},${y}`);
    });

    this.d = path.join(" ");
  }
}

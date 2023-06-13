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

interface PendulumOptions {
  initial_angle: number;
  initial_velocity: number;
  time_scale: number;
}

class Pendulum {
  options: PendulumOptions = {
    initial_angle: 0,
    initial_velocity: 0,
    time_scale: 1,
  };
  theta: [number, number] = [0, 0];
  solver: odex.Solver;
  integrator: (t: number) => [number, number] = () => [0, 0];
  time = 0;

  container = new GraphContainer();
  transform = new GraphGroup();

  constructor(options: Partial<PendulumOptions> = {}) {
    this.options = { ...this.options, ...options };

    this.solver = new odex.Solver((t: number, [x, v]) => [v, -Math.sin(x)], 2);

    this.container.setBounds(-60, 60, -60, 60);

    const rod = new GraphPath();
    rod.d = "M 0 0 L 0 32";
    rod.setAttribute("stroke", ugent.zwart);

    const disc = new GraphPath();
    // This path is a circle around 0 40 with radius 8
    disc.d = "M 0 32 A 8 8 0 1 1 0 48 A 8 8 0 1 1 0 32";
    disc.setAttribute("stroke", ugent.blauw);
    disc.setAttribute("fill", ugent.wit);

    const triangle = new GraphPath();
    {
      const h = 55;
      const b = 30;
      const r = 10;
      const r1 = 3;
      const hypot = Math.hypot(h, b);
      const alpha = Math.atan(b / h) + Math.acos(r / hypot);
      const tx = r * Math.sin(alpha);
      const ty = r * Math.cos(alpha);
      triangle.d = [
        `M 0 ${h}`,
        `L ${b} ${h}`,
        `L ${tx} ${ty}`,
        `A ${r} ${r} 0 0 0 ${-tx} ${ty}`,
        `L ${-b} ${h}`,
        `Z`,
        `M ${0} ${r1}`,
        `A ${r1} ${r1} 1 0 1 ${0} ${-r1}`,
        `A ${r1} ${r1} 1 0 1 ${0} ${r1}`,
      ].join(" ");
    }
    triangle.setAttribute("opacity", "0.4");
    triangle.setAttribute("stroke", ugent.geel);
    triangle.setAttribute("fill", "none");

    [rod, disc, triangle].forEach((element) => {
      element.setAttribute("stroke-width", "3");
      element.setAttribute("stroke-linecap", "round");
      element.setAttribute("stroke-linejoin", "round");
    });

    this.transform.add(rod, disc);

    this.container.add(triangle, this.transform);

    this.reset();
  }

  reset() {
    this.time = 0;
    this.theta = [this.options.initial_angle, this.options.initial_velocity];
    this.integrator = this.solver.integrate(
      0,
      this.theta
    ) as any as typeof this.integrator;
    this.updateDrawing();
  }

  tick(dt: number) {
    this.time += dt * this.options.time_scale;
    this.theta = this.integrator(this.time);
    this.updateDrawing();
  }

  updateDrawing() {
    const a = this.theta[0];
    this.transform.transform = "rotate(" + (a * 180) / Math.PI + ")";
  }
}

export default new (class extends AnimationSlide {
  left: Pendulum;
  right: Pendulum;

  initialize(element: HTMLElement) {
    super.initialize(element);

    const time_scale = 1;
    this.left = new Pendulum({
      initial_angle: Math.PI / 2 - 0.2,
      initial_velocity: 0,
      time_scale,
    });
    this.right = new Pendulum({
      initial_angle: Math.PI + 0.2,
      initial_velocity: 0,
      time_scale,
    });

    element.querySelector(".left")?.appendChild(this.left.container.element);
    element.querySelector(".right")?.appendChild(this.right.container.element);
  }

  activate(element: HTMLElement): void {
    super.activate(element);
    this.left.reset();
    this.right.reset();
  }

  onFrame(dt: number) {
    this.left.tick(dt);
    this.right.tick(dt);
  }
})();

import { GraphPath } from "./Path";

interface AxisOptions {
  type: "x" | "y";
  reverse: boolean;
  position: number;
  min: number;
  max: number;
  arrowHead: number;
  arrowAngle: number;
  arrowFilled: boolean;
}

export class Axis extends GraphPath {
  options: AxisOptions = {
    type: "x",
    reverse: false,
    position: 0,
    min: -1,
    max: 1,
    arrowHead: 0.1,
    arrowAngle: 30,
    arrowFilled: true,
  };

  constructor(options: Partial<AxisOptions>) {
    super();
    this.options = { ...this.options, ...options };
    this.update();
    this.setAttribute("stroke", "black");
    this.setAttribute(
      "stroke-width",
      "" + 0.01 * (this.options.max - this.options.min)
    );
    this.setAttribute("stroke-linecap", "round");
    this.setAttribute("stroke-linejoin", "round");
  }

  update() {
    const steps: string[] = [];
    const coord = (x: number, y: number): string => {
      if (this.options.reverse) x = this.options.max - (x - this.options.min);
      return this.options.type === "x" ? `${x},${y}` : `${y},${x}`;
    };
    steps.push("M" + coord(this.options.min, this.options.position));
    const [hx, hy] = [this.options.max, this.options.position];
    steps.push("L" + coord(hx, hy));
    const dx = this.options.arrowHead;
    if (dx > 0) {
      const dy = dx * Math.tan((this.options.arrowAngle * Math.PI) / 180);
      steps.push("L" + coord(hx - dx, hy - dy));
      if (this.options.arrowFilled) {
        steps.push("L" + coord(hx - dx, hy + dy));
        steps.push("L" + coord(hx, hy));
        steps.push("Z");
      } else {
        steps.push("M" + coord(hx, hy));
        steps.push("L" + coord(hx - dx, hy + dy));
      }
    }

    this.d = steps.join(" ");
  }
}

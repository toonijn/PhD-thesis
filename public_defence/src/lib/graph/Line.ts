import { GraphPath } from "./Path";

export class GraphLine extends GraphPath {
  constructor() {
    super();
    this.setLocation([0, 0], [1, 1]);
  }

  setLocation([x1, y1]: [number, number], [x2, y2]: [number, number]) {
    this.d = `M ${x1} ${y1} L ${x2} ${y2}`;
  }
}

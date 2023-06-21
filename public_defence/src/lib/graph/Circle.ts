import { GraphPath } from "./Path";

export class GraphCircle extends GraphPath {
  constructor() {
    super();
    this.setLocation([0, 0], 1);
  }

  setLocation([x, y]: [number, number], radius: number) {
    this.d = `M ${x} ${y} m ${-radius}, 0 a ${radius},${radius} 0 1,0 ${
      2 * radius
    },0 a ${radius},${radius} 0 1,0 ${-2 * radius},0`;
  }
}

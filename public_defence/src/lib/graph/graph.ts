import { GraphElement } from "./Element";
import { GraphGroup } from "./Group";

export * from "./Element";
export * from "./Group";
export * from "./Path";
export * from "./Axis";
export * from "./ScalarFunction";
export * from "./Text";
export * from "./Line";
export * from "./Circle";

export class GraphContainer {
  element: SVGElement;
  content: GraphGroup = new GraphGroup();

  constructor() {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.element.appendChild(this.content.element);
    this.element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.element.setAttribute("width", "100%");
    this.element.setAttribute("height", "100%");
  }

  setBounds(xmin: number, xmax: number, ymin: number, ymax: number) {
    this.element.setAttribute(
      "viewBox",
      `${xmin} ${ymin} ${xmax - xmin} ${ymax - ymin}`
    );
  }

  add(...elements: GraphElement[]) {
    this.content.add(...elements);
  }

  getAttribute(name: string) {
    return this.element.getAttribute(name);
  }

  setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);
  }
}

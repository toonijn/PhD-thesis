import { GraphElement } from "./Element";

export class GraphGroup extends GraphElement {
  children: GraphElement[] = [];

  constructor() {
    super();
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "g");
  }

  add(...children: GraphElement[]) {
    for (let child of children) {
      this.children.push(child);
      this.element.appendChild(child.element);
    }
  }

  get transform(): string {
    return this.element.getAttribute("transform") || "";
  }

  set transform(value: string) {
    this.element.setAttribute("transform", value);
  }
}

import { GraphElement } from "./Element";

export class GraphPath extends GraphElement {
  constructor() {
    super();
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
  }

  get d(): string {
    return this.element.getAttribute("d") || "";
  }

  set d(value: string) {
    this.element.setAttribute("d", value);
  }
}

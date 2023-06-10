export class GraphElement {
  element: SVGElement;

  getAttribute(name: string) {
    return this.element.getAttribute(name);
  }

  setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);
  }
}

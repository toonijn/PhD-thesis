import katex from "katex";
import { GraphElement } from "./Element";

export interface GraphTextOptions {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
  halign: "left" | "center" | "right";
  valign: "top" | "middle" | "bottom";
  math: boolean | any;
}

export class GraphText extends GraphElement {
  content: HTMLElement;
  options: GraphTextOptions = {
    x: 0,
    y: 0,
    scale: 1,
    width: 1,
    height: 1,
    halign: "left",
    valign: "top",
    math: false,
  };

  constructor(
    text: string | HTMLElement,
    options: Partial<GraphTextOptions> = {}
  ) {
    super();
    this.options = { ...this.options, ...options };
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    this.content = document.createElement("div");
    this.content.classList.add("graph-text");
    this.content.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    this.element.appendChild(this.content);

    this.update();
    this.text = text;
  }

  update() {
    let x = this.options.x;
    let y = this.options.y;
    if (this.options.halign === "center") {
      x -= this.options.width / 2;
    } else if (this.options.halign === "right") {
      x -= this.options.width;
    }
    if (this.options.valign === "middle") {
      y -= this.options.height / 2;
    } else if (this.options.valign === "bottom") {
      y -= this.options.height;
    }

    this.element.setAttribute("x", x.toString());
    this.element.setAttribute("y", y.toString());
    this.element.setAttribute("width", this.options.width.toString());
    this.element.setAttribute("height", this.options.height.toString());

    this.content.style.width = `${100 / this.options.scale}%`;
    this.content.style.height = `${100 / this.options.scale}%`;
    this.content.style.transform = `scale(${this.options.scale})`;
    this.content.style.transformOrigin = "0 0";
  }

  set text(text: string | HTMLElement) {
    if (this.options.math !== false) {
      this.content.innerHTML = katex.renderToString(
        text,
        this.options.math === true
          ? {
              throwOnError: false,
              displayMode: true,
            }
          : this.options.math
      );
    } else if (typeof text === "string") {
      this.content.textContent = text;
    } else {
      this.content.innerHTML = "";
      this.content.appendChild(text);
    }
  }
}

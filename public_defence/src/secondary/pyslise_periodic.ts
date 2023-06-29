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
import eigendata from "../assets/computed/periodic.json";
import { lighten } from "../lib/color";

const scale = 100;
const xmin = 0;
const xmax = Math.PI;
const ymax = 1.5:
const ymin = -1.5;
const yscale = 1.5;

class PeriodicSolutions {
  container = new GraphContainer();

  constructor() {
    const dx = xmax - xmin;
    const dy = ymax - ymin;
    this.container.setBounds(
      scale * (xmin - 0.5 * dx),
      scale * (xmax + 0.5 * dx),
      scale * (ymin - 0.1 * dy),
      scale * (ymax + 0.1 * dy)
    );

    const options = { position: 0, arrowHead: 4, arrowFilled: true };
    const axes = [
      new Axis({
        type: "x",
        min: scale * (xmin - 0.4 * dx),
        max: scale * (xmax + 0.4 * dx),
        ticks: [scale * Math.PI],
        tickSize: 10,
        ...options,
      }),
      new Axis({
        type: "y",
        reverse: true,
        min: scale * ymin,
        max: scale * ymax,
        ...options,
      }),
    ];

    axes.forEach((axis) => {
      axis.setAttribute("stroke", ugent.zwart);
      axis.setAttribute("fill", ugent.zwart);
      axis.setAttribute("stroke-width", "1.5");
    });

    this.container.add(...axes);

    const colors = [ugent.blauw, ugent.warmoranje, ugent.groen].reverse();

    eigendata.eigs.slice(0, 3).reverse().forEach(({ E, fs }, j) => {
      if (fs.length != 1) console.log("Ignoring an eigenvalue");

      const g = new GraphGroup();


      [-Math.PI, 0, Math.PI].forEach((offset) => {
        const path = new GraphPath();
        console.log(
          fs[0].filter((y, i) => {
            const x = offset + eigendata.x[i];
            return xmin - 0.4 * dx <= x && x <= xmax + 0.4 * dx;
          })
        );
        path.d =
          "M " +
          fs[0]
            .map(
              (y, i) =>
                `${scale * (offset + eigendata.x[i])} ${yscale * scale * y}`
            )
            .filter((y, i) => {
              const x = offset + eigendata.x[i];
              return xmin - 0.4 * dx <= x && x <= xmax + 0.4 * dx;
            })
            .join(" L ");
        path.setAttribute(
          "stroke",
          offset == 0 ? colors[j] : lighten(colors[j], 0.5)
        );
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("opacity", "round");
        path.setAttribute("fill", "none");

        g.add(path);
      });
      this.container.add(g);
    });
  }
}

export default new (class extends AnimationSlide {
  rod: PeriodicSolutions;

  initialize(element: HTMLElement) {
    super.initialize(element);

    this.rod = new PeriodicSolutions();

    element
      .querySelector(".pyslise-periodic")
      ?.appendChild(this.rod.container.element);
  }

  activate(element: HTMLElement): void {
    super.activate(element);
  }

  onFrame(dt: number) {}
})();

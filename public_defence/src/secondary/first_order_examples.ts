import ugent from "../lib/theme";
import AnimationSlide from "../lib/animation_slide";
import {
  Axis,
  GraphContainer,
  GraphScalarFunction,
  GraphText,
} from "../lib/graph/graph";

interface PlotResult {
  container: GraphContainer;
  curve: GraphScalarFunction;
}

interface PlotSettings {
  f: (x: number) => number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

function constructPlot(name: string, settings: PlotSettings): PlotResult {
  const container = new GraphContainer();
  const h =
    0.2 *
    Math.min(settings.ymax - settings.ymin, settings.xmax - settings.xmin);
  container.setBounds(
    settings.xmin - h,
    settings.xmax + h,
    settings.ymin - h,
    settings.ymax + h
  );

  const options = { position: 0, arrowHead: 4, arrowFilled: true };
  const axes = [
    new Axis({ type: "x", min: settings.xmin, max: settings.xmax, ...options }),
    new Axis({
      type: "y",
      reverse: true,
      min: settings.ymin,
      max: settings.ymax,
      ...options,
    }),
  ];
  axes.forEach((axis) => {
    axis.setAttribute("stroke", ugent.zwart);
    axis.setAttribute("fill", ugent.zwart);
    axis.setAttribute("stroke-width", "0.8");
    container.add(axis);
  });
  const curve = new GraphScalarFunction({
    f: settings.f,
    min: settings.xmin,
    max: settings.xmax,
  });
  curve.setAttribute("stroke", ugent.blauw);
  curve.setAttribute("stroke-width", "3");

  container.add(curve);

  container.add(
    new GraphText("x", {
      x: settings.xmax - 9,
      y: -11,
      width: 100,
      height: 100,
      scale: 0.25,
      halign: "center",
      math: true,
    })
  );

  container.add(
    new GraphText(`${name}(x)`, {
      x: 11,
      y: settings.ymin + 7,
      width: 100,
      height: 100,
      scale: 0.25,
      halign: "center",
      math: true,
    })
  );

  return {
    container,
    curve,
  };
}

export default new (class extends AnimationSlide {
  left: PlotResult;
  right: PlotResult;

  initialize(element: HTMLElement) {
    super.initialize(element);

    this.left = constructPlot("f", {
      f: (x) => -Math.exp(x / 50 - 2) * 100,
      xmin: 0,
      xmax: 100,
      ymin: -100,
      ymax: 0,
    });
    this.right = constructPlot("g", {
      f: (x) => Math.sin(x * 0.075 + 0.3) * 30,
      xmin: 0,
      xmax: 100,
      ymin: -60,
      ymax: 40,
    });

    element.querySelector(".left")?.appendChild(this.left.container.element);
    element.querySelector(".right")?.appendChild(this.right.container.element);
  }
})();

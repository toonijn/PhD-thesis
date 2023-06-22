import ugent from "../lib/theme";
import { GraphContainer, Axis, GraphPath, GraphText } from "../lib/graph/graph";
import AnimationSlide from "../lib/animation_slide";
import ae1 from "../assets/computed/ae1.json";

const yheight = 0.4;
const scale_f = 0.2;
const scale = 40;

function eigenfunction(i: number, E: number, x: number[], f: number[]) {
  const container = new GraphContainer();
  container.setBounds(
    -0.1 * scale,
    1.2 * scale,
    -1.5 * yheight * scale,
    1.1 * yheight * scale
  );

  const options = { position: 0, arrowHead: 0.02 * scale, arrowFilled: true };
  const axes = [
    new Axis({
      type: "x",
      min: 0,
      max: 1.1 * scale,
      ticks: [scale],
      tickSize: 0.05 * scale,
      ...options,
    }),
    new Axis({
      type: "y",
      reverse: true,
      min: -scale * yheight,
      max: scale * yheight,
      ...options,
    }),
  ];
  axes.forEach((axis) => {
    axis.setAttribute("stroke", ugent.zwart);
    axis.setAttribute("fill", ugent.zwart);
    axis.setAttribute("stroke-width", (0.006 * scale).toString());
    container.add(axis);
  });

  const path = new GraphPath();
  path.d =
    "M " +
    x.map((x, i) => `${scale * x} ${-scale_f * scale * f[i]}`).join(" L ");
  path.setAttribute("stroke", ugent.blauw);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", (0.015 * scale).toString());
  container.add(path);

  const text = new GraphText(`E_{${i}} \\approx ${E.toFixed(4)}`, {
    x: 0.5 * scale,
    y: -1.2 * scale * yheight,
    scale: 0.13,
    width: scale,
    height: yheight * scale,
    halign: "center",
    math: true,
  });
  container.add(text);

  return container.element;
}

export default new (class extends AnimationSlide {
  constructor() {
    super();
  }
  initialize(element: HTMLElement) {
    super.initialize(element);

    ae1.data.forEach(({ E, f }, i) => {
      document
        .getElementById(`ae1-${i}`)
        ?.appendChild(eigenfunction(i, E, ae1.x, f));
    });
  }
})();

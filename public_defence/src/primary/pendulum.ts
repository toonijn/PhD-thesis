import ugent from "../lib/theme";
import { Axis, GraphContainer, GraphPath, GraphText } from "../lib/graph/graph";
import * as odex from "odex";

const container = new GraphContainer();

const f = new odex.Solver(
  (t: number, [x, v]) => [v, -Math.sin(x)],
  2
).integrate(0, [Math.PI - 0.04, 0]);

container.setBounds(0, 200, -30, 30);

const steps: [number, number][] = [];
for (let x = 0; x < 1; x += 0.005) {
  steps.push([x, f(100 * x)[0]]);
}
const path = new GraphPath();
path.d = steps
  .map(([x, y], i) => `${i == 0 ? "M" : "L"} ${25 + 150 * x} ${5 * y}`)
  .join(" ");
path.setAttribute("stroke", ugent.blauw);
path.setAttribute("fill", "none");
path.setAttribute("stroke-linecap", "round");
path.setAttribute("stroke-linejoin", "round");

const options = { arrowHead: 4, arrowFilled: true };
const axes = [
  new Axis({ type: "x", min: 20, max: 180, position: 0, ...options }),
  new Axis({
    type: "y",
    reverse: true,
    position: 25,
    min: -25,
    max: 25,
    ...options,
  }),
];
axes.forEach((axis) => {
  axis.setAttribute("stroke", ugent.zwart);
  axis.setAttribute("fill", ugent.zwart);
  axis.setAttribute("stroke-width", "0.8");
  container.add(axis);
});

container.add(
  new GraphText(`\\theta(t)`, {
    x: 15,
    y: -25,
    width: 100,
    height: 100,
    scale: 0.22,
    halign: "center",
    math: true,
  })
);

container.add(
  new GraphText(`t`, {
    x: 172,
    y: -2,
    width: 100,
    height: 100,
    scale: 0.22,
    halign: "center",
    math: true,
  })
);
container.add(...axes, path);

document.getElementById("pendulum-graph")?.appendChild(container.element);

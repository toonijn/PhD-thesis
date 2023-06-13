import Reveal from "reveal.js";
import { RenderMathPlugin } from "./lib/render_math_plugin";
import {} from "./primary/pendulum.ts";

let deck = new Reveal({
  hash: true,
  slideNumber: true,
  history: true,
  progress: false,
  controlsTutorial: false,
  plugins: [RenderMathPlugin],
  center: false,
  width: 1024,
  height: 576,
  margin: 0,
  maxScale: 3,
  showNotes: true,
});
deck.initialize();

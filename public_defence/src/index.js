import Reveal from "reveal.js";
import RevealMath from "reveal.js/plugin/math/math.js";

let deck = new Reveal({
  hash: true,
  slideNumber: true,
  history: true,
  progress: false,
  controlsTutorial: false,
  plugins: [RevealMath.KaTeX],
  center: false,
  width: 1024,
  height: 576,
  margin: 0,
  maxScale: 3,
  showNotes: true,
});
deck.initialize();

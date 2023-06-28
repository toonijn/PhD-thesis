import Reveal from "reveal.js";
import { RenderMathPlugin } from "./lib/render_math_plugin";
import {} from "./primary/pendulum.ts";
import SyncSlides from "./lib/sync_slides";

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
  controls: false,
  transition: "fade",
  transitionSpeed: "slow",
});
deck.initialize();

function change_slide(element) {
  const animation = element.getAttribute("data-animation");
  const state = element.getAttribute("data-animation-state");
  if (animation)
    sync_slides.changed({
      animation: animation,
      state: state,
    });
}

const sync_slides = new SyncSlides();
deck.on("slidechanged", (event) => {
  change_slide(event.currentSlide);
});
deck.on("fragmentshown", (event) => {
  change_slide(event.fragment);
});

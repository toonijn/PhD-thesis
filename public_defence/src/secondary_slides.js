import Reveal from "reveal.js";
import RevealMath from "reveal.js/plugin/math/math.js";

const cache = (f) => {
  function r() {
    if (r.cached_value === undefined) r.cached_value = f();
    return r.cached_value;
  }
  return r;
};

const animations = {
  "title-slide": cache(() =>
    import("./secondary/title.js").then((s) => s.default)
  ),
  "function-example": cache(() =>
    import("./secondary/function_example.ts").then((s) => s.default)
  ),
  "first-order-examples": cache(() =>
    import("./secondary/first_order_examples.ts").then((s) => s.default)
  ),
  "example-pendulum": cache(() =>
    import("./secondary/example_pendulum.ts").then((s) => s.default)
  ),
  "example-heatequation": cache(() =>
    import("./secondary/example_heatequation.ts").then((s) => s.default)
  ),
  "vibrating-string": cache(() =>
    import("./secondary/vibrating_string.ts").then((s) => s.default)
  ),
  "vibrating-string-states": cache(() =>
    import("./secondary/vibrating_string_states.ts").then((s) => s.default)
  ),
};

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

(() => {
  let lastFrame = 0;
  function onFrame() {
    const now = +new Date() / 1000;
    const delta = Math.min(now - lastFrame, 0.1);
    lastFrame = now;
    for (const slide of Object.values(activeSlides)) {
      slide.onFrame(delta);
    }
    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);
})();

const deactivateSlide = (slide_id) => {
  if (!activeSlides[slide_id]) return;
  console.log(`Deactivated: ${slide_id}`);
  activeSlides[slide_id].deactivate();
  delete activeSlides[slide_id];
};

const deactivateAllExcept = (...slide_ids) => {
  for (const id of Object.keys(activeSlides))
    if (!slide_ids.includes(id)) deactivateSlide(id);
};

const activeSlides = {};
function process_slide(event) {
  const slide_id = event.currentSlide.id;
  deactivateAllExcept(slide_id, event.previousSlide?.id);
  const imported = animations[slide_id];
  if (imported)
    imported().then((slide) => {
      if (slide.active) return;
      console.log(`Activated: ${slide_id}`);
      slide.activate(event.currentSlide);
      activeSlides[slide_id] = slide;
    });
}

deck.on("slidechanged", process_slide);
deck.on("ready", process_slide);
deck.on("slidetransitionend", (event) => {
  deactivateAllExcept(event.currentSlide.id);
});

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

const cache = (f) => {
  function r() {
    if (r.cached_value === undefined) r.cached_value = f();
    return r.cached_value;
  }
  return r;
};

animations = {
  "title-slide": cache(() =>
    import("./secondary/title.js").then((s) => s.default)
  ),
};

function onFrame() {
  for (const slide of Object.values(activeSlides)) {
    slide.onFrame();
  }
  requestAnimationFrame(onFrame);
}
requestAnimationFrame(onFrame);

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

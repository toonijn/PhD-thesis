// Inspired by https://github.com/hakimel/reveal.js/blob/master/plugin/math/katex.js

import { katex } from "katex";
import renderMathInElement from "katex/contrib/auto-render/auto-render";

let katexOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true }, // Note: $$ has to come before $
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  ignoredTags: ["script", "noscript", "style", "textarea", "pre"],
};

export const RenderMathPlugin = () => {
  let deck;

  return {
    id: "render_math",
    init: (reveal) => {
      deck = reveal;

      const renderMath = () => {
        renderMathInElement(reveal.getSlidesElement(), katexOptions);
        deck.layout();
      };

      if (deck.isReady()) {
        renderMath();
      } else {
        deck.on("ready", renderMath);
      }
    },
  };
};

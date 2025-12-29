// utils/sanitizeHtml.js
import DOMPurify from "dompurify";

export const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "target",
      "rel",
    ],
  });

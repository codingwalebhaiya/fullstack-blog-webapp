import sanitizeHtml from "sanitize-html";

 const santizePostContent = (dirtyHtml) => {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      // Text
      "p", "span", "br", "strong", "em", "u", "s",

      // Headings
      "h1", "h2", "h3",

      // Lists
      "ul", "ol", "li",

      // Blocks
      "blockquote", "pre", "code", "hr",

      // Media
      "img", "figure", "figcaption",

      // Links
      "a",

      // YouTube embed
      "iframe",
      "div",
    ],

    allowedAttributes: {
      "*": ["class", "style"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
      iframe: [
        "src",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "frameborder",
      ],
      div: ["data-youtube"],
    },

    allowedSchemes: ["http", "https", "data"],

    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "player.vimeo.com",
    ],

    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
};

export default santizePostContent;

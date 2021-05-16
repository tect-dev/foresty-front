import sanitize from "sanitize-html";

export function returnPreviousNodeList(someLinkList, someNodeList, someNode) {
  let previousNodeList = [];
  someLinkList.map((linkElement) => {
    if (someNode.id === linkElement.endNodeID) {
      const previousNode = someNodeList.find((node) => {
        return node.id === linkElement.startNodeID;
      });
      previousNodeList.push(previousNode);
    }
  });
  return previousNodeList;
}

export function returnNextNodeList(someLinkList, someNodeList, someNode) {
  let nextNodeList = [];
  someLinkList.map((linkElement) => {
    if (someNode.id === linkElement.startNodeID) {
      const nextNode = someNodeList.find((node) => {
        return node.id === linkElement.endNodeID;
      });
      nextNodeList.push(nextNode);
    }
  });
  return nextNodeList;
}

export function changeZIndex(e, node) {
  if (e.target) {
    const modalList = document.getElementsByClassName("nodeModal");
    const zIndexList = Array.from(modalList).map((ele) => {
      return ele.style.zIndex;
    });
    const max = Math.max(...zIndexList);
    const modalDOM = document.getElementById(`modal${node.id}`);
    if (modalDOM) {
      modalDOM.style.zIndex = max + 1;
    }
  }
}

const tags = [
  "math",
  "annotation",
  "semantics",
  "mtext",
  "mn",
  "mo",
  "mi",
  "mspace",
  "mover",
  "munder",
  "munderover",
  "msup",
  "msub",
  "msubsup",
  "mfrac",
  "mroot",
  "msqrt",
  "mtable",
  "mtr",
  "mtd",
  "mlabeledtr",
  "mrow",
  "menclose",
  "mstyle",
  "mpadded",
  "mphantom",
  "mglyph",
  "svg",
  "path",
  "line",
];

const attributes = tags.reduce((acc, current) => {
  acc[current] = ["*"];
  return acc;
}, {});

const styles = [
  "background-color",
  "border-bottom-width",
  "border-color",
  "border-right-style",
  "border-right-width",
  "border-top-width",
  "border-style",
  "border-width",
  "bottom",
  "color",
  "height",
  "left",
  "margin",
  "margin-left",
  "margin-right",
  "margin-top",
  "min-width",
  "padding-left",
  "position",
  "top",
  "width",
  "vertical-align",
].reduce((acc, current) => {
  acc[current] = [/.*/];
  return acc;
}, {});

export const katexWhiteList = {
  tags,
  attributes,
  styles,
};

export const htmlFilter = (html) => {
  return sanitize(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "code",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
      "iframe",
      "span",
      "img",
      "del",
      "input",
      ...katexWhiteList.tags,
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
      iframe: ["src", "allow", "allowfullscreen", "scrolling", "class"],
      "*": ["class", "id", "aria-hidden"],
      span: ["style"],
      input: ["type"],
      ol: ["start"],
      ...katexWhiteList.attributes,
    },
    allowedStyles: {
      "*": {
        // Match HEX and RGB
        color: [
          /^#(0x)?[0-9a-f]+$/i,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        ],
        "text-align": [/^left$/, /^right$/, /^center$/],
      },
      span: {
        ...katexWhiteList.styles,
      },
    },
    //allowedIframeHostnames: ['www.youtube.com', 'codesandbox.io', 'codepen.io'],
  });
};

function cssEscape(value) {
  if (arguments.length === 0) {
    throw new TypeError("`CSS.escape` requires an argument.");
  }
  const string = String(value);
  const { length } = string;
  let index = -1;
  let codeUnit;
  let result = "";
  const firstCodeUnit = string.charCodeAt(0);
  // eslint-disable-next-line no-plusplus
  while (++index < length) {
    codeUnit = string.charCodeAt(index);
    // Note: there’s no need to special-case astral symbols, surrogate
    // pairs, or lone surrogates.

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (codeUnit === 0x0000) {
      result += "\uFFFD";
      // eslint-disable-next-line no-continue
      continue;
    }

    if (
      // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
      // U+007F, […]
      // eslint-disable-next-line eqeqeq
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit == 0x007f ||
      // If the character is the first character and is in the range [0-9]
      // (U+0030 to U+0039), […]
      (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      // If the character is the second character and is in the range [0-9]
      // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
      (index === 1 &&
        codeUnit >= 0x0030 &&
        codeUnit <= 0x0039 &&
        // eslint-disable-next-line eqeqeq
        firstCodeUnit == 0x002d)
    ) {
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      result += `\\${codeUnit.toString(16)} `;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (
      // If the character is the first character and is a `-` (U+002D), and
      // there is no second character, […]
      index === 0 &&
      length === 1 &&
      // eslint-disable-next-line eqeqeq
      codeUnit == 0x002d
    ) {
      result += `\\${string.charAt(index)}`;
      // eslint-disable-next-line no-continue
      continue;
    }

    // If the character is not handled by one of the above rules and is
    // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
    // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
    // U+005A), or [a-z] (U+0061 to U+007A), […]
    if (
      codeUnit >= 0x0080 ||
      // eslint-disable-next-line eqeqeq
      codeUnit == 0x002d ||
      // eslint-disable-next-line eqeqeq
      codeUnit == 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      // the character itself
      result += string.charAt(index);
      // eslint-disable-next-line no-continue
      continue;
    }

    // Otherwise, the escaped character.
    // https://drafts.csswg.org/cssom/#escape-a-character
    result += `\\${string.charAt(index)}`;
  }
  return result;
}
const makeDefaultCssFilter = (
  element,
  classList,
  excludeTagName,
  excludeId
) => {
  let cssSelector = excludeTagName ? "" : element.tagName.toLowerCase();
  if (element.id && !excludeId) {
    cssSelector += `#${cssEscape(element.id)}`;
  }
  cssSelector += constructClassCssSelectorByAND(classList || element.classList);
  return cssSelector;
};
const constructClassCssSelectorByAND = (classList) => {
  const selectors = [];
  if (classList) {
    for (let i = 0; i < classList.length; i += 1) {
      selectors.push(`.${cssEscape(classList[i])}`);
    }
  }
  return selectors.join("");
};
const makeCssNthChildFilter = (element, options) => {
  // eslint-disable-next-line no-param-reassign
  options = options || {};

  const { classList, excludeTagName, excludeId } = options;

  const excludeTagNameOverride = "excludeTagName" in options;
  const excludeIdOverride = "excludeId" in options;

  const path = [];
  let el = element;
  while (el.parentNode) {
    const nodeName = el && el.nodeName ? el.nodeName.toUpperCase() : "";
    if (nodeName === "BODY") {
      break;
    }
    if (el.id) {
      /**
       * Be default we don't include tag name and classes
       * to selector for element with id attribute
       */
      let cssSelector = "";
      if (el === element) {
        cssSelector = makeDefaultCssFilter(
          el,
          classList || [],
          excludeTagNameOverride ? excludeTagName : true,
          excludeIdOverride ? excludeId : false
        );
      } else {
        cssSelector = makeDefaultCssFilter(el, [], true, false);
      }
      path.unshift(cssSelector);
      break;
    } else {
      let c = 1;
      for (let e = el; e.previousSibling; e = e.previousSibling) {
        if (e.previousSibling.nodeType === 1) {
          c += 1;
        }
      }

      let cldCount = 0;
      for (
        let i = 0;
        el.parentNode && i < el.parentNode.childNodes.length;
        i += 1
      ) {
        cldCount += el.parentNode.childNodes[i].nodeType === 1 ? 1 : 0;
      }

      let ch;
      if (cldCount === 0 || cldCount === 1) {
        ch = "";
      } else if (c === 1) {
        ch = ":first-child";
      } else if (c === cldCount) {
        ch = ":last-child";
      } else {
        ch = `:nth-child(${c})`;
      }

      /**
       * By default we include tag name and
       * element classes to selector for element without id attribute
       */
      if (el === element) {
        let p = makeDefaultCssFilter(
          el,
          classList,
          excludeId,
          excludeTagNameOverride ? excludeTagName : false
        );
        p += ch;
        path.unshift(p);
      } else {
        path.unshift(makeDefaultCssFilter(el, el.classList, false, false) + ch);
      }

      el = el.parentNode;
    }
  }
  return path.join(" > ");
};

const getDomPath = () => {
  document.addEventListener("click", (e) => {
    let path = makeCssNthChildFilter(e.target);
    console.log(path);
  });
};

export default getDomPath;

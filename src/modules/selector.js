"use strict";

const selector= () => {

    let borderTop = null;
    let borderLeft = null;
    let borderRight = null;
    let borderBottom = null;
    const BORDER_WIDTH = 5;
    const BORDER_PADDING = 2;
    const BORDER_CSS = {
      position: "absolute",
      background: "white",
      margin: "0px",
      padding: "0px",
      display: "block",
      float: "none",
      border: "0",
      outline: "0",
      "background-color": "#13a35e",
      "font-style": "normal",
      "vertical-align": "baseline",
      "text-align": "left",
      "line-height": "12px",
      "box-sizing": "content-box",
      "min-height": "auto",
      "max-height": "auto",
      "min-width": "auto",
      "max-width": "auto",
      width: 0,
      height: 0,
      "z-index": 2147483646,
      "border-radius": 0,
    };
  
    const BORDER_BOTTOM_CSS = {
      "font-size": "10px",
      "font-weight": "bold",
      color: "white",
      padding: "2px 0px 2px 5px",
      overflow: "hidden",
    };
  
    const getTagPath = function (element) {
      if (element.parentNode) {
        return `${element.parentNode.tagName.toLowerCase()} ${element.tagName.toLowerCase()}`;
      }
      return element.tagName.toLowerCase();
    };
    const getOffsetExtended = function (elem) {
      const bodyRect = document.documentElement.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();
  
      const rectTop = elemRect.top - bodyRect.top;
      const rectLeft = elemRect.left - bodyRect.left;
  
      return {
        top: rectTop,
        left: rectLeft,
        outerWidth: elem.offsetWidth,
        outerHeight: elem.offsetHeight,
      };
    };
    const toArray = (elems) =>
      elems && elems.length !== undefined
        ? Array.prototype.slice.call(elems)
        : [elems];
  
    const addStyle = (elem, attr, value) => {
      const elems = toArray(elem);
      elems.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.style[attr] = value;
      });
    };
  
    const px = function (p) {
      return `${p}px`;
    };
  
    const hide = (elem) => {
      const elems = toArray(elem);
      elems.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.style.display = "none";
      });
    };
  
    const addBorderCSS = function () {
      Object.keys(BORDER_CSS).forEach((item) => {
        borderTop.style[item] = BORDER_CSS[item];
        borderBottom.style[item] = BORDER_CSS[item];
        borderLeft.style[item] = BORDER_CSS[item];
        borderRight.style[item] = BORDER_CSS[item];
      });
  
      Object.keys(BORDER_BOTTOM_CSS).forEach((item) => {
        borderBottom.style[item] = BORDER_BOTTOM_CSS[item];
      });
    };
  
    const addBorderToDom = function () {
      document.documentElement.appendChild(borderTop);
      document.documentElement.appendChild(borderBottom);
      document.documentElement.appendChild(borderLeft);
      document.documentElement.appendChild(borderRight);
    };
  


    document.addEventListener("mousemove", (element) => {
      if (!borderTop) {
        const width = px(BORDER_WIDTH);
        const bottomHeight = px(BORDER_WIDTH + 6);
  
        borderTop = document.createElement("div");
        borderBottom = document.createElement("div");
        borderLeft = document.createElement("div");
        borderRight = document.createElement("div");
  
        addStyle(borderTop, "height", width);
        addStyle(borderBottom, "height", bottomHeight);
        addStyle(borderLeft, "width", width);
        addStyle(borderRight, "width", width);
  
        hide(borderTop);
        hide(borderBottom);
        hide(borderLeft);
        hide(borderRight);
  
        addBorderCSS();
        addBorderToDom();
      }
      const p = getOffsetExtended(element.target);
      const { top } = p;
      const { left } = p;
      const width = p.outerWidth;
      const height = p.outerHeight;
  
      addStyle(
        borderTop,
        "width",
        px(width + BORDER_PADDING * 2 + BORDER_WIDTH * 2)
      );
      addStyle(borderTop, "height", px(5));
      addStyle(borderTop, "top", px(top - BORDER_WIDTH - BORDER_PADDING));
      addStyle(borderTop, "left", px(left - BORDER_PADDING - BORDER_WIDTH));
  
      addStyle(
        borderBottom,
        "width",
        px(width + BORDER_PADDING * 2 + BORDER_WIDTH)
      );
      addStyle(borderBottom, "height", px(12));
      addStyle(borderBottom, "top", px(top + height + BORDER_PADDING));
      addStyle(borderBottom, "left", px(left - BORDER_PADDING - BORDER_WIDTH));
  
      addStyle(borderLeft, "height", px(height + BORDER_PADDING * 2));
      addStyle(borderLeft, "width", px(5));
      addStyle(borderLeft, "top", px(top - BORDER_PADDING));
      addStyle(borderLeft, "left", px(left - BORDER_PADDING - BORDER_WIDTH));
  
      addStyle(borderRight, "height", px(height + BORDER_PADDING * 2));
      addStyle(borderRight, "width", px(5));
      addStyle(borderRight, "top", px(top - BORDER_PADDING));
      addStyle(borderRight, "left", px(left + width + BORDER_PADDING));
  
      borderBottom.textContent = getTagPath(element.target);
      borderRight.target_elem = element;
      borderLeft.target_elem = element;
      borderTop.target_elem = element;
      borderBottom.target_elem = element;
    });
    document.addEventListener("mouseout", (e) => {
      if (borderTop) {
        const parent = borderTop.parentNode;
  
        if (parent) {
          parent.removeChild(borderTop);
          parent.removeChild(borderBottom);
          parent.removeChild(borderLeft);
          parent.removeChild(borderRight);
        }
      }
  
      borderTop = null;
      borderBottom = null;
      borderRight = null;
      borderLeft = null;
    });
  };

export default selector;
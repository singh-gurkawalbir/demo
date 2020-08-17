import throttle from 'lodash/throttle';

let offset; // This is the top/bottom offset you use to start scrolling in the div.
let pxDiff;

let scrollIncrement = 0;
let isScrolling = false;
let sidebarElement = null;
let scrollHeightSidebar = 0;
let clientRectBottom = 0;
let clientRectTop = 0;

// Scroll up in the sidebar.
const goUp = () => {
  if (scrollIncrement - pxDiff < 0) {
    return;
  }

  scrollIncrement -= pxDiff;
  sidebarElement.scrollTop = scrollIncrement;

  if (isScrolling) {
    window.requestAnimationFrame(goUp);
  }
};

// Scroll down in the sidebar.
const goDown = () => {
  if (scrollIncrement + pxDiff > scrollHeightSidebar) {
    return;
  }
  scrollIncrement += pxDiff;
  sidebarElement.scrollTop = scrollIncrement;
  if (isScrolling) {
    window.requestAnimationFrame(goDown);
  }
};

const onDragOver = event => {
  const isMouseOnTop =
    scrollIncrement >= 0 &&
    event.clientY > clientRectTop &&
    event.clientY < clientRectTop + offset;
  const isMouseOnBottom =
    scrollIncrement <= scrollHeightSidebar &&
    event.clientY > clientRectBottom - offset &&
    event.clientY <= clientRectBottom;

  if (!isScrolling && (isMouseOnTop || isMouseOnBottom)) {
    isScrolling = true;
    scrollIncrement = sidebarElement.scrollTop;

    if (isMouseOnTop) {
      window.requestAnimationFrame(goUp);
    } else {
      window.requestAnimationFrame(goDown);
    }
  } else if (!isMouseOnTop && !isMouseOnBottom) {
    isScrolling = false;
  }
};

// The "throttle" method prevents executing the same function SO MANY times.
const throttleOnDragOver = throttle(onDragOver, 150);

export const addEventListenerForSidebar = (element, height) => {
  sidebarElement = element;
  scrollHeightSidebar = sidebarElement.scrollHeight;
  pxDiff = Math.round(scrollHeightSidebar / height);
  offset = Math.round(height / 2 - height / 8);
  const clientRect = sidebarElement.getBoundingClientRect();

  clientRectTop = clientRect.top;
  clientRectBottom = clientRect.bottom;
  isScrolling = false;
  sidebarElement.addEventListener('dragover', throttleOnDragOver);
};

export const removeEventListenerForSidebar = () => {
  isScrolling = false;

  if (sidebarElement) {
    sidebarElement.removeEventListener('dragover', throttleOnDragOver);
  }
};

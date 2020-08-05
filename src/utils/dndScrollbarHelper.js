import throttle from 'lodash/throttle';

const OFFSET = 250; // This is the top/bottom offset you use to start scrolling in the div.
const PX_DIFF = 25;

let scrollIncrement = 0;
let isScrolling = false;
let sidebarElement = null;
let scrollHeightSidebar = 0;
let clientRectBottom = 0;
let clientRectTop = 0;

// Scroll up in the sidebar.
const goUp = () => {
  if (scrollIncrement - PX_DIFF < 0) {
    return;
  }

  scrollIncrement -= PX_DIFF;
  sidebarElement.scrollTop = scrollIncrement;

  if (isScrolling) {
    window.requestAnimationFrame(goUp);
  }
};

// Scroll down in the sidebar.
const goDown = () => {
  if (scrollIncrement + PX_DIFF > scrollHeightSidebar) {
    return;
  }
  scrollIncrement += PX_DIFF;
  sidebarElement.scrollTop = scrollIncrement;
  if (isScrolling) {
    window.requestAnimationFrame(goDown);
  }
};

const onDragOver = event => {
  const isMouseOnTop =
    scrollIncrement >= 0 &&
    event.clientY > clientRectTop &&
    event.clientY < clientRectTop + OFFSET;
  const isMouseOnBottom =
    scrollIncrement <= scrollHeightSidebar &&
    event.clientY > clientRectBottom - OFFSET &&
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

export const addEventListenerForSidebar = element => {
  sidebarElement = element;
  scrollHeightSidebar = sidebarElement.scrollHeight;
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

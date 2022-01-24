import { useCallback, useEffect, useState } from 'react';

const KEYCODE = {
  UP: 38,
  DOWN: 40,
};
const initialFocusIndex = 0;

function useKeyboardNavigation({listLength = 0, containerRef = null, listItemRef = null}) {
  const [currentFocussed, setCurrentFocussed] = useState(initialFocusIndex);

  function onKeyDown(event) {
    switch (event.keyCode) {
      case KEYCODE.DOWN:
        event.preventDefault();
        setCurrentFocussed(state => state < listLength - 1 ? state + 1 : state);
        break;
      case KEYCODE.UP:
        event.preventDefault();
        setCurrentFocussed(state => state > 0 ? state - 1 : state);
        break;
      default:
        break;
    }
  }
  const keyDownHandler = useCallback(onKeyDown, [listLength]);
  const resetKeyboardFocus = useCallback(() => {
    setCurrentFocussed(initialFocusIndex);
  }, []);

  // Adding listener to parent for key down events
  useEffect(() => {
    let current;

    if (containerRef?.current) {
          containerRef?.current?.addEventListener('keydown', keyDownHandler);
          current = containerRef?.current;
    } else {
      window.addEventListener('keydown', keyDownHandler);
    }

    return () => {
        current?.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('keydown', keyDownHandler);
    };
  }, [containerRef, keyDownHandler]);

  // for auto scrolling the container when focussed element is out of screen
  useEffect(() => {
    if (listItemRef?.current && currentFocussed) {
        listItemRef?.current?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }
  }, [currentFocussed, listItemRef]);

  return {currentFocussed, resetKeyboardFocus};
}
export default useKeyboardNavigation;

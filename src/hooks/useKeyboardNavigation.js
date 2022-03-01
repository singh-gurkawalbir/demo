import { useCallback, useEffect, useState } from 'react';
import useScrollIntoView from './useScrollIntoView';

const KEYCODE = {
  UP: 38,
  DOWN: 40,
};
const initialFocusIndex = -1;

function useKeyboardNavigation({listLength = 0, containerRef = null, listItemRef = null}) {
  const [currentFocussed, setCurrentFocussed] = useState(initialFocusIndex);

  useEffect(() => {
    if (currentFocussed > listLength - 1) {
      setCurrentFocussed(listLength - 1);
    }
  }, [currentFocussed, listLength]);
  function onKeyDown(event) {
    switch (event.keyCode) {
      case KEYCODE.DOWN:
        event.preventDefault();
        setCurrentFocussed(state => state < listLength - 1 ? state + 1 : state);
        break;
      case KEYCODE.UP:
        event.preventDefault();
        setCurrentFocussed(state => state > -1 ? state - 1 : state);
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
  useScrollIntoView(listItemRef, currentFocussed);

  return {currentFocussed, resetKeyboardFocus};
}
export default useKeyboardNavigation;

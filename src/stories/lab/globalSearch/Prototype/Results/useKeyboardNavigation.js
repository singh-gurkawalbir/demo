import { useCallback, useEffect, useState } from 'react';

const KEYCODE = {
  UP: 38,
  DOWN: 40,
};

function useKeyboardNavigation({listLength = 0, containerRef = null, listItemRef = null}) {
  const [currentFocussed, setCurrentFocussed] = useState(-1);

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

  useEffect(() => {
    let current;

    if (containerRef?.current) {
          containerRef?.current?.addEventListener('keydown', keyDownHandler);
          current = containerRef?.current;
    }

    return () => {
        current?.removeEventListener('keydown', keyDownHandler);
    };
  }, [containerRef, keyDownHandler]);

  useEffect(() => {
    if (listItemRef?.current && currentFocussed) {
        listItemRef?.current?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }
  }, [currentFocussed, listItemRef]);

  return {currentFocussed};
}
export default useKeyboardNavigation;

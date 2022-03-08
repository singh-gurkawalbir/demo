import {useEffect} from 'react';

const emptyFunc = () => {};
export default function useOnClickOutside(ref, handler) {
  const currHandler = handler || emptyFunc;

  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        currHandler(event);
      };

      document.addEventListener('click', listener);
      document.addEventListener('mousedown', listener);

      return () => {
        document.removeEventListener('click', listener);
        document.removeEventListener('mousedown', listener);
      };
    },
    // Add ref and handler to effect dependencies
    [ref, currHandler]
  );
}

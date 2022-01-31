import {useEffect} from 'react';

/**
 * Brings element to view if not already in view
 * @param {*} ref element ref that should be brought into view
 * @param {*} scrollIntoView boolean that indicates if element is not already in view
 * @returns null
 */
export default function useScrollIntoView(ref, scrollIntoView = false) {
  useEffect(() => {
    if (ref?.current && scrollIntoView) {
        ref?.current?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }
  }, [ref, scrollIntoView]);

  return null;
}

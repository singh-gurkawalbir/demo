import {useEffect} from 'react';

export default function useScrollIntoView(ref, scrollIntoView = false) {
  useEffect(() => {
    if (ref?.current && scrollIntoView) {
        ref?.current?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }
  }, [ref, scrollIntoView]);

  return null;
}

import { useEffect, useRef } from 'react';

export default function useSyncedRef(ref) {
  const syncedRef = useRef();

  useEffect(() => {
    syncedRef.current = ref;
  }, [ref]);

  return syncedRef;
}

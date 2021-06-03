import { useCallback, useState } from 'react';

export default function useSortableList(onEnd) {
  const [dragItemIndex, setDragItemIndex] = useState(undefined);

  const handleSortStart = useCallback(({index}) => {
    setDragItemIndex(index);
  }, []);

  const handleSortEnd = useCallback(({oldIndex, newIndex}) => {
    setDragItemIndex(undefined);
    if (oldIndex !== newIndex) onEnd({oldIndex, newIndex});
  }, [onEnd]);

  return { dragItemIndex, handleSortStart, handleSortEnd };
}

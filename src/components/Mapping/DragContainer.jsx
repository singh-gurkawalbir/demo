import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd-cjs';
import { useDispatch } from 'react-redux';
import MappingRow from './MappingRow';
import actions from '../../actions';

const emptyObject = {};
export default function DragContainer({ mappings, onDrop, ...props }) {
  const dispatch = useDispatch();
  const [mappingState, setMappingState] = useState(mappings);
  const handleDrop = useCallback(
    (key, finalIndex) => {
      dispatch(actions.mapping.shiftOrder(key, finalIndex));
    },
    [dispatch]
  );
  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const mappingsCopy = [...mappingState];
      const dragItem = mappingsCopy[dragIndex];

      mappingsCopy.splice(dragIndex, 1);
      mappingsCopy.splice(hoverIndex, 0, dragItem);

      setMappingState(mappingsCopy);
    },
    [mappingState]
  );

  const tableData = useMemo(
    () =>
      (mappingState || []).map((value, index) => {
        const obj = { ...value };

        obj.index = index;

        return obj;
      }),
    [mappingState]
  );
  const [, drop] = useDrop({ accept: 'MAPPING',
    drop(item) {
      handleDrop(item.key, item.index);
    },
  });

  useEffect(() => {
    if (mappings.length !== mappingState.length) {
      setMappingState(mappings);
    }
  }, [mappingState.length, mappings]);
  const emptyRowIndex = mappingState.length;

  return (
    <>
      <div ref={drop}>
        {tableData.map((mapping, index) => (
          <MappingRow
            index={index}
            key={mapping.key}
            mappingKey={mapping.key}
            onMove={handleMove}
            isDraggable
            {...props}
          />
        ))}
      </div>
      <MappingRow
        key={`newMappingRow-${emptyRowIndex}`}
        index={emptyRowIndex}
        mapping={emptyObject}
        isDraggable={false}
        {...props}
      />
    </>
  );
}

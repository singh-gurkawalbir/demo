import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {selectors} from '../../reducers';
import MappingRow from './MappingRow';
import actions from '../../actions';
import SortableList from '../Sortable/SortableList';
import SortableItem from '../Sortable/SortableItem';
import useSortableList from '../../hooks/useSortableList';

export default function DragContainer({ onDrop, disabled, className, ...props }) {
  const dispatch = useDispatch();
  const mappings = useSelector(state => selectors.mapping(state).mappings);
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    dispatch(actions.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
  }, [dispatch, mappings]);
  const {dragItemIndex, handleSortStart, handleSortEnd} = useSortableList(onSortEnd);

  const emptyRowIndex = mappings.length;

  return (
    <>
      <SortableList
        onSortEnd={handleSortEnd}
        updateBeforeSortStart={handleSortStart}
        axis="y"
        useDragHandle>
        {mappings.map((mapping, index) => (
          <SortableItem
            key={mapping.key}
            index={index}
            hideSortableGhost={false}
            value={(
              <MappingRow
                index={index}
                mappingKey={mapping.key}
                disabled={disabled}
                isDragInProgress={dragItemIndex !== undefined}
                isRowDragged={dragItemIndex === index}
                {...props}
            />
          )}
        />
        ))}
      </SortableList>
      <MappingRow
        key={`newMappingRow-${emptyRowIndex}`}
        index={emptyRowIndex}
        disabled={disabled}
        {...props}
      />
    </>
  );
}

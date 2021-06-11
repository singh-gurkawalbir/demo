import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {selectors} from '../../../reducers';
import MappingRow from './MappingRow';
import actions from '../../../actions';
import SortableList from '../../../components/Sortable/SortableList';
import SortableItem from '../../../components/Sortable/SortableItem';
import useSortableList from '../../../hooks/useSortableList';

const emptyObject = {};

export default function DragContainer({disabled}) {
  const dispatch = useDispatch();
  const mappings = useSelector(state => selectors.suiteScriptMapping(state).mappings);
  const onSortEnd = useCallback(
    ({oldIndex, newIndex}) => {
      dispatch(actions.suiteScript.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
    },
    [dispatch, mappings]
  );

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
                key={mapping.key}
                mappingKey={mapping.key}
                // onMove={handleMove}
                isDragInProgress={dragItemIndex !== undefined}
                isRowDragged={dragItemIndex === index}
                disabled={disabled}
          />
          )}
          />
        ))}
      </SortableList>
      <MappingRow
        key={`newMappingRow-${emptyRowIndex}`}
        index={emptyRowIndex}
        mapping={emptyObject}
        disabled={disabled}
      />
    </>
  );
}

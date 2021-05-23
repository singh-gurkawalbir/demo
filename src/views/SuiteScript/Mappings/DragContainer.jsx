import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {selectors} from '../../../reducers';
import MappingRow from './MappingRow';
import actions from '../../../actions';

const emptyObject = {};
const useStyles = makeStyles({
  listContainer: {
    marginInlineStart: 0,
    marginBlockStart: 0,
    paddingInlineStart: 0,
    marginBlockEnd: 0,
    listStyleType: 'none',
    '& > li': {
      listStyle: 'none',
    },
  },
});

const SortableItem = SortableElement(({value}) => (
  <li>
    {value}
  </li>
));

const SortableList = SortableContainer(({children, className}) => <ul className={className}>{children}</ul>);

export default function DragContainer({disabled}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [dragState, setDragState] = useState({
    isDragging: false,
    itemIndex: undefined,
  });
  const mappings = useSelector(state => selectors.suiteScriptMapping(state).mappings);
  const onDragEnd = useCallback(
    ({oldIndex, newIndex}) => {
      if (oldIndex !== newIndex) {
        dispatch(actions.suiteScript.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
      }
      setDragState({isDragging: false, itemIndex: undefined});
    },
    [dispatch, mappings]
  );
  const handleDragStart = ({ index }) => {
    setDragState({isDragging: true, itemIndex: index});
  };

  const emptyRowIndex = mappings.length;

  return (
    <>
      <SortableList
        onSortEnd={onDragEnd}
        updateBeforeSortStart={handleDragStart}
        className={classes.listContainer}
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
                isDragInProgress={dragState.isDragging}
                isRowDragged={dragState.itemIndex === index}
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

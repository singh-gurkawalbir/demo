import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core';
import {selectors} from '../../reducers';
import MappingRow from './MappingRow';
import actions from '../../actions';

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

export default function DragContainer({ onDrop, disabled, className, ...props }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [dragState, setDragState] = useState({
    isDragging: false,
    itemIndex: undefined,
  });
  const mappings = useSelector(state => selectors.mapping(state).mappings);
  const handleSortEnd = useCallback(({oldIndex, newIndex}) => {
    setDragState({isDragging: false, itemIndex: undefined});
    if (oldIndex !== newIndex) {
      dispatch(actions.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
    }
  }, [dispatch, mappings]);
  const handleSortStart = ({ index }) => {
    setDragState({isDragging: true, itemIndex: index});
  };
  const emptyRowIndex = mappings.length;

  return (
    <>
      <SortableList
        onSortEnd={handleSortEnd}
        updateBeforeSortStart={handleSortStart}
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
                mappingKey={mapping.key}
                disabled={disabled}
                isDragInProgress={dragState.isDragging}
                isRowDragged={dragState.itemIndex === index}
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

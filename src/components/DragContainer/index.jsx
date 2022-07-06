import React from 'react';
import SortableList from '../Sortable/SortableList';
import SortableItem from '../Sortable/SortableItem';
import useSortableList from '../../hooks/useSortableList';

export default function DragContainer({
  onDrop,
  disabled,
  className,
  items = [],
  SortableItemComponent,
  LastRowSortableItemComponent,
  onSortEnd,
  ...props
}) {
  const {dragItemIndex, handleSortStart, handleSortEnd} = useSortableList(onSortEnd);

  const emptyRowIndex = items.length;

  return (
    <>
      <SortableList
        onSortEnd={handleSortEnd}
        updateBeforeSortStart={handleSortStart}
        axis="y"
        useDragHandle>
        {emptyRowIndex > 0 && items.map((item, index) => (
          <SortableItem
            key={item.key || item.sectionId}
            index={index}
            hideSortableGhost={false}
            value={(
              <SortableItemComponent
                index={index}
                rowData={item}
                disabled={disabled}
                isDragInProgress={dragItemIndex !== undefined}
                isRowDragged={dragItemIndex === index}
                {...props}
            />
          )}
        />
        ))}
      </SortableList>
      <LastRowSortableItemComponent
        key={`newMappingRow-${emptyRowIndex}`}
        index={emptyRowIndex}
        disabled={disabled}
        {...props}
      />
    </>
  );
}

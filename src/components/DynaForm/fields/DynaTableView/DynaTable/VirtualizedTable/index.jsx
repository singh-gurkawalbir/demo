import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { VariableSizeList } from 'react-window';
import { Spinner } from '@celigo/fuse-ui';
import TableRow, { isCellValid } from '../TableRow';

const VirtualizedListRow = ({index, style, data}) => {
  const {
    items,
    optionsMapFinal,
    touched,
    ignoreEmptyRow,
    setTableState,
    onRowChange,
    disableDeleteRows,
    invalidateParentFieldOnError,
    setIsValid,
  } = data;

  const { value, key } = items[index];

  return (
    <div
      style={style} key={key}
    >
      <TableRow
        isVirtualizedTable
        invalidateParentFieldOnError={invalidateParentFieldOnError}
        rowValue={value}
        rowIndex={index}
        tableSize={items.length}
        optionsMap={optionsMapFinal}
        touched={touched}
        ignoreEmptyRow={ignoreEmptyRow}
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
        setIsValid={setIsValid}
      />
    </div>
  );
};

const isRowValid = (optionsMap, rowValue, rowIndex, items, touched) => optionsMap.every(op => {
  const {required, id} = op;
  const fieldValue = rowValue.value[id];

  return isCellValid({fieldValue, required, rowIndex, tableSize: items.length, touched});
});

const useResetErroredRowHeights = (listRef, items, optionsMap, touched) => {
  useEffect(() => {
    if (!listRef.current) {
      return () => {};
    }
    const {resetAfterIndex} = listRef.current;
    const invalidRows = items.reduce((acc, curr, ind) => {
      const rowValid = isRowValid(optionsMap, curr, ind, items, touched);

      if (!rowValid) {
        acc.push(ind);
      }

      return acc;
    }, []);

    invalidRows.forEach(ind => {
      resetAfterIndex(ind);
    });

    return () => {
      // clean up required to reset previously errored rows
      invalidRows.forEach(ind => {
        resetAfterIndex(ind);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
};

const VirtualizedTable = ({
  items,
  optionsMapFinal,
  touched,
  ignoreEmptyRow,
  isAnyColumnFetching,
  setTableState,
  onRowChange,
  disableDeleteRows,
  invalidateParentFieldOnError,
  setIsValid,
  rowHeight = 46,
  invalidRowHeight = 55,
  maxRowCount = 10,
  maxTableHeight = 480 }) => {
  const listRef = React.createRef();

  const [, setItemCount] = useState(items.length);
  const [scrollIndex, setScrollIndex] = useState(0);

  const ITEM_SIZE = rowHeight;
  const INVALID_ITEM_SIZE = invalidRowHeight;
  const NO_OF_ROWS = maxRowCount;
  const TABLE_VIEW_PORT_HEIGHT = maxTableHeight;

  const maxHeightOfSelect = items.length > NO_OF_ROWS
    ? TABLE_VIEW_PORT_HEIGHT
    : ITEM_SIZE * items.length;

  useResetErroredRowHeights(listRef, items, optionsMapFinal, touched);

  const getItemSize = useCallback(rowIndex => {
    const rowValue = items[rowIndex];
    const rowValid = isRowValid(optionsMapFinal, rowValue, rowIndex, items, touched);

    if (!rowValid) return INVALID_ITEM_SIZE;

    return ITEM_SIZE;
  }, [items, optionsMapFinal, touched]);

  const rowProps = useMemo(() => ({
    items,
    optionsMapFinal,
    touched,
    ignoreEmptyRow,
    setTableState,
    onRowChange,
    disableDeleteRows,
    setIsValid,
    invalidateParentFieldOnError,  // Add the invalidateParentFieldOnError property in the rowProps so that VariableSizeList component could pass the property to it's children
  }), [items, optionsMapFinal, touched, ignoreEmptyRow, setTableState, onRowChange, disableDeleteRows, invalidateParentFieldOnError, setIsValid]);

  // We need to update the latest scrollIndex so that during a table refresh when we loose the scroll index we use this scroll index state
  // we do not want to trigger a setState for every scroll event and cause unnecessary rerenders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onScroll = useCallback(
    debounce(props => {
      const {scrollOffset} = props;

      setScrollIndex(scrollOffset);
    }, 100), []);

  useEffect(() => {
    // when item count increases that indicates a new row has been added...so lets scroll to the end of the list
    setItemCount(itemsCount => {
      if (items.length > itemsCount) {
        listRef.current.scrollToItem(items.length);
      }

      return items.length;
    });
  }, [items.length, listRef]);

  // The autocomplete component needs the options during an initial load
  // this is helpful for that component to resolve the corresponding label in the input text field
  if (isAnyColumnFetching) {
    return (
      <div style={{height: `${maxHeightOfSelect}px`}}>
        <Spinner center="screen" />
      </div>
    );
  }

  return (

    <VariableSizeList
      ref={listRef}
      itemSize={getItemSize}
      height={maxHeightOfSelect}
      initialScrollOffset={scrollIndex}
      itemCount={items.length}
      itemData={rowProps}
      onScroll={onScroll}
     >
      {/* when options are loading we have to return the spinner, this is to block the user
         from accessing the table till the DynaAutocomplete initial value state settles */}
      { VirtualizedListRow}
    </VariableSizeList>
  );
};

export default VirtualizedTable;

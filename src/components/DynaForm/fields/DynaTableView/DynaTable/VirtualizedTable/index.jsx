import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { VariableSizeList } from 'react-window';
import Spinner from '../../../../../Spinner';
import TableRow, { isCellValid } from '../TableRow';

const ITEM_SIZE = 46;
// const INVALID_ITEM_SIZE = 55;
const NO_OF_ROWS = 10;
const TABLE_VIEW_PORT_HEIGHT = 480;
const VirtualizedListRow = ({index, style, data}) => {
  const {
    items,
    optionsMapFinal,
    touched,
    ignoreEmptyRow,
    setTableState,
    onRowChange,
    disableDeleteRows,
    setSize,
  } = data;

  const { value, key } = items[index];

  return (
    <div
      style={style} key={key}
    >
      <TableRow
        isVirtualizedTable
        index={index}
        setSize={setSize}
        rowValue={value}
        rowIndex={index}
        tableSize={items.length}
        optionsMap={optionsMapFinal}
        touched={touched}
        ignoreEmptyRow={ignoreEmptyRow}
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
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
  disableDeleteRows }) => {
  const listRef = React.createRef();

  const [, setItemCount] = useState(items.length);
  const [scrollIndex, setScrollIndex] = useState(0);
  const maxHeightOfSelect = items.length > NO_OF_ROWS
    ? TABLE_VIEW_PORT_HEIGHT
    : ITEM_SIZE * items.length;

  const sizeMap = useRef({});

  const setSize = useCallback((rowIndex, colIndex, size) => {
    const row = {...(sizeMap.current?.[rowIndex] || {}), [colIndex]: size};

    sizeMap.current = { ...sizeMap.current, [rowIndex]: row };
    console.log('should trigger ', row);

    listRef.current.resetAfterIndex(rowIndex);
  }, [listRef]);
  const getSize = useCallback(rowIndex => Object.values(sizeMap.current?.[rowIndex] || {}).reduce((acc, curr) => {
    if (curr > acc) {
      return curr;
    }

    return acc;
  }, -1) || 50, []);

  console.log(' here ', sizeMap);
  useResetErroredRowHeights(listRef, items, optionsMapFinal, touched);
  const getItemSize = useCallback(rowIndex => {
    const rowValue = items[rowIndex];
    const rowValid = isRowValid(optionsMapFinal, rowValue, rowIndex, items, touched);

    const rowHeight = getSize(rowIndex);

    console.log('hi ', rowHeight, rowIndex);
    if (!rowValid) return rowHeight + 9;

    return rowHeight;
  }, [items, optionsMapFinal, getSize, touched]);

  const rowProps = useMemo(() => ({
    items,
    optionsMapFinal,
    touched,
    ignoreEmptyRow,
    setTableState,
    onRowChange,
    disableDeleteRows,
    listRef,
    setSize,
  }), [items, optionsMapFinal, touched, ignoreEmptyRow, setTableState, onRowChange, disableDeleteRows, listRef, setSize]);

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
        <Spinner centerAll />
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

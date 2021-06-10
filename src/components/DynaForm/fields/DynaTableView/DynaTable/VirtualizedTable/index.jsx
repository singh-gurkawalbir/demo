import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import Spinner from '../../../../../Spinner';
import TableRow from '../TableRow';

const ITEM_SIZE = 46;
const NO_OF_ROWS = 10;
const TABLE_VIEW_PORT_HEIGHT = 480;
const VirtualizedListRow = ({index, style, data}) => {
  const {items, optionsMapFinal,
    touched,
    setTableState,
    onRowChange,
    disableDeleteRows } = data;

  const { value, key } = items[index];

  return (
    <div
      style={style} key={key}
    >
      <TableRow
        isVirtualizedTable
        rowValue={value}
        rowIndex={index}
        tableSize={items.length}
        optionsMap={optionsMapFinal}
        touched={touched}
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
      />
    </div>
  );
};

const VirtualizedTable = ({
  items,
  optionsMapFinal,
  touched,
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

  const rowProps = useMemo(() => ({
    items,
    optionsMapFinal,
    touched,
    setTableState,
    onRowChange,
    disableDeleteRows,
  }), [disableDeleteRows, items, onRowChange, optionsMapFinal, setTableState, touched]);

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
  if (isAnyColumnFetching) { return (<div style={{height: `${maxHeightOfSelect}px`}}><Spinner centerAll /></div>); }

  return (

    <FixedSizeList
      ref={listRef}
      itemSize={ITEM_SIZE}
      height={
      maxHeightOfSelect
    }
      initialScrollOffset={scrollIndex}
      itemCount={items.length}
      itemData={rowProps}
      onScroll={onScroll}

     >
      {/*  // when options are loading we have to return the spinner this is to block the user from accessing the table till
  // the DynaAutocomplete initial value state settles */}
      { VirtualizedListRow}
    </FixedSizeList>
  );
};

export default VirtualizedTable;

import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import TableRow from '../TableRow';

const ITEM_SIZE = 46;
const NO_OF_OPTIONS = 10;
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
  setTableState,
  onRowChange,
  disableDeleteRows }) => {
  const maxHeightOfSelect = items.length > NO_OF_OPTIONS
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

  return (

    <FixedSizeList
      itemSize={ITEM_SIZE}
      height={
      maxHeightOfSelect
    }
      itemCount={items.length}
      itemData={rowProps}

     >
      {VirtualizedListRow}
    </FixedSizeList>
  );
};

export default VirtualizedTable;

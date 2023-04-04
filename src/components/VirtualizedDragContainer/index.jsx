import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { areEqual, VariableSizeList } from 'react-window';
import { Spinner } from '@celigo/fuse-ui';
import SortableList from '../Sortable/SortableList';
import SortableItem from '../Sortable/SortableItem';
import useSortableList from '../../hooks/useSortableList';
import MappingRow from '../Mapping/MappingRow';
import { emptyObject } from '../../constants';

function itemKey(index, data) {
  const item = data.items[index];

  return item.key || `newMappingRow-${index}`;
}
// TODO make this virtualizedDragcontainer as Dynamicrow checks and window width check.
const getItemSize = (index, itemsData) => {
  let noOfLine = 1;
  const item = itemsData.items[index];

  if (itemsData.items[index].generate || itemsData.items[index].extract) { noOfLine = Math.ceil(Math.max((item?.generate) ? item?.generate.length : 0, (item?.extract) ? item?.extract?.length : 0) / 50); }

  return 46 + (24 * (noOfLine - 1));
};
const Row = ({ index, style, isScrolling, data, setSize }) => {
  const { disabled, importId, flowId, subRecordMappingId, items } = data;

  useEffect(() => {
    setSize(index, getItemSize(index, data));
  }, [setSize, index, data]);
  // To restrict drag operation for the last empty row

  const emptyRowDragCheck = !items[index].key ? (
    <MappingRow
      index={index}
      rowData={items[index]}
      disabled={disabled}
      importId={importId}
      flowId={flowId}
      key={`newMappingRow-${index}`}
      subRecordMappingId={subRecordMappingId}
      // To get suggestion dropdown by overlaying the mapping dialog.
      menuPortalStyle={{menuPortal: provided => ({...provided, zIndex: '9999999'})}}
      menuPortalTarget={{menuPortalTarget: document.body}}
      />
  ) : (
    <SortableItem
      key={items[index].key || index}
      index={index}
      hideSortableGhost={false}
      value={(
        <MappingRow
          index={index}
          rowData={items[index]}
          disabled={disabled}
          importId={importId}
          flowId={flowId}
          subRecordMappingId={subRecordMappingId}
          menuPortalStyle={{menuPortal: provided => ({...provided, zIndex: '9999999'})}}
          menuPortalTarget={{menuPortalTarget: document.body}}
            />
          )}
        />
  );

  return (
    <div key={items[index].key || `newMappingRow-${index}`} style={style}>
      {isScrolling ? (
        <Spinner />
      ) : (emptyRowDragCheck)}

    </div>
  );
};

const MemoizedRow = React.memo(Row, areEqual);

export default function VirtualizedDragContainer({
  disabled,
  items = [],
  onSortEnd,
  importId,
  flowId,
  subRecordMappingId,
}) {
  const { handleSortEnd } = useSortableList(onSortEnd);
  const listRef = useRef();
  const sizeMap = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = index => sizeMap.current[index] || 46;
  // For adding a empty row at the last.
  const mappingData = useMemo(() => {
    const mappingCopy = [...items] || [];

    mappingCopy.push(emptyObject);

    return mappingCopy;
  }, [items]);

  const itemsData = useMemo(
    () => ({
      disabled,
      importId,
      flowId,
      subRecordMappingId,
      items: mappingData,
    }),
    [disabled, flowId, importId, mappingData, subRecordMappingId]
  );

  return (
    <SortableList
      onSortEnd={handleSortEnd}
      axis="y"
      itemsData={itemsData}
      useDragHandle
      getSize={getSize}
      setSize={setSize}
      listRef={listRef}>
      <VariableSizeList
        ref={listRef}
        itemSize={getSize}
        // innerHeight - parentContainerHeight = 262
        height={window.innerHeight - 262}
        itemCount={itemsData.items.length}
        itemData={itemsData}
        overscanCount={3}
        // className={className}
        itemKey={itemKey}
      >
        {props => (<MemoizedRow setSize={setSize} {...props} />)}
      </VariableSizeList>
    </SortableList>

  );
}

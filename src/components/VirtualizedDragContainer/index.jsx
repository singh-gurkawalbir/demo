import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { areEqual, VariableSizeList } from 'react-window';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { SortableContainer } from 'react-sortable-hoc';
import SortableItem from '../Sortable/SortableItem';
import useSortableList from '../../hooks/useSortableList';
import MappingRow from '../Mapping/MappingRow';
import Spinner from '../Spinner';
import { emptyObject } from '../../utils/constants';

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
  helperClass: {
    listStyleType: 'none',
    zIndex: '999999',
  },
});

function itemKey(index, data) {
  const item = data.items[index];

  return item.key || `newItem-${index}`;
}
function SortableListWrapper({ children, className = '', ...others }) {
  const classes = useStyles();

  return (
    <SortableVirtualizedList
      className={clsx(classes.listContainer, className)}
      helperClass={classes.helperClass}
      {...others}
     />
  );
}
const SortableVirtualizedList = SortableContainer(
  ({ className, itemsData, listRef, getSize, setSize }) => (
    <VariableSizeList
      ref={listRef}
      itemSize={getSize}
      height={500}
      itemCount={itemsData.items.length}
      itemData={itemsData}
      overscanCount={3}
      className={className}
      itemKey={itemKey}
      >
      {props => (<MemoizedRow setSize={setSize} {...props} />)}
    </VariableSizeList>
  )
);
// TODO make this virtualizedDragcontainer as Dynamicrow checks and window width check
const getItemSize = (index, itemsData) => {
  let noOfLine = 1;
  const item = itemsData.items[index];

  if (itemsData.items[index].generate || itemsData.items[index].extract) { noOfLine = Math.ceil(Math.max(item?.generate?.length, item?.extract?.length) / 50); }

  return 46 + (24 * (noOfLine - 1));
};
const Row = ({ index, style, isScrolling, data, setSize }) => {
  const { disabled, importId, flowId, subRecordMappingId, items } = data;

  useEffect(() => {
    setSize(index, getItemSize(index, data));
  }, [setSize, index, data]);

  return (
    <div key={items[index].key || `item-${index}`} style={style}>
      {isScrolling ? (
        <Spinner />
      ) : (
        <SortableItem
          key={`item-${items[index].key || index}`}
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
      )}
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
    <>
      <SortableListWrapper
        onSortEnd={handleSortEnd}
        axis="y"
        itemsData={itemsData}
        useDragHandle
        getSize={getSize}
        setSize={setSize}
        listRef={listRef}
       />
    </>
  );
}

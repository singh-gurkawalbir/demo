import {
  Table,
} from '@material-ui/core';
import React from 'react';
import TableBodyContent from './TableBodyContent';
import { TableContextWrapper } from './TableContext';
import TableHeader from './TableHeader';

const emptyObj = {};
const emptySet = [];

export default function CeligoTable({
  useColumns,
  onRowOver,
  onRowOut,
  onRowClick,
  rowKey,
  useRowActions,
  data = emptySet,
  onSelectChange,
  selectableRows,
  isSelectableRow,
  filterKey,
  className,
  size,
  actionProps = emptyObj,
  additionalConfigs,
  keydownListener,
}) {
  // if no useColumns hook no means to generate table
  if (!useColumns) { return null; }

  return (
    <div className={className} onKeyDownCapture={keydownListener}>
      <TableContextWrapper value={actionProps}>
        <Table size={size || 'medium'}>
          <TableHeader
            data={data}
            onSelectChange={onSelectChange}
            selectableRows={selectableRows}
            isSelectableRow={isSelectableRow}
            useColumns={useColumns}
            filterKey={filterKey}
            useRowActions={useRowActions}
          />
          <TableBodyContent
            rowKey={rowKey}
            data={data}
            onRowOver={onRowOver}
            onRowOut={onRowOut}
            onRowClick={onRowClick}
            selectableRows={selectableRows}
            isSelectableRow={isSelectableRow}
            useColumns={useColumns}
            useRowActions={useRowActions}
            filterKey={filterKey}
            onSelectChange={onSelectChange}
            additionalConfigs={additionalConfigs}
          />
        </Table>
      </TableContextWrapper>
    </div>
  );
}

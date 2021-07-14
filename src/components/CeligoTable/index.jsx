import {
  Table,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import TableBodyContent from './TableBodyContent';
import { TableContextWrapper } from './TableContext';
import TableHeader from './TableHeader';

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  row: {
    '& > td:last-child': {
      minWidth: '125px',
    },
    '&:hover > td:last-child > svg': {
      display: 'none',
    },
  },
  actionCell: {
    padding: '5px !important',
    textAlign: 'center',
  },
  actionContainer: {
    position: 'sticky',
    display: 'flex',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    width: 125,
  },
  tableContainer: {
    overflowX: 'auto',
  },
}));

const emptyObj = {};
const emptySet = [];

export default function CeligoTable({
  useColumns,
  onRowOver,
  onRowOut,
  rowKey,
  useRowActions,
  data = emptySet,
  onSelectChange,
  selectableRows,
  isSelectableRow,
  filterKey,
  className,
  actionProps = emptyObj,
  emptyMessage,
}) {
  const classes = useStyles();

  // if no useColumns hook no means to generate table
  if (!useColumns) { return null; }

  return (
    <div className={clsx(classes.tableContainer, className)}>
      <TableContextWrapper value={actionProps}>
        <Table data-public className={classes.table}>
          <TableHeader
            data={data}
            onSelectChange={onSelectChange}
            selectableRows={selectableRows}
            isSelectableRow={isSelectableRow}
            useColumns={useColumns}
            filterKey={filterKey}
            useRowActions={useRowActions}
            />

          {emptyMessage && !data?.length ? (<span> {emptyMessage}</span>) : (
            <TableBodyContent
              rowKey={rowKey}
              data={data}
              onRowOver={onRowOver}
              onRowOut={onRowOut}
              selectableRows={selectableRows}
              isSelectableRow={isSelectableRow}
              useColumns={useColumns}
              useRowActions={useRowActions}
              filterKey={filterKey}
              onSelectChange={onSelectChange}
          />
          )}
        </Table>
      </TableContextWrapper>
    </div>
  );
}

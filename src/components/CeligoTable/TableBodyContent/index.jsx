/* eslint-disable no-console */
import {
  TableBody,
  TableCell,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import ActionMenu from '../ActionMenu';
import DataRow from '../DataRow';
import AllContentCells from './AllContentCells';
import SelectableCheckBoxCell from './SelectableCheckBoxCell';

const useStyles = makeStyles(({
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
}));

// through rowKey you can explicitly declare the rowData property to be considered as a unique key
const getRowKey = (rowData, rowKey) => (rowKey && rowData[rowKey]) || rowData.key || rowData._id;

/* istanbul ignore next */
const TableMetaSanitizer = ({data, rowKey, useColumns, useRowActions = () => null}) => {
  // check for only for first rowData
  const firstRowData = data[0];
  const columns = useColumns(firstRowData);
  const rowActions = useRowActions(firstRowData);

  useEffect(() => {
    const rowKeyValue = getRowKey(firstRowData, rowKey);

    if (!rowKeyValue) {
      console.error('Could not find a rowValue for either the given key or defaultKey, Please provide a correct key rowKey');
    }
    if (columns) {
      const keysNotProvidedForCols = columns.filter(col => !col.key);

      if (keysNotProvidedForCols.length) {
        console.error('Keys are not provided for the following column metadata,Please add unique ones', keysNotProvidedForCols);
      }
      const allColumnKeys = columns.map(col => col.key);

      if (allColumnKeys.length && (allColumnKeys.length !== uniq(allColumnKeys).length)) {
        console.error('Keys are not unique amongst the column metadata,Please Correct it', allColumnKeys);
      }
    }
    if (rowActions) {
      const keysNotProvidedForRowActions = rowActions.filter(col => !col.key);

      if (keysNotProvidedForRowActions.length) {
        console.error('Keys are not provided for the following row actions metadata,Please add unique ones', keysNotProvidedForRowActions);

        return;
      }

      const allRowActionKeys = rowActions.map(col => col.key);

      if (allRowActionKeys.length && (allRowActionKeys.length !== uniq(allRowActionKeys).length)) {
        console.error('Keys are not unique amongst the actions metadata,Please Correct it');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
export default function TableBodyContent({
  rowKey,
  data,
  onRowOver,
  onRowOut,
  onRowClick,
  selectableRows,
  isSelectableRow,
  useColumns,
  useRowActions,
  filterKey,
  onSelectChange,
  additionalConfigs,
}
) {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <>
      {selectedComponent}
      {/* istanbul ignore next */
        (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') &&
      data.length
          ? (
            <TableMetaSanitizer
              data={data}
              rowKey={rowKey}
              useColumns={useColumns}
              useRowActions={useRowActions}
      />
          ) : null
}
      <TableBody>
        {data.map(rowData => (
          <DataRow
            key={getRowKey(rowData, rowKey)}
            rowData={rowData}
            onRowOver={onRowOver}
            onRowOut={onRowOut}
            onRowClick={onRowClick}
            className={classes.row}
            additionalConfigs={additionalConfigs}
        >
            <SelectableCheckBoxCell
              selectableRows={selectableRows}
              isSelectableRow={isSelectableRow}
              rowData={rowData}
              filterKey={filterKey}
              onSelectChange={onSelectChange}
            />

            <AllContentCells
              useColumns={useColumns}
              rowData={rowData}
            />
            {useRowActions && (
            <TableCell className={classes.actionCell}>
              <ActionMenu
                setSelectedComponent={setSelectedComponent}
                useRowActions={useRowActions}
                rowData={rowData}
                tooltip={additionalConfigs?.actionMenuTooltip}
              />
            </TableCell>
            )}
          </DataRow>
        ))}
      </TableBody>
    </>
  );
}

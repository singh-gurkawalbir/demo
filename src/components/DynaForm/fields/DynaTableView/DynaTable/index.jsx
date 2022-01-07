import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useReducer } from 'react';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import { generateNewId } from '../../../../../utils/resource';
import { hashCode } from '../../../../../utils/string';
import reducer, { preSubmit } from './reducer';
import RefreshHeaders from './RefreshHeaders';
import TableRow from './TableRow';
import VirtualizedTable from './VirtualizedTable';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  childRow: {
    display: 'flex',
    position: 'relative',
  },
  tableBody: {
    marginBottom: 6,
  },
  root: {
    display: 'flex',
  },
  fieldsContentColumn: {
    flexGrow: 1,
  },
  input: {
    flex: '1 1 auto',
    width: '100%',
    marginRight: theme.spacing.double,
  },
  rowContainer: {
    display: 'flex',
  },
}));

const generateEmptyRow = optionsMap => optionsMap.reduce((acc, curr) => {
  acc[curr.id] = '';

  return acc;
}, {});

const generateRowKey = obj => `${generateNewId()}-${hashCode(obj)}`;
export const generateRow = value => ({
  key: generateRowKey(value),
  value,
});
const initializeTableState = (optionsMap, ignoreEmptyRow) => value => {
  const emptyRowValue = generateEmptyRow(optionsMap);
  const emptyRow = generateRow(emptyRowValue);

  if (!value || !value.length) {
    return {

      touched: false,
      ignoreEmptyRow,
      tableStateValue: [
        emptyRow,
      ]};
  }

  return {
    touched: false,
    ignoreEmptyRow,
    tableStateValue: ignoreEmptyRow ? value.map(val => generateRow(val)) : [...value.map(val => generateRow(val)), emptyRow],
  };
};

const BaseTable = ({
  onFieldChange,
  isLoading,
  onRowChange,
  disableDeleteRows,
  optionsMapFinal,
  optionsMapInit,
  isVirtualizedTable,
  id,
  ignoreEmptyRow,
  value,
}) => {
  const [tableState, setTableState] = useReducer(reducer, value, initializeTableState(optionsMapInit, ignoreEmptyRow));

  const {touched, tableStateValue: tableValue} = tableState;
  const hashOfOptions = hashCode(optionsMapFinal);

  useEffect(() => {
    if (touched) {
      const val = preSubmit(tableValue, optionsMapFinal, ignoreEmptyRow);

      onFieldChange(id, val);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onFieldChange, hashOfOptions, tableValue, touched]);

  const isAnyColumnFetching = isLoading ? Object.values(isLoading).some(val => val) : false;

  if (isVirtualizedTable) {
    // not all tables have to be virtualized just the mapping based applications,
    // isVirtualizedTable flag comes from there

    return (
      <VirtualizedTable
        isAnyColumnFetching={isAnyColumnFetching}
        items={tableValue}
        optionsMapFinal={optionsMapFinal}
        touched={touched}
        tableState={tableState}
        ignoreEmptyRow={ignoreEmptyRow}
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
    />
    );
  }

  return (tableValue.map((arr, rowIndex) => {
    const {value, key} = arr;

    return (
      <TableRow
        key={key}
        rowValue={value}
        rowIndex={rowIndex}
        tableSize={tableValue.length}
        optionsMap={optionsMapFinal}
        touched={touched}
        ignoreEmptyRow={ignoreEmptyRow}
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
      />
    );
  }));
};
const DynaTable = props => {
  const classes = useStyles();
  const {
    label,
    value,
    className,
    hideLabel = false,
    optionsMap: optionsMapInit,
    handleRefreshClickHandler,
    handleCleanupHandler,
    hideHeaders = false,
    isLoading = false,
    metadata = {},
    id,
    ignoreEmptyRow,
    onFieldChange,
    onRowChange,
    disableDeleteRows,
    isVirtualizedTable,
    isLoggable,
  } = props;
  const optionsMapFinal = metadata.optionsMap || optionsMapInit;

  useEffect(
    () => () => {
      if (handleCleanupHandler) {
        handleCleanupHandler();
      }
    },
    [handleCleanupHandler, id]
  );

  return (
    <div className={clsx(classes.container, className)}>
      {!hideLabel && <Typography {...isLoggableAttr(isLoggable)} variant="h6">{label}</Typography>}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>
          <RefreshHeaders
            isLoggable={isLoggable}
            hideHeaders={hideHeaders}
            isLoading={isLoading}
            optionsMap={optionsMapFinal}
            handleRefreshClickHandler={handleRefreshClickHandler}
          />
          {/* do all multicolumn entry tables need to be redacted ? */}
          <span {...isLoggableAttr(isLoggable)}>
            <BaseTable
              isLoading={isLoading}
              isVirtualizedTable={isVirtualizedTable}
              onFieldChange={onFieldChange}
              onRowChange={onRowChange}
              disableDeleteRows={disableDeleteRows}
              optionsMapFinal={optionsMapFinal}
              optionsMapInit={optionsMapInit}
              id={id}
              ignoreEmptyRow={ignoreEmptyRow}
              value={value}

          />
          </span>

        </div>

      </div>
    </div>
  );
};

export default DynaTable;


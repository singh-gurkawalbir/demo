import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useReducer, useState } from 'react';
import { generateNewId } from '../../../../../utils/resource';
import { hashCode } from '../../../../../utils/string';
import reducer, { preSubmit } from './reducer';
import RefreshHeaders from './RefreshHeaders';
import TableRow from './TableRow';

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

export const generateEmptyRow = optionsMap => optionsMap.reduce((acc, curr) => {
  acc[curr.id] = '';

  return acc;
}, {});

const generateRowKey = obj => `${generateNewId()}-${hashCode(obj)}`;
export const generateRow = value => ({
  key: generateRowKey(value),
  value,
});
const initializeTableState = optionsMap => value => {
  if (!value || !value.length) {
    const value = generateEmptyRow(optionsMap);

    return {

      touched: false,
      tableStateValue: [
        generateRow(value),
      ]};
  }

  return {
    touched: false,
    tableStateValue: value.map(val => generateRow(val)),
  };
};
export const DynaTable = props => {
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
    shouldReset = false,
    metadata = {},
    id,
    onFieldChange,
    onRowChange,
    disableDeleteRows,
  } = props;
  const [shouldResetOptions, setShouldResetOptions] = useState(true);
  const [optionsMap, setOptionsMap] = useState(optionsMapInit);
  const [tableState, setTableState] = useReducer(reducer, value, initializeTableState(optionsMap));
  const {touched, tableStateValue: tableValue} = tableState;
  // isRequiredValue(tableState, optionsMap, setTableState);

  useEffect(() => {
    setShouldResetOptions(true);
  }, [shouldReset]);

  useEffect(() => {
    if (
      shouldResetOptions &&
      metadata &&
      metadata.optionsMap &&
      Array.isArray(metadata.optionsMap)
    ) {
      setOptionsMap(metadata.optionsMap);
      setShouldResetOptions(false);
    }
  }, [metadata, shouldResetOptions]);

  useEffect(
    () => () => {
      if (handleCleanupHandler) {
        handleCleanupHandler();
      }
    },
    [handleCleanupHandler, id]
  );

  useEffect(() => {
    if (touched) {
      onFieldChange(id, preSubmit(tableValue, optionsMap));
    }
  }, [id, onFieldChange, optionsMap, tableValue, touched]);

  return (
    <div className={clsx(classes.container, className)}>
      {!hideLabel && <Typography variant="h6">{label}</Typography>}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>
          <RefreshHeaders
            hideHeaders={hideHeaders}
            isLoading={isLoading}
            optionsMap={optionsMap}
            handleRefreshClickHandler={handleRefreshClickHandler}
          />
          <>
            {tableValue.map((arr, rowIndex) => {
              const {value, key} = arr;

              return (
                <TableRow
                  key={key}
                  rowValue={value}
                  rowIndex={rowIndex}
                  tableSize={tableValue.length}
                  optionsMap={optionsMap}
                  touched={touched}
                  setTableState={setTableState}
                  onRowChange={onRowChange}
                  disableDeleteRows={disableDeleteRows}
              />

              );
            })}
          </>
        </div>

      </div>
    </div>
  );
};

export default DynaTable;


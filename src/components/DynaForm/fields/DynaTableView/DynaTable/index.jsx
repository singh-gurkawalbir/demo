import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useReducer } from 'react';
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

const BaseTable = ({
  onFieldChange,
  onRowChange,
  disableDeleteRows,
  optionsMapFinal,
  optionsMapInit,
  id,
  value,
}) => {
  const [tableState, setTableState] = useReducer(reducer, value, initializeTableState(optionsMapInit));

  const {touched, tableStateValue: tableValue} = tableState;
  const hashOfOptions = hashCode(optionsMapFinal);

  useEffect(() => {
    if (touched) {
      onFieldChange(id, preSubmit(tableValue, optionsMapFinal));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onFieldChange, hashOfOptions, tableValue, touched]);

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
        setTableState={setTableState}
        onRowChange={onRowChange}
        disableDeleteRows={disableDeleteRows}
      />
    );
  }));
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
    metadata = {},
    id,
    onFieldChange,
    onRowChange,
    disableDeleteRows,
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
      {!hideLabel && <Typography variant="h6">{label}</Typography>}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>
          <RefreshHeaders
            hideHeaders={hideHeaders}
            isLoading={isLoading}
            optionsMap={optionsMapFinal}
            handleRefreshClickHandler={handleRefreshClickHandler}
          />
          <BaseTable
            onFieldChange={onFieldChange}
            onRowChange={onRowChange}
            disableDeleteRows={disableDeleteRows}
            optionsMapFinal={optionsMapFinal}
            optionsMapInit={optionsMapInit}
            id={id}
            value={value}

          />

        </div>

      </div>
    </div>
  );
};

export default DynaTable;


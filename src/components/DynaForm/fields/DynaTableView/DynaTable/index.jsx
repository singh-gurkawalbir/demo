import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useReducer } from 'react';
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
  const emptyRowValue = generateEmptyRow(optionsMap);
  const emptyRow = generateRow(emptyRowValue);

  if (!value || !value.length) {
    return {

      touched: false,
      tableStateValue: [
        emptyRow,
      ]};
  }

  return {
    touched: false,
    tableStateValue: [...value.map(val => generateRow(val)), emptyRow],
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
    isVirtualizedTable,
    dataPublic,
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
      {!hideLabel && <Typography data-public={!!dataPublic} variant="h6">{label}</Typography>}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>
          <RefreshHeaders
            dataPublic={dataPublic}
            hideHeaders={hideHeaders}
            isLoading={isLoading}
            optionsMap={optionsMapFinal}
            handleRefreshClickHandler={handleRefreshClickHandler}
          />
          <BaseTable
            isLoading={isLoading}
            isVirtualizedTable={isVirtualizedTable}
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


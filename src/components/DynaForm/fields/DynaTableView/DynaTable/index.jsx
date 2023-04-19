import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import { generateNewId } from '../../../../../utils/resource';
import { hashCode } from '../../../../../utils/string';
import reducer, { preSubmit } from './reducer';
import RefreshHeaders from './RefreshHeaders';
import TableRow from './TableRow';
import VirtualizedTable from './VirtualizedTable';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { emptyObject } from '../../../../../constants';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
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
    isValid: true,
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
  formKey,
  invalidateParentFieldOnError,
  isShowValidationBeforeTouched,
  setIsValid,
}) => {
  const dispatch = useDispatch();
  const [tableState, setTableState] = useReducer(reducer, value, initializeTableState(optionsMapInit, ignoreEmptyRow));
  const {touched, tableStateValue: tableValue, isValid, rowIndex} = tableState;
  const hashOfOptions = hashCode(optionsMapFinal);

  // Adding the condition in the useEffect, so that when ever the isShowValidationBeforeTouched has been set to true, we will be triggering the below dispatch calls inorder to force state the following values to the form inorder to validate it based on the isValid property.
  useEffect(() => {
    if (invalidateParentFieldOnError) {
      if ((isShowValidationBeforeTouched && tableValue.length === 1) || tableValue.length > 1) {
        setIsValid(isValid);
        dispatch(actions.form.forceFieldState(formKey)(id, {isValid, required: !isValid}));
      }
    }
  }, [isValid, rowIndex, isShowValidationBeforeTouched, dispatch, formKey, id, setIsValid, tableValue, invalidateParentFieldOnError]);

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
        invalidateParentFieldOnError={invalidateParentFieldOnError}
        setIsValid={setIsValid}
        rowHeight={64}
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
        invalidateParentFieldOnError={invalidateParentFieldOnError}
        setIsValid={setIsValid}
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
    formKey,
    required,
    invalidateParentFieldOnError,
  } = props;
  const optionsMapFinal = metadata.optionsMap || optionsMapInit;

  const [isValid, setIsValid] = useState(true);

  // Fetching isShowValidationBeforeTouched property in order to forceState the isValid property to true when there are required fields from the settingsForm so that we could validate the form on the initial render
  const {showValidationBeforeTouched } = useSelector(state => selectors.formState(state, formKey) || emptyObject);

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
      {!hideLabel && (
      <FormLabel {...isLoggableAttr(isLoggable)} required={invalidateParentFieldOnError ? required : ''} error={invalidateParentFieldOnError ? !isValid : ''} >
        {label}
      </FormLabel>
      )}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>
          <RefreshHeaders
            isLoggable={isLoggable}
            hideHeaders={hideHeaders}
            isLoading={isLoading}
            optionsMap={optionsMapFinal}
            handleRefreshClickHandler={handleRefreshClickHandler}
            required={required}
          />
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
              formKey={formKey}
              invalidateParentFieldOnError={invalidateParentFieldOnError}
              isShowValidationBeforeTouched={showValidationBeforeTouched}
              setIsValid={setIsValid}
          />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynaTable;


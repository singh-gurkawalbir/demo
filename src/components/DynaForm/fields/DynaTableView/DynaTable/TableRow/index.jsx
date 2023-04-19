import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DynaSelect from '../../../DynaSelect';
import DynaMultiSelect from '../../../DynaMultiSelect';
import DeleteIcon from '../../../../../icons/TrashIcon';
import ActionButton from '../../../../../ActionButton';
import actionTypes from '../actionTypes';
import DynaAutocomplete from '../../../DynaAutocomplete';
import DynaExportSelect from '../../../DynaExportSelect';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: theme.spacing(1),
  },
  columnsWrapper: {
    width: `calc(100% - ${theme.spacing(4)})`,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '8px',
    marginBottom: theme.spacing(1),
  },
  refreshIcon: {
    cursor: 'pointer',
  },
  dynaTableActions: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(1),
  },
  bodyElementsWrapper: {
    display: 'flex',
    paddingRight: theme.spacing(1),
  },
  child: {
    '& + div': {
      width: '100%',
    },
  },
  childHeader: {
    '& > div': {
      width: '100%',
    },
  },
  root: {
    display: 'flex',
  },
  menuItemsWrapper: {
    minWidth: 300,
    '& > div': {
      '& >.MuiMenuItem-root': {
        wordWrap: 'break-word',
        whiteSpace: 'normal',
      },
    },
  },
  refreshButton: {
    '& .MuiButtonBase-root': {
      marginTop: 0,
    },
  },
}));
const TYPE_TO_ERROR_MESSAGE = {
  input: 'Please enter a value',
  number: 'Please enter a number',
  text: 'Please enter a value',
  autosuggest: 'Please select a value',
  select: 'Please select a value',
  exportSelect: 'Please select a value',
};

const convertToSelectOptions = options => options.filter(Boolean).map(opt => ({
  label: Array.isArray(opt) ? opt[1] : opt.text || opt.label,
  value: Array.isArray(opt) ? opt[0] : opt.id || opt.value,
}));

Object.freeze(TYPE_TO_ERROR_MESSAGE);
const RowCell = ({ fieldValue, optionsMap, op, isValid, rowIndex, colIndex, setTableState, onRowChange, invalidateParentFieldOnError, setIsValid}) => {
  const {id, readOnly, options, type } = op;
  const classes = useStyles();

  // Update handler. Listens to change in any field and dispatches action to update state

  const handleUpdate = useCallback(value => {
    setTableState({
      type: actionTypes.UPDATE_TABLE_ROW,
      rowIndex,
      field: id,
      value,
      optionsMap,
      onRowChange,
      invalidateParentFieldOnError,
      setIsValid,
    });
  }, [id, onRowChange, optionsMap, rowIndex, setTableState, invalidateParentFieldOnError, setIsValid]);

  const fieldTestAttr = `text-suggest-${id}-${rowIndex}`;
  const errorMessages = TYPE_TO_ERROR_MESSAGE[type];

  const translatedOptions = useMemo(() => {
    if (!options) return [];

    const items = convertToSelectOptions(options);

    if (type === 'select' || type === 'multiselect' || type === 'exportSelect') {
      return [{items}];
    }

    return items;
  }, [options, type]);

  const onFieldChange = useCallback((id, value) => {
    handleUpdate(value);
  }, [handleUpdate]);

  const onNumberChange = useCallback(evt => {
    handleUpdate(evt.target.value);
  }, [handleUpdate]);

  const basicProps = useMemo(() => ({
    isValid,
    id: fieldTestAttr,
    disabled: readOnly,
    options: translatedOptions,
  }), [fieldTestAttr, isValid, readOnly, translatedOptions]);

  if (type === 'select') {
    return (
      <DynaSelect
        {...basicProps}
        value={fieldValue}
        errorMessages={errorMessages}
        onFieldChange={onFieldChange}
        className={clsx(classes.root, classes.menuItemsWrapper)}
    />
    );
  }
  if (type === 'multiselect') {
    return (
      <DynaMultiSelect
        {...basicProps}
        value={fieldValue}
        errorMessages={errorMessages}
        onFieldChange={onFieldChange}
        className={clsx(classes.root, classes.menuItemsWrapper)}
    />
    );
  }

  if (type === 'exportSelect') {
    return (
      <DynaExportSelect
        {...basicProps}
        {...op}
        /* When the staticMap is being used and it has an type property as exportSelect in the optionMap
        we are setting the isRequiredProperty to false in order to avoid the allignement issue between the table cells */
        required={invalidateParentFieldOnError ? false : (op.required || basicProps.required)}
        value={fieldValue}
        errorMessages={errorMessages}
        onFieldChange={onFieldChange}
        className={classes.refreshButton}
    />
    );
  }

  if (type === 'number') {
    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <TextField
          {...basicProps}
          variant="filled"
          value={fieldValue}
          helperText={
            !isValid && errorMessages
          }
          error={!isValid}
          type="number"
          onChange={onNumberChange}
        />
      </div>
    );
  }

  if (['input', 'text', 'autosuggest'].includes(type)) {
    const multiline = optionsMap?.find(({id}) => id === colIndex)?.multiline;

    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <DynaAutocomplete
          {...basicProps}
          multiline={multiline}
          onFieldChange={onFieldChange}
          errorMessages={errorMessages}
          value={fieldValue}
          labelName="label"
          valueName="value"
          onBlur={onFieldChange}
    />
      </div>
    );
  }

  return null;
};

export const isCellValid = ({fieldValue, required, touched}) => {
  if (!touched) return true;
  if (touched && required && !fieldValue) return false;

  return !required || (required && fieldValue);
};

const RowCellMemo = ({
  fieldValue,
  optionsMap,
  colIndex,
  op,
  touched,
  rowIndex,
  tableSize,
  setTableState,
  onRowChange,
  invalidateParentFieldOnError,
  setIsValid,
}) => {
  const {required } = op;
  const isValid = isCellValid({fieldValue, required, rowIndex, tableSize, touched});

  return useMemo(() => (
    <RowCell
      invalidateParentFieldOnError={invalidateParentFieldOnError}
      optionsMap={optionsMap}
      fieldValue={fieldValue}
      op={op}
      isValid={isValid}
      rowIndex={rowIndex}
      setTableState={setTableState}
      onRowChange={onRowChange}
      colIndex={colIndex}
      setIsValid={setIsValid}
  />
  ), [colIndex, fieldValue, isValid, onRowChange, op, optionsMap, rowIndex, setTableState, invalidateParentFieldOnError, setIsValid]);
};

const ActionButtonMemo = ({disableDeleteRows, rowIndex, setTableState, classes, invalidateParentFieldOnError, optionsMap}) =>
  useMemo(() => (
    <ActionButton
      tooltip=""
      disabled={disableDeleteRows}
      data-test={`deleteTableRow-${rowIndex}`}
      aria-label="delete"
      onClick={() => {
        setTableState({ type: actionTypes.REMOVE_TABLE_ROW, rowIndex, invalidateParentFieldOnError, optionsMap });
      }}
      className={classes.margin}>
      <DeleteIcon fontSize="small" />
    </ActionButton>
  ), [classes.margin, disableDeleteRows, rowIndex, setTableState, invalidateParentFieldOnError, optionsMap]);
export default function TableRow({
  rowValue,
  rowIndex,
  tableSize,
  optionsMap,
  touched,
  setTableState,
  onRowChange,
  ignoreEmptyRow,
  invalidateParentFieldOnError,
  disableDeleteRows,
  setIsValid,
}) {
  const classes = useStyles();
  const isNotLastRow = rowIndex !== tableSize - 1;

  return (
    <div className={classes.bodyElementsWrapper} data-test={`row-${rowIndex}`}>
      <div className={classes.columnsWrapper}>
        {optionsMap.map((op, index) => (
          <div
            key={op.id}
            data-test={`col-${index}`}
          >
            <RowCellMemo
              invalidateParentFieldOnError={invalidateParentFieldOnError}
              optionsMap={optionsMap}
              op={op}
              fieldValue={rowValue[op.id]}
              touched={touched}
              rowIndex={rowIndex}
              colIndex={op.id}
              tableSize={tableSize}
              setTableState={setTableState}
              onRowChange={onRowChange}
              setIsValid={setIsValid}
          />
          </div>
        )
        )}

      </div>
      {isNotLastRow && !ignoreEmptyRow && (
      <div key="delete_button" className={classes.dynaTableActions}>
        <ActionButtonMemo
          disableDeleteRows={disableDeleteRows}
          rowIndex={rowIndex}
          optionsMap={optionsMap}
          setTableState={setTableState}
          invalidateParentFieldOnError={invalidateParentFieldOnError}
          classes={classes}
        />
      </div>
      )}
    </div>
  );
}

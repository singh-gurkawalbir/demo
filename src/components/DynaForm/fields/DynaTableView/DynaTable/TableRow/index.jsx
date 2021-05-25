import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles, TextField } from '@material-ui/core';
import DynaSelect from '../../../DynaSelect';
import DeleteIcon from '../../../../../icons/TrashIcon';
import DynaTypeableSelect from '../../../DynaTypeableSelect';
import ActionButton from '../../../../../ActionButton';
import actionTypes from '../actionTypes';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: theme.spacing(1),
  },
  columnsWrapper: {
    width: '95%',
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
}));
const TYPE_TO_ERROR_MESSAGE = {
  input: 'Please enter a value',
  number: 'Please enter a number',
  text: 'Please enter a value',
  autosuggest: 'Please select a value',
  select: 'Please select a value',
};

const convertToSelectOptions = options => options.filter(Boolean).map(opt => ({
  label: Array.isArray(opt) ? opt[1] : opt.text || opt.label,
  value: Array.isArray(opt) ? opt[0] : opt.id || opt.value,
}));

Object.freeze(TYPE_TO_ERROR_MESSAGE);
const RowCell = ({ fieldValue, optionsMap, op, isValid, rowIndex, setTableState, onRowChange, isVirtualizedTable}) => {
  const {id, readOnly, options, type } = op;
  const classes = useStyles();

  // Update handler. Listens to change in any field and dispatches action to update state

  const handleUpdate = useCallback(value => {
    setTableState({
      type: actionTypes.UPDATE_TABLE_ROW,
      index: rowIndex,
      field: id,
      value,
      optionsMap,
      onRowChange,
    });
  }, [id, onRowChange, optionsMap, rowIndex, setTableState]);

  const fieldTestAttr = `suggest-${id}-${rowIndex}`;
  const errorMessages = TYPE_TO_ERROR_MESSAGE[type];

  const translatedOptions = useMemo(() => {
    if (!options) return [];

    const items = convertToSelectOptions(options);

    if (type === 'select') {
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
    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <DynaTypeableSelect
          {...basicProps}
          updateOnUnmount={isVirtualizedTable ? onFieldChange : null}
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

const RowCellMemo = ({ fieldValue, optionsMap, op, touched, rowIndex, tableSize, setTableState, onRowChange, isVirtualizedTable}) => {
  const {required } = op;

  const isCellValid = useCallback(() => {
    if (rowIndex === tableSize - 1 || !touched) { return true; }

    return !required || (required && fieldValue);
  }, [fieldValue, required, rowIndex, tableSize, touched]);

  const isValid = isCellValid();

  return useMemo(() => (
    <RowCell
      isVirtualizedTable={isVirtualizedTable}
      optionsMap={optionsMap}
      fieldValue={fieldValue}
      op={op}
      isValid={isValid}
      rowIndex={rowIndex}
      setTableState={setTableState}
      onRowChange={onRowChange}
  />
  ), [fieldValue, isValid, isVirtualizedTable, onRowChange, op, optionsMap, rowIndex, setTableState]);
};

const ActionButtonMemo = ({disableDeleteRows, rowIndex, setTableState, classes}) =>
  useMemo(() => (
    <ActionButton
      tooltip=""
      disabled={disableDeleteRows}
      data-test={`deleteTableRow-${rowIndex}`}
      aria-label="delete"
      onClick={() => {
        setTableState({ type: actionTypes.REMOVE_TABLE_ROW, index: rowIndex });
      }}
      className={classes.margin}>
      <DeleteIcon fontSize="small" />
    </ActionButton>
  ), [classes.margin, disableDeleteRows, rowIndex, setTableState]);
export default function TableRow({
  rowValue,
  rowIndex,
  tableSize,
  optionsMap,
  touched,
  setTableState,
  onRowChange,
  disableDeleteRows,
  isVirtualizedTable,
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
              isVirtualizedTable={isVirtualizedTable}
              optionsMap={optionsMap}
              op={op}
              fieldValue={rowValue[op.id]}
              touched={touched}
              rowIndex={rowIndex}
              tableSize={tableSize}
              setTableState={setTableState}
              onRowChange={onRowChange}
          />
          </div>
        )
        )}

      </div>
      {isNotLastRow && (
      <div
        key="delete_button"
        className={classes.dynaTableActions}>
        <ActionButtonMemo
          disableDeleteRows={disableDeleteRows}
          rowIndex={rowIndex}
          setTableState={setTableState}
          classes={classes}
        />
      </div>
      )}
    </div>
  );
}

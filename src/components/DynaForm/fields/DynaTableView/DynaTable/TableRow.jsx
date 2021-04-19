import React, {useCallback} from 'react';
import clsx from 'clsx';
import { makeStyles, TextField } from '@material-ui/core';
import DynaSelect from '../../DynaSelect';
import DeleteIcon from '../../../../icons/TrashIcon';
import DynaTypeableSelect from '../../DynaTypeableSelect';
import ActionButton from '../../../../ActionButton';

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
}));
const TYPE_TO_ERROR_MESSAGE = {
  input: 'Please enter a value',
  number: 'Please enter a number',
  text: 'Please enter a value',
  autosuggest: 'Please select a value',
};

Object.freeze(TYPE_TO_ERROR_MESSAGE);

export default function RefreshHeaders({
  arr,
  rowIndex,
  rowCollection,
  optionsMap,
  touched,
  setTableState,
  onRowChange,
  disableDeleteRows,
}) {
  const classes = useStyles();
  // Update handler. Listens to change in any field and dispatches action to update state
  const handleUpdate = useCallback(
    (row, value, field) => {
      setTableState({
        type: 'updateField',
        index: row,
        field,
        value,
        onRowChange,
      });
    },
    [onRowChange, setTableState]
  );

  return (
    <div className={classes.bodyElementsWrapper} data-test={`row-${rowIndex}`}>
      <div className={classes.columnsWrapper}>
        {arr.values.map((r, index) => (
          <div
            key={`${r.readOnly ? r.value || r.id : r.id}`}
            data-test={`col-${index}`}
      >
            {r.type === 'select' && (
            <DynaSelect
              id={`suggest-${r.id}-${arr.row}`}
              value={r.value}
              isValid={
              !touched || !optionsMap[index].required ||
                (optionsMap[index].required && r.value)
            }
              errorMessages="Please select a value"
              options={r.options || []}
              onFieldChange={(id, value) => {
                handleUpdate(arr.row, value, r.id);
              }}
              className={clsx(classes.root, classes.menuItemsWrapper)}
          />
            )}
            {['input', 'number', 'text', 'autosuggest'].includes(
              r.type
            ) && (
            <div
              className={clsx(classes.childHeader, classes.childRow)}>
              {r.type === 'number' ? (
                <TextField
                  variant="filled"
                  id={`suggest-${r.id}-${arr.row}`}
                  key={`suggest-${r.id}-${arr.key}`}
                  defaultValue={r.value || 0}
                  disabled={r.readOnly}
                  helperText={
                  r.required &&
                  r.value === '' &&
                  TYPE_TO_ERROR_MESSAGE[r.type]
                }
                  error={r.required && r.value === ''}
                  type={r.type}
                  options={r.options}
                  onBlur={evt => {
                    handleUpdate(arr.row, evt.target.value, r.id);
                  }}
              />
              ) : (
                <DynaTypeableSelect
                  id={`suggest-${r.id}-${arr.row}`}
                  key={`suggest-${r.id}-${arr.key}`}
                  value={r.value}
                  labelName="label"
                  disabled={r.readOnly}
                  isValid={
                  !optionsMap[index].required ||
                  (rowIndex === rowCollection.length - 1 ||
                    (optionsMap[index].required && r.value))
                }
                  errorMessages={
                  TYPE_TO_ERROR_MESSAGE[r.type] ||
                  'Please enter a value'
                }
                  valueName="value"
                  options={r.options}
                  onBlur={(id, evt) => {
                    handleUpdate(arr.row, evt, r.id);
                  }}
              />
              )}
            </div>
            )}
          </div>
        )
        )}

      </div>
      {rowIndex !== rowCollection.length - 1 && (
      <div
        key="delete_button"
        className={classes.dynaTableActions}>
        <ActionButton
          disabled={disableDeleteRows}
          data-test={`deleteTableRow-${arr.rowIndex}`}
          aria-label="delete"
          onClick={() => {
            setTableState({ type: 'remove', index: rowIndex });
          }}
          className={classes.margin}>
          <DeleteIcon fontSize="small" />
        </ActionButton>
      </div>
      )}
    </div>
  );
}

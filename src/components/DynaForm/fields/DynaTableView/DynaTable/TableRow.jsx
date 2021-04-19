import React from 'react';
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

Object.freeze(TYPE_TO_ERROR_MESSAGE);
const RowCell = ({index, r, optionsMap, touched, arr, rowIndex, rowCollection, setTableState, onRowChange}) => {
  const classes = useStyles();

  // Update handler. Listens to change in any field and dispatches action to update state

  const handleUpdate = value => {
    setTableState({
      type: 'updateField',
      index: arr.row,
      field: r.id,
      value,
      onRowChange,
    });
  };

  const isCellValid = () => {
    if (rowIndex === rowCollection.length - 1 || !touched) { return true; }

    return !optionsMap[index].required ||
        (optionsMap[index].required && r.value);
  };
  const isValid = isCellValid();

  const id = `suggest-${r.id}-${arr.row}`;
  const errorMessages = TYPE_TO_ERROR_MESSAGE[r.type];
  const basicProps = {
    isValid,
    id,
    errorMessages,
    disabled: r.readOnly,
    options: r.options || [],
    value: r.value,
  };

  if (r.type === 'select') {
    return (
      <DynaSelect
        {...basicProps}
        onFieldChange={(id, value) => {
          handleUpdate(value);
        }}
        className={clsx(classes.root, classes.menuItemsWrapper)}
    />
    );
  }

  if (r.type === 'number') {
    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <TextField
          {...basicProps}
          variant="filled"
          value={r.value || 0}
          helperText={
            !isValid && errorMessages
          }
          error={!isValid}
          type="number"
          onBlur={evt => {
            handleUpdate(evt.target.value);
          }}
        />
      </div>
    );
  }

  if (['input', 'text', 'autosuggest'].includes(r.type)) {
    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <DynaTypeableSelect
          {...basicProps}
          labelName="label"
          valueName="value"
          onBlur={(id, value) => {
            handleUpdate(value);
          }}
    />
      </div>
    );
  }

  return null;
};
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

  return (
    <div className={classes.bodyElementsWrapper} data-test={`row-${rowIndex}`}>
      <div className={classes.columnsWrapper}>
        {arr.values.map((r, index) => (
          <div
            key={`${r.readOnly ? r.value || r.id : r.id}`}
            data-test={`col-${index}`}
          >
            <RowCell
              r={r}
              index={index}
              optionsMap={optionsMap}
              touched={touched}
              arr={arr}
              rowIndex={rowIndex}
              rowCollection={rowCollection}
              setTableState={setTableState}
              onRowChange={onRowChange}
          />
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

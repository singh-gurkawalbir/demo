import React, { useMemo } from 'react';
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

const convertToSelectOptions = options => options.filter(Boolean).map(opt => ({
  label: Array.isArray(opt) ? opt[1] : opt.text || opt.label,
  value: Array.isArray(opt) ? opt[0] : opt.id || opt.value,
}));

Object.freeze(TYPE_TO_ERROR_MESSAGE);
const RowCell = ({ fieldValue, op, touched, rowIndex, tableSize, setTableState, onRowChange}) => {
  const {id, readOnly, required, options, type } = op;
  const classes = useStyles();

  // Update handler. Listens to change in any field and dispatches action to update state

  const handleUpdate = value => {
    setTableState({
      type: 'updateField',
      index: rowIndex,
      field: id,
      value,
      onRowChange,
    });
  };

  const isCellValid = () => {
    if (rowIndex === tableSize - 1 || !touched) { return true; }

    return !required || (required && fieldValue);
  };
  const isValid = isCellValid();

  const fieldTestAttr = `suggest-${rowIndex}-${id}`;
  const errorMessages = TYPE_TO_ERROR_MESSAGE[type];

  const translatedOptions = useMemo(() => {
    if (!options) return [];

    const items = convertToSelectOptions(options);

    if (type === 'select') {
      return [{items}];
    }

    return items;
  }, [options, type]);
  const basicProps = {
    isValid,
    id: fieldTestAttr,
    errorMessages,
    disabled: readOnly,
    options: translatedOptions,
    value: fieldValue,
  };

  if (type === 'select') {
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

  if (type === 'number') {
    return (
      <div
        className={clsx(classes.childHeader, classes.childRow)}>
        <TextField
          {...basicProps}
          variant="filled"
          value={fieldValue || 0}
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

  if (['input', 'text', 'autosuggest'].includes(type)) {
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
  rowValue,
  rowIndex,
  tableSize,
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
        {optionsMap.map((op, index) => (
          <div
            key={op.id}
            data-test={`col-${index}`}
          >
            <RowCell
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
      {rowIndex !== tableSize - 1 && (
      <div
        key="delete_button"
        className={classes.dynaTableActions}>
        <ActionButton
          tooltip=""
          disabled={disableDeleteRows}
          data-test={`deleteTableRow-${rowIndex}`}
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

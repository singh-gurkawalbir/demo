import React, { useReducer, useEffect, useState, useCallback, Fragment } from 'react';
import produce from 'immer';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import Spinner from '../../../Spinner';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaSelect from '../DynaSelect';
import DeleteIcon from '../../../icons/TrashIcon';
import DynaTypeableSelect from '../DynaTypeableSelect';
import ActionButton from '../../../ActionButton';

const TYPE_TO_ERROR_MESSAGE = {
  input: 'Please enter a value',
  number: 'Please enter a number',
  text: 'Please enter a value',
  autosuggest: 'Please select a value',
};

Object.freeze(TYPE_TO_ERROR_MESSAGE);

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
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
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: theme.spacing(1),
  },
  bodyElementsWrapper: {
    display: 'flex',
  },
  dynaTableActions: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(1),
  },
  columnsWrapper: {
    width: '95%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '8px',
    marginBottom: theme.spacing(1),
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
  refreshIcon: {
    cursor: 'pointer',
  },
}));

function reducer(state, action) {
  const {
    type,
    value,
    index,
    field,
    lastRowData = {},
    setChangeIdentifier,
    onRowChange,
  } = action;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'remove':
        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);
        draft.splice(index, 1);
        break;
      case 'addNew':
        draft.push(lastRowData);
        break;
      case 'updateField':
        if (state[index]) {
          if (onRowChange) {
            // eslint-disable-next-line no-param-reassign
            draft[index] = onRowChange(state[index], field, value);
          } else {
            draft[index][field] = value;
          }
        } else {
          lastRowData[field] = value;
          draft.push(lastRowData);
        }

        break;
    }
  });
}

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
    touched,
    disableDeleteRows,
  } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [shouldResetOptions, setShouldResetOptions] = useState(true);
  const [optionsMap, setOptionsMap] = useState(optionsMapInit);
  const requiredFields = (optionsMap || []).filter(option => !!option.required);
  const lastRow = {};
  const preSubmit = useCallback(
    (stateValue = []) =>
      stateValue.filter(val => {
        let allRequiredFieldsPresent = true;

        optionsMap.forEach(op => {
          if (op.required) allRequiredFieldsPresent = allRequiredFieldsPresent && !!val[op.id];
        });

        return allRequiredFieldsPresent;
      }),
    [optionsMap]
  );
  let requiredFieldsMissing = false;

  if (!requiredFields.length) {
    // If none of the options are marked as required, consider the first option as required.
    // when there are no required fields mentioned, an empty last row will be added recursively in infinite loop.
    requiredFields.push(optionsMap[0]);
  }

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
      setChangeIdentifier(changeIdentifier + 1);
      setShouldResetOptions(false);
    }
  }, [changeIdentifier, metadata, shouldResetOptions]);

  useEffect(
    () => () => {
      if (handleCleanupHandler) {
        handleCleanupHandler();
      }
    },
    [handleCleanupHandler, id]
  );
  const [state, dispatchLocalAction] = useReducer(reducer, value || []);

  // If Value is present, check if there are required fields missing in the last row
  if (state.length) {
    (requiredFields || []).forEach(field => {
      if (!state[state.length - 1][field.id]) {
        requiredFieldsMissing = true;
      }
    });
  }

  // If all required fields are present in last row, add a dummy row at the end so user can enter values
  if (!requiredFieldsMissing) {
    optionsMap.forEach(option => {
      lastRow[option.id] =
        option.type === 'select' || option.type === 'autosuggest'
          ? undefined
          : '';
    });
    dispatchLocalAction({ type: 'addNew', lastRowData: lastRow });
  }

  // Convert the value to react form readable format
  const tableData = state.map((value, index) => {
    const arr = optionsMap.map(op => {
      let modifiedOptions;

      if ((op.options || []).length) {
        const items = op.options.filter(Boolean).map(opt => ({
          label: Array.isArray(opt) ? opt[1] : opt.text || opt.label,
          value: Array.isArray(opt) ? opt[0] : opt.id || opt.value,
        }));
        const options =
          op.type === 'select'
            ? [
              {
                items,
              },
            ]
            : items;

        modifiedOptions = {
          options,
        };
      }

      return {
        ...op,
        ...modifiedOptions,
        value: value[op.id],
      };
    });

    return { values: arr, row: index };
  });
  // Update handler. Listens to change in any field and dispatches action to update state
  const handleUpdate = useCallback(
    (row, value, field) => {
      const { id, onFieldChange, onRowChange } = props;

      dispatchLocalAction({
        type: 'updateField',
        index: row,
        field,
        value,
        setChangeIdentifier,
        lastRowData: (value || []).length ? value[value.length - 1] : {},
        onRowChange,
      });

      if (state[row]) {
        const fieldValueToSet = preSubmit([
          ...state.slice(0, row),
          onRowChange
            ? onRowChange(state[row], field, value)
            : { ...state[row], ...{ [field]: value } },
          ...state.slice(row + 1, state.length),
        ]);

        onFieldChange(id, fieldValueToSet);
      }
    },
    [preSubmit, props, state]
  );

  function handleRefreshClick(e, fieldId) {
    if (handleRefreshClickHandler) {
      handleRefreshClickHandler(fieldId);
    }
  }

  function dispatchActionToDelete(e, index) {
    const { id, onFieldChange } = props;

    dispatchLocalAction({ type: 'remove', index, setChangeIdentifier });
    const stateCopy = [...state];

    stateCopy.splice(index, 1);

    onFieldChange(id, preSubmit(stateCopy));
  }

  const onFetchResource = id => e => handleRefreshClick(e, id);
  const handleRemoveRow = row => e => dispatchActionToDelete(e, row);

  return (
    <div className={clsx(classes.container, className)}>
      {!hideLabel && <Typography variant="h6">{label}</Typography>}
      <div data-test={id} className={classes.root} >
        <div className={classes.fieldsContentColumn}>

          {!hideHeaders && (
          <div className={classes.columnsWrapper}>
            {optionsMap.map(r => (
              <div className={classes.header} key={r.id}>
                <span className={classes.label}>{r.label || r.name}</span>
                {r.supportsRefresh && !isLoading?.[r.id] && (
                  <RefreshIcon className={classes.refreshIcon} onClick={onFetchResource(r.id)} />
                )}
                {r.supportsRefresh && isLoading?.[r.id] && (
                  <Spinner />
                )}
              </div>
            ))}

          </div>
          )}
          <Fragment key={changeIdentifier}>
            {tableData.map((arr, rowIndex, rowCollection) => (

              <div key={arr.row} className={classes.bodyElementsWrapper} data-test={`row-${rowIndex}`}>
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
                            key={`suggest-${r.id}-${arr.row}-${r.value}-${r.optionChangeIdentifer}`}
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
                            key={`suggest-${r.id}-${arr.row}-${r.value}-${r.optionChangeIdentifer}`}
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
                  ))}

                </div>

                <div
                  key="delete_button"
                  className={classes.dynaTableActions}>
                  <ActionButton
                    disabled={disableDeleteRows}
                    data-test={`deleteTableRow-${arr.row}`}
                    aria-label="delete"
                    onClick={handleRemoveRow(arr.row)}
                    className={classes.margin}>
                    <DeleteIcon fontSize="small" />
                  </ActionButton>
                </div>
              </div>
            ))}
          </Fragment>
        </div>

      </div>
    </div>
  );
};

export default DynaTable;

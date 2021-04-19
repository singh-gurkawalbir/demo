import React, { useReducer, useEffect, useState, useCallback, Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import Spinner from '../../../../Spinner';
import RefreshIcon from '../../../../icons/RefreshIcon';
import DynaSelect from '../../DynaSelect';
import DeleteIcon from '../../../../icons/TrashIcon';
import DynaTypeableSelect from '../../DynaTypeableSelect';
import ActionButton from '../../../../ActionButton';
import reducer, { preSubmit } from './reducer';
import { generateNewId } from '../../../../../utils/resource';
import { hashCode } from '../../../../../utils/string';

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

export const generateEmptyRow = optionsMap => {
  console.log('see ', optionsMap);

  return optionsMap.reduce((acc, curr) => {
    acc[curr.id] = '';

    return acc;
  }, {});
};

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

  // Convert the value to react form readable format
  const tableData = tableValue.map((value, index) => {
    const {key, value: actValue } = value;
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
        value: actValue[op.id],
      };
    });

    return { values: arr, row: index, key };
  });
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
    [onRowChange]
  );

  useEffect(() => {
    if (touched) {
      onFieldChange(id, preSubmit(tableValue, optionsMap));
    }
  }, [id, onFieldChange, optionsMap, tableValue, touched]);
  function handleRefreshClick(e, fieldId) {
    if (handleRefreshClickHandler) {
      handleRefreshClickHandler(fieldId);
    }
  }

  const onFetchResource = id => e => handleRefreshClick(e, id);

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
          <>
            {tableData.map((arr, rowIndex, rowCollection) => (

              <div key={arr.key} className={classes.bodyElementsWrapper} data-test={`row-${rowIndex}`}>
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
            ))}
          </>
        </div>

      </div>
    </div>
  );
};

export default DynaTable;


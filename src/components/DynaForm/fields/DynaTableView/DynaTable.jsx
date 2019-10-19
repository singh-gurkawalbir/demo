import Input from '@material-ui/core/Input';
import { useReducer, useEffect, useState } from 'react';
import produce from 'immer';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '../../../../components/icons/CloseIcon';
import Spinner from '../../../Spinner';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaSelect from '../DynaSelect';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  tableBody: {
    paddingLeft: '7px',
  },
  root: {
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
            draft = onRowChange(state, index, field, value);
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

export default function DynaTable(props) {
  const classes = useStyles();
  const {
    label,
    value,
    hideLabel = false,
    optionsMap: optionsMapInit,
    handleRefreshClickHandler,
    handleCleanupHandler,
    hideHeaders = false,
    isLoading = false,
    shouldReset = false,
    metadata = {},
    id,
  } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [shouldResetOptions, setShouldResetOptions] = useState(true);
  const [optionsMap, setOptionsMap] = useState(optionsMapInit);
  const requiredFields = (optionsMap || []).filter(option => !!option.required);
  const lastRow = {};
  const preSubmit = (stateValue = []) =>
    stateValue.filter(val => {
      let allRequiredFieldsPresent = true;

      optionsMap.forEach(op => {
        if (op.required)
          allRequiredFieldsPresent = allRequiredFieldsPresent && !!val[op.id];
      });

      return allRequiredFieldsPresent;
    });
  let requiredFieldsMissing = false;

  if (!requiredFields.length) {
    // If none of the options are marked as required, consider the first option as required
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
      lastRow[option.id] = option.type === 'select' ? undefined : '';
    });
    dispatchLocalAction({ type: 'addNew', lastRowData: lastRow });
  }

  // Convert the value to react form readable format
  const tableData = state.map((value, index) => {
    const arr = optionsMap.map(op => {
      let modifiedOptions;

      if ((op.options || []).length) {
        modifiedOptions = {
          options: [
            {
              // Filter out non-truthy values from options. IA sends [null] as initial options for select and multisselect fields
              items: op.options.filter(Boolean).map(opt => ({
                label: opt.text || opt.label,
                value: opt.id || opt.value,
              })),
            },
          ],
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
  const handleUpdate = (row, event, field) => {
    const newValue = event.target.value;
    const { id, onFieldChange, onRowChange } = props;

    dispatchLocalAction({
      type: 'updateField',
      index: row,
      field,
      value: newValue,
      setChangeIdentifier,
      lastRowData: (value || []).length ? value[value.length - 1] : {},
      onRowChange,
    });

    if (state[row]) {
      const fieldValueToSet = onRowChange
        ? onRowChange(state, row, field, newValue)
        : preSubmit([
            ...state.slice(0, row),
            { ...state[row], ...{ [field]: newValue } },
            ...state.slice(row + 1, state.length),
          ]);

      onFieldChange(id, fieldValueToSet);
    }
  };

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

  const handleAllUpdate = (row, id) => event => handleUpdate(row, event, id);
  const onFetchResource = id => e => handleRefreshClick(e, id);
  const handleRemoveRow = row => e => dispatchActionToDelete(e, row);

  return (
    <div className={classes.container}>
      {!hideLabel && <Typography variant="h6">{label}</Typography>}
      <Grid data-test={id} container className={classes.root} spacing={2}>
        {!hideHeaders && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {optionsMap.map(r => (
                <Grid key={r.id} item xs={r.space || true}>
                  <span>{r.label || r.name}</span>
                  {r.supportsRefresh && !isLoading && (
                    <RefreshIcon onClick={onFetchResource(r.id)} />
                  )}
                  {r.supportsRefresh && isLoading && <Spinner />}
                </Grid>
              ))}
              <Grid key="delete_button_header" item />
            </Grid>
          </Grid>
        )}
        <Grid
          container
          spacing={2}
          key={changeIdentifier}
          className={classes.tableBody}
          direction="column">
          {tableData.map(arr => (
            <Grid item className={classes.rowContainer} key={arr.row}>
              <Grid container direction="row" spacing={2}>
                {arr.values.map(r => (
                  <Grid
                    item
                    key={r.readOnly ? r.value || r.id : r.id}
                    xs={r.space || true}>
                    {['input', 'text', 'number'].includes(r.type) && (
                      <Input
                        defaultValue={r.value}
                        placeholder={r.id}
                        readOnly={!!r.readOnly}
                        type={r.type === 'input' ? 'text' : r.type}
                        className={classes.input}
                        onChange={handleAllUpdate(arr.row, r.id)}
                      />
                    )}
                    {r.type === 'select' && (
                      <DynaSelect
                        value={r.value}
                        placeholder={r.id}
                        options={r.options || []}
                        onFieldChange={(id, evt) => {
                          handleUpdate(
                            arr.row,
                            { target: { value: evt } },
                            r.id
                          );
                        }}
                        className={classes.root}
                      />
                    )}
                  </Grid>
                ))}
                <Grid item key="delete_button">
                  <IconButton
                    data-test="deleteTableRow"
                    aria-label="delete"
                    onClick={handleRemoveRow(arr.row)}
                    className={classes.margin}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

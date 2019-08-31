import Input from '@material-ui/core/Input';
import { useReducer, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Spinner from '../../../Spinner';
import DynaSelect from '../DynaSelect';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing.unit,
    overflowY: 'off',
  },
  paddingLeft: {
    'padding-left': '7px',
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
    rowChangeListener,
  } = action;

  switch (type) {
    case 'remove':
      setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1, state.length),
      ];
    case 'addNew':
      return [...state, lastRowData];
    case 'updateField':
      if (state[index]) {
        if (rowChangeListener) {
          return rowChangeListener(state, index, field, value);
        }

        return [
          ...state.slice(0, index),
          Object.assign({}, state[index], { [field]: value }),
          ...state.slice(index + 1, state.length),
        ];
      }

      return [...state, Object.assign({}, lastRowData, { [field]: value })];
    default:
      return state;
  }
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
              items: op.options.map(opt => ({
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
    const { id, onFieldChange, rowChangeListener } = props;

    dispatchLocalAction({
      type: 'updateField',
      index: row,
      field,
      value: newValue,
      setChangeIdentifier,
      lastRowData: (value || []).length ? value[value.length - 1] : {},
      rowChangeListener,
    });

    if (state[row]) {
      const fieldValueToSet = rowChangeListener
        ? rowChangeListener(state, row, field, newValue)
        : preSubmit([
            ...state.slice(0, row),
            Object.assign({}, state[row], { [field]: newValue }),
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
    onFieldChange(id, preSubmit(state));
  }

  const handleAllUpdate = (row, id) => event => handleUpdate(row, event, id);
  const onFetchResource = id => e => handleRefreshClick(e, id);
  const handleRemoveRow = row => e => dispatchActionToDelete(e, row);

  return (
    <div className={classes.container}>
      {!hideLabel && <Typography variant="h6">{label}</Typography>}
      <Grid container className={classes.root} spacing={2}>
        {!hideHeaders && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {optionsMap.map(r => (
                <Grid key={r.id} item xs={r.space || true}>
                  <span className={classes.alignLeft}>{r.label || r.name}</span>
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
          className={classes.paddingLeft}
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
                    aria-label="delete"
                    onClick={handleRemoveRow(arr.row)}
                    className={classes.margin}>
                    <DeleteIcon fontSize="small" />
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

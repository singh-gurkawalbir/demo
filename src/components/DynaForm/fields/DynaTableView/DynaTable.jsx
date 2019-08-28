import Input from '@material-ui/core/Input';
import { useReducer, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import deepClone from 'lodash/cloneDeep';
import Spinner from '../../../Spinner';
import DynaSelect from '../DynaSelect';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing.unit,
    overflowY: 'off',
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
  } = action;

  switch (type) {
    case 'remove':
      setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1, state.length),
      ];
    case 'updateField':
      if (state[index]) {
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
    optionsMap: optionsMapInit,
    initSelector,
    handleRefreshClickHandler,
    handleCleanupHandler,
    hideHeaders = false,
    id,
  } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [shouldResetOptions, setShouldResetOptions] = useState(true);
  const [optionsMap, setOptionsMap] = useState(optionsMapInit);
  const [state, dispatchLocalAction] = useReducer(reducer, value || []);
  const valueData = deepClone(state);
  const requiredFields = (optionsMap || []).filter(option => !!option.required);
  const lastRow = {};
  let requiredFieldsMissing = false;
  const { isLoading, shouldReset, data: metadata } =
    useSelector(initSelector) || {};

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

  // If Value is present, check if there are required fields missing in the last row
  if (valueData && valueData.length) {
    (requiredFields || []).forEach(field => {
      if (!valueData[valueData.length - 1][field.id]) {
        requiredFieldsMissing = true;
      }
    });
  }

  // If all required fields are present in last row, add a dummy row at the end so user can enter values
  if (!requiredFieldsMissing) {
    optionsMap.forEach(option => {
      lastRow[option.id] = option.type === 'select' ? undefined : '';
    });
    valueData.push(lastRow);
  }

  // Convert the value to react form readable format
  const tableData = (valueData || []).map((value, index) => {
    const arr = [];

    Object.keys(value).forEach(field => {
      const data = optionsMap.find(option => option.id === field);
      let modifiedOptions;

      if (data && data.options && data.options.length) {
        modifiedOptions = {
          options: [
            {
              items: data.options.map(opt => ({
                label: opt.text || opt.label,
                value: opt.id || opt.value,
              })),
            },
          ],
        };
      }

      arr.push({ ...data, ...modifiedOptions, value: value[field] });
    });

    return { values: arr, row: index };
  });
  // Update handler. Listens to change in any field and dispatches action to update state
  const handleUpdate = (row, event, field) => {
    const { value } = event.target;
    const { id, onFieldChange } = props;

    dispatchLocalAction({
      type: 'updateField',
      index: row,
      field,
      value,
      setChangeIdentifier,
      lastRowData: (valueData || {}).length
        ? valueData[valueData.length - 1]
        : {},
    });
    onFieldChange(id, state);
  };

  function handleRefreshClick(e, fieldId) {
    if (handleRefreshClickHandler) {
      handleRefreshClickHandler(fieldId);
    }
  }

  function dispatchActionToDelete(e, index) {
    const { id, onFieldChange } = props;

    dispatchLocalAction({ type: 'remove', index, setChangeIdentifier });
    onFieldChange(id, state);
  }

  const handleAllUpdate = (row, id) => event => handleUpdate(row, event, id);
  const onFetchResource = id => e => handleRefreshClick(e, id);
  const handleRemoveRow = row => e => dispatchActionToDelete(e, row);

  return (
    <div className={classes.container}>
      <Typography variant="h6">{label}</Typography>
      <Grid container className={classes.root} spacing={2}>
        {!hideHeaders && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {optionsMap.map(r => (
                <Grid key={r.id} item xs>
                  <span className={classes.alignLeft}>{r.label}</span>
                  {r.supportsRefresh && !isLoading && (
                    <RefreshIcon onClick={onFetchResource(r.id)} />
                  )}
                  {r.supportsRefresh && isLoading && <Spinner />}
                </Grid>
              ))}
              <Grid key={100} item />
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2} key={changeIdentifier} direction="column">
          {tableData.map(arr => (
            <Grid item className={classes.rowContainer} key={arr.row}>
              <Grid container direction="row" spacing={2}>
                {arr.values.map(r => (
                  <Grid item key={r.id} xs>
                    {r.type !== 'select' && (
                      <Input
                        defaultValue={r.value}
                        placeholder={r.id}
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
                <Grid item key={100}>
                  <button onClick={handleRemoveRow(arr.row)}>X</button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

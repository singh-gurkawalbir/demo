import { useReducer, useEffect, useState } from 'react';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpansionPanelSummary,
  Typography,
  Grid,
  ExpansionPanelDetails,
  ExpansionPanel,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Spinner from '../../../Spinner';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaSelect from '../DynaSelect';
import Input from '../DynaText';
import DeleteIcon from '../../../icons/TrashIcon';
import DynaTypeableSelect from '../DynaTypeableSelect';
import ActionButton from '../../../ActionButton';
import IconTextButton from '../../../IconTextButton';

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

export const DynaTable = props => {
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
  const handleUpdate = (row, value, field) => {
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
      const fieldValueToSet = onRowChange
        ? onRowChange(state, row, field, value)
        : preSubmit([
            ...state.slice(0, row),
            { ...state[row], ...{ [field]: value } },
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

  // const handleAllUpdate = (row, id) => event => handleUpdate(row, event, id);
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
                    <IconTextButton
                      variant="contained"
                      color="secondary"
                      onClick={onFetchResource(r.id)}>
                      Refresh <RefreshIcon />
                    </IconTextButton>
                  )}
                  {r.supportsRefresh && isLoading === r.id && (
                    <Spinner size={24} />
                  )}
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
                    key={`${r.readOnly ? r.value || r.id : r.id}`}
                    xs={r.space || true}>
                    {['input', 'text', 'number'].includes(r.type) && (
                      <Input
                        id={`input-${r.id}-${arr.row}`}
                        value={r.value}
                        placeholder={r.id}
                        readOnly={!!r.readOnly}
                        type={r.type === 'input' ? 'text' : r.type}
                        className={classes.input}
                        onFieldChange={(id, value) => {
                          handleUpdate(arr.row, value, r.id);
                        }}
                      />
                    )}
                    {r.type === 'select' && (
                      <DynaSelect
                        id={`suggest-${r.id}-${arr.row}`}
                        value={r.value}
                        placeholder={r.id}
                        options={r.options || []}
                        onFieldChange={(id, value) => {
                          handleUpdate(arr.row, value, r.id);
                        }}
                        className={classes.root}
                      />
                    )}
                    {r.type === 'autosuggest' && (
                      <DynaTypeableSelect
                        id={`suggest-${r.id}-${arr.row}`}
                        key={`suggest-${r.id}-${arr.row}-${r.value}-${r.optionChangeIdentifer}`}
                        value={r.value}
                        labelName="label"
                        valueName="value"
                        options={r.options}
                        onBlur={(id, evt) => {
                          handleUpdate(
                            arr.row,
                            { target: { value: evt } },
                            r.id
                          );
                        }}
                      />
                    )}
                  </Grid>
                ))}
                <Grid item key="delete_button">
                  <ActionButton
                    data-test={`deleteTableRow-${arr.row}`}
                    aria-label="delete"
                    onClick={handleRemoveRow(arr.row)}
                    className={classes.margin}>
                    <DeleteIcon fontSize="small" />
                  </ActionButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default function CollapsableTable(props) {
  const { title, collapsable = false } = props;
  const [shouldExpand, setShouldExpand] = useState(false);

  return collapsable ? (
    <ExpansionPanel
      // eslint-disable-next-line react/no-array-index-key
      expanded={shouldExpand}>
      <ExpansionPanelSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <DynaTable {...props} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ) : (
    <DynaTable {...props} />
  );
}

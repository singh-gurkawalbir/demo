import Input from '@material-ui/core/Input';
import { useReducer, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import deepClone from 'lodash/cloneDeep';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import DynaSelect from './DynaSelect';
import actions from '../../../actions';

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
  label: {
    fontSize: '14px',
  },
}));

function reducer(state, action) {
  const { type, value, index, field, lastRowData = {} } = action;

  switch (type) {
    case 'remove':
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

const KeyValueTable = props => {
  const classes = useStyles(props);
  const {
    label,
    value,
    optionsMap: optionsMapInit,
    _integrationId,
    id,
  } = props;
  const dispatch = useDispatch();
  const [optionsMap, setOptionsMap] = useState(optionsMapInit);
  const [state, dispatchLocalAction] = useReducer(reducer, value || []);
  const valueData = deepClone(state);
  const requiredFields = (optionsMap || []).filter(option => !!option.required);
  const lastRow = {};
  let requiredFieldsMissing = false;
  const { isLoading, data: response } = useSelector(state =>
    selectors.connectorsMetadataOptions(
      state,
      id,
      null,
      _integrationId,
      optionsMap
    )
  );

  useEffect(() => {
    if (response) {
      setOptionsMap(response.optionsMap);
    }
  }, [response]);

  // If Value is present, check if there are required fields missing in the last row
  if (valueData && valueData.length) {
    (requiredFields || []).forEach(f => {
      if (!valueData[valueData.length - 1][f.id]) {
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
                label: opt.text,
                value: opt.id,
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
      lastRowData: (valueData || {}).length
        ? valueData[valueData.length - 1]
        : {},
    });
    onFieldChange(id, state);
  };

  function handleRefreshClick(e, fieldId) {
    dispatch(actions.connectors.refreshMetadata(fieldId, id, _integrationId));
  }

  function dispatchActionToDelete(e, index) {
    dispatchLocalAction({ type: 'remove', index });
  }

  const handleAllUpdate = (row, id) => event => handleUpdate(row, event, id);
  const onFetchResource = id => e => handleRefreshClick(e, id);
  const handleRemoveRow = row => e => dispatchActionToDelete(e, row);

  return (
    <div className={classes.container}>
      <FormLabel className={classes.label}>{label}</FormLabel>
      <Grid container className={classes.root} spacing={2}>
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
        <Grid container spacing={2} direction="column">
          {tableData.map(arr => (
            <Grid item className={classes.rowContainer} key={arr.row}>
              <Grid container direction="row" spacing={2}>
                {arr.values.map(r => (
                  <Grid item key={r.id} xs>
                    {r.type !== 'select' && (
                      <Input
                        autoFocus
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
};

const DynaStaticMapWidget = props => (
  <FieldWrapper {...props}>
    <KeyValueTable />
  </FieldWrapper>
);

export default DynaStaticMapWidget;

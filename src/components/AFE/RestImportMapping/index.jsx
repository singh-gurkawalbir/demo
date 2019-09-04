import { useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import deepClone from 'lodash/cloneDeep';
import DynaMappingSettings from '../../../components/DynaForm/fields/DynaMappingSettings';
import DynaAutoSuggest from '../../DynaForm/fields/DynaAutoSuggest';

const useStyles = makeStyles(theme => ({
  modalContent: {
    height: '100vh',
    width: '70vw',
  },
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
        const objCopy = { ...state[index] };
        let inputValue = value;

        if (field === 'extract') {
          if (inputValue.indexOf('"') === 0) {
            if (inputValue.charAt(inputValue.length - 1) !== '"')
              inputValue += '"';
            delete objCopy.extract;
            objCopy.hardCodedValue = inputValue.substr(
              1,
              inputValue.length - 2
            );
          } else {
            delete objCopy.hardCodedValue;
            objCopy.extract = inputValue;
          }
        } else {
          objCopy[field] = inputValue;
        }

        return [
          ...state.slice(0, index),
          objCopy,
          ...state.slice(index + 1, state.length),
        ];
      }

      return [...state, Object.assign({}, lastRowData, { [field]: value })];
    case 'updateSettings':
      setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

      if (state[index]) {
        return [
          ...state.slice(0, index),
          { ...value },
          ...state.slice(index + 1, state.length),
        ];
      }

      return [...state, Object.assign({}, lastRowData, { [field]: value })];

    default:
      return state;
  }
}

export default function RestImportMappingEditor(props) {
  const { label, onClose, mappings = {} } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const classes = useStyles();
  const exportOptions = [];
  const importOptions = [];

  mappings &&
    mappings.fields &&
    mappings.fields.forEach(mapp => {
      if (mapp.extract) exportOptions.push(mapp.extract);

      if (mapp.generate) importOptions.push(mapp.generate);
    });

  const [state, dispatchLocalAction] = useReducer(
    reducer,
    mappings.fields || []
  );
  const mappingsTmp = deepClone(state);
  const onSubmit = () => {
    const mappings = state.map(({ index, ...others }) => others);

    // console.log(mappings);
    onClose(true, mappings);
  };

  const handleUpdate = (row, event, field) => {
    const { value } = event.target;

    dispatchLocalAction({
      type: 'updateField',
      index: row,
      field,
      value,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  mappingsTmp.push({});

  const tableData = (mappingsTmp || []).map((value, index) => {
    const obj = value;

    obj.index = index;

    return obj;
  });
  const updateSettings = (row, settings) => {
    dispatchLocalAction({
      type: 'updateSettings',
      index: row,
      value: settings,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  const handledelete = row => {
    dispatchLocalAction({
      type: 'remove',
      index: row,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  return (
    <Dialog
      fullScreen={false}
      open
      // onClose={() => onClose()}
      scroll="paper"
      maxWidth={false}>
      <DialogTitle>Manage Import Mapping</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <div className={classes.container}>
          <Typography variant="h6">{label}</Typography>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid key="heading" item xs>
                  <span className={classes.alignLeft}>Source Record Field</span>
                </Grid>
                <Grid key="heading" item xs>
                  <span className={classes.alignLeft}>REST API Field</span>
                </Grid>

                <Grid key="delete_button_header" item />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              key={changeIdentifier}
              direction="column">
              {tableData.map(arr => (
                <Grid item className={classes.rowContainer} key={arr.index}>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs>
                      <DynaAutoSuggest
                        value={arr.extract || arr.hardCodedValue}
                        options={exportOptions}
                        onFieldChange={(id, evt) => {
                          handleUpdate(
                            arr.index,
                            { target: { value: evt } },
                            'extract'
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <DynaAutoSuggest
                        value={arr.generate}
                        options={importOptions}
                        onFieldChange={(id, evt) => {
                          handleUpdate(
                            arr.index,
                            { target: { value: evt } },
                            'generate'
                          );
                        }}
                      />
                    </Grid>
                    <Grid item key="arr.id">
                      <DynaMappingSettings
                        id={arr.index}
                        onSave={updateSettings}
                        value={arr}
                      />
                    </Grid>
                    <Grid item key="edit_button">
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          handledelete(arr.index);
                        }}
                        key="settings"
                        className={classes.margin}>
                        <ClearOutlined fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose(false);
          }}
          variant="contained"
          size="small">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          // disabled={!isValid}
          variant="contained"
          size="small"
          color="secondary">
          Save
        </Button>{' '}
      </DialogActions>
    </Dialog>
  );
}

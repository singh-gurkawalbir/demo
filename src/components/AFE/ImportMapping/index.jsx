import { useReducer, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import produce from 'immer';
import {
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  DialogActions,
  Typography,
} from '@material-ui/core';
import deepClone from 'lodash/cloneDeep';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import MappingSettings from '../ImportMappingSettings/MappingSettingsField';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import MappingUtil from '../../../utils/mapping';
import CloseIcon from '../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  modalContent: {
    height: '100vh',
    width: '70vw',
  },
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  header: {
    height: '100%',
    maxHeight: '28px',
  },
  root: {
    flexGrow: 1,
  },
  rowContainer: {
    display: 'flex',
    padding: '0px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export const reducer = (state, action) => {
  const {
    type,
    value,
    index,
    field,
    lastRowData = {},
    setChangeIdentifier,
  } = action;

  return produce(state, d => {
    const draft = d;

    switch (type) {
      case 'REMOVE':
        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);
        draft.splice(index, 1);
        break;
      case 'UPDATE_FIELD':
        if (state[index]) {
          const objCopy = { ...state[index] };
          let inputValue = value;

          if (field === 'extract') {
            if (inputValue !== '') {
              /* User removes the extract completely and blurs out, 
              extract field should be replaced back with last valid content
              Change the extract value only when he has provided valid content
            */

              if (inputValue.indexOf('"') === 0) {
                if (inputValue.charAt(inputValue.length - 1) !== '"')
                  inputValue += '"';
                delete objCopy.extract;
                objCopy.hardCodedValue = inputValue.substr(
                  1,
                  inputValue.length - 2
                );
                objCopy.hardCodedValueTmp = inputValue;
              } else {
                delete objCopy.hardCodedValue;
                objCopy.extract = inputValue;
              }
            }
          } else {
            objCopy[field] = inputValue;
          }

          draft[index] = objCopy;
        } else if (value) {
          draft.push({ ...lastRowData, [field]: value });
        }

        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

        break;
      case 'UPDATE_SETTING':
        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

        if (draft[index]) {
          const valueTmp = { ...value };

          if (valueTmp.hardCodedValue) {
            valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
          }

          draft[index] = { ...valueTmp };
        }

        break;

      default:
    }
  });
};

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    title,
    showDialogClose,
    mappings = {},
    lookups = [],
    application,
    resourceId,
    isStandaloneMapping,
    extractFields = [],
    onCancel,
    onSave,
    disabled,
    options = {},
  } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [lookupState, setLookup] = useState(lookups);
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [state, dispatchLocalAction] = useReducer(reducer, mappings || []);
  const mappingsTmp = deepClone(state);
  const dispatch = useDispatch();
  const importSampleData = useSelector(state =>
    selectors.getImportSampleData(state, resourceId)
  );

  useEffect(() => {
    if (!importSampleData) {
      dispatch(actions.importSampleData.request(resourceId));
    }
  }, [importSampleData, dispatch, resourceId]);

  const formattedGenerateFields = MappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
  const validateMapping = mappings => {
    const duplicateMappings = mappings
      .map(e => e.generate)
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter(obj => mappings[obj])
      .map(e => mappings[e].generate);

    if (duplicateMappings.length) {
      enquesnackbar({
        message: `You have duplicate mappings for the field(s): ${duplicateMappings.join(
          ','
        )}`,
        variant: 'error',
      });

      return false;
    }

    const mappingsWithoutExtract = mappings
      .filter(mapping => {
        if (!('hardCodedValue' in mapping || mapping.extract)) return true;

        return false;
      })
      .map(mapping => mapping.generate);

    if (mappingsWithoutExtract.length) {
      enquesnackbar({
        message: `Extract Fields missing for field(s): ${mappingsWithoutExtract.join(
          ','
        )}`,
        variant: 'error',
      });

      return false;
    }

    const mappingsWithoutGenerate = mappings.filter(mapping => {
      if (!mapping.generate) return true;

      return false;
    });

    if (mappingsWithoutGenerate.length) {
      enquesnackbar({
        message: 'Generate Fields missing for mapping(s)',
        variant: 'error',
      });

      return false;
    }

    return true;
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = closeModal => {
    let mappings = state.map(
      ({ index, hardCodedValueTmp, ...others }) => others
    );

    if (validateMapping(mappings)) {
      mappings = MappingUtil.generateMappingsForApp({
        mappings,
        generateFields: formattedGenerateFields,
        appType: application,
      });

      if (isStandaloneMapping) {
        onSave(mappings, lookupState, closeModal);
      } else {
        onSave(mappings, lookupState);
      }
    }
  };

  const generateLabel = MappingUtil.getGenerateLabelForMapping(application);
  const handleFieldUpdate = (row, event, field) => {
    const { value } = event.target;

    dispatchLocalAction({
      type: 'UPDATE_FIELD',
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

    if (obj.hardCodedValue) {
      obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
    }

    return obj;
  });
  const updateLookupHandler = (isDelete, obj) => {
    let lookupsTmp = [...lookupState];

    if (isDelete) {
      lookupsTmp = lookupsTmp.filter(lookup => lookup.name !== obj.name);
    } else {
      const index = lookupsTmp.findIndex(lookup => lookup.name === obj.name);

      if (index !== -1) {
        lookupsTmp[index] = obj;
      } else {
        lookupsTmp.push(obj);
      }
    }

    setLookup(lookupsTmp);
  };

  const handleSettingsClose = (row, settings) => {
    dispatchLocalAction({
      type: 'UPDATE_SETTING',
      index: row,
      value: { ...settings },
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  const handleDelete = row => {
    dispatchLocalAction({
      type: 'REMOVE',
      index: row,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  const getLookup = name => lookupState.find(lookup => lookup.name === name);

  return (
    <Dialog fullScreen={false} open scroll="paper" maxWidth={false}>
      {showDialogClose && (
        <IconButton
          aria-label="Close"
          data-test="closeImportMapping"
          className={classes.closeButton}
          onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      )}
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <div className={classes.container}>
          <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.header}>
              <Grid container>
                <Grid key="heading_extract" item xs>
                  <span className={classes.alignLeft}>Source Record Field</span>
                </Grid>
                <Grid key="heading_generate" item xs>
                  <span className={classes.alignLeft}>{generateLabel}</span>
                </Grid>
                <Grid key="settings_button_header" item />
                <Grid key="delete_button_header" item />
              </Grid>
            </Grid>
            <Grid container key={changeIdentifier} direction="column">
              {tableData.map(mapping => (
                <Grid item className={classes.rowContainer} key={mapping.index}>
                  <Grid container direction="row">
                    <Grid item xs>
                      <DynaTypeableSelect
                        id={`extract-${mapping.index}`}
                        labelName="name"
                        valueName="id"
                        value={mapping.extract || mapping.hardCodedValueTmp}
                        options={extractFields}
                        disabled={disabled}
                        onBlur={(id, evt) => {
                          handleFieldUpdate(
                            mapping.index,
                            { target: { value: evt } },
                            'extract'
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <DynaTypeableSelect
                        id={`generate-${mapping.index}`}
                        value={mapping.generate}
                        labelName="name"
                        valueName="id"
                        options={formattedGenerateFields}
                        disabled={disabled}
                        onBlur={(id, evt) => {
                          handleFieldUpdate(
                            mapping.index,
                            { target: { value: evt } },
                            'generate'
                          );
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <MappingSettings
                        id={mapping.index}
                        onSave={handleSettingsClose}
                        value={mapping}
                        options={options}
                        generate={mapping.generate}
                        application={application}
                        updateLookup={updateLookupHandler}
                        disabled={disabled}
                        lookup={
                          mapping &&
                          mapping.lookupName &&
                          getLookup(mapping.lookupName)
                        }
                        extractFields={extractFields}
                        generateFields={formattedGenerateFields}
                      />
                    </Grid>
                    <Grid item key="delete_button">
                      <IconButton
                        data-test="editMapping"
                        aria-label="delete"
                        disabled={mapping.isRequired || disabled}
                        onClick={() => {
                          handleDelete(mapping.index);
                        }}
                        className={classes.margin}>
                        <CloseIcon />
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
        {!isStandaloneMapping && (
          <Button
            data-test="cancelMapping"
            onClick={handleCancel}
            variant="contained"
            size="small"
            color="secondary">
            Cancel
          </Button>
        )}
        {isStandaloneMapping && (
          <Button
            disabled={disabled}
            data-test="saveMapping"
            onClick={() => handleSubmit(false)}
            variant="contained"
            size="small"
            color="secondary">
            Save
          </Button>
        )}
        <Button
          disabled={disabled}
          data-test="saveAndCloseMapping"
          onClick={() => handleSubmit(true)}
          variant="contained"
          size="small"
          color="secondary">
          {isStandaloneMapping ? 'Save and Close' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  DialogActions,
} from '@material-ui/core';
import deepClone from 'lodash/cloneDeep';
import DynaAutoSuggest from '../../DynaForm/fields/DynaAutoSuggest';
import DynaMappingSettings from '../../DynaForm/fields/DynaMappingSettings';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const CloseIcon = require('../../../components/icons/CloseIcon').default;

const svgFontSizes = size => ({
  fontSize: size,
  marginRight: 10,
});
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

  switch (type) {
    case 'REMOVE':
      setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1, state.length),
      ];
    case 'UPDATE_FIELD':
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
            objCopy.hardCodedValueTmp = inputValue;
          } else {
            delete objCopy.hardCodedValue;

            if (inputValue === '') {
              /* User removes the extract completely and blurs out, 
              extract field should be replaced back with last valid content */
              objCopy.extract = objCopy.extract;
            } else {
              objCopy.extract = inputValue;
            }
          }
        } else {
          objCopy[field] = inputValue;
        }

        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

        return [
          ...state.slice(0, index),
          objCopy,
          ...state.slice(index + 1, state.length),
        ];
      }

      return [...state, Object.assign({}, lastRowData, { [field]: value })];
    case 'UPDATE_SETTING':
      setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

      if (state[index]) {
        const valueTmp = { ...value };

        if (valueTmp.hardCodedValue) {
          valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
        }

        return [
          ...state.slice(0, index),
          { ...valueTmp },
          ...state.slice(index + 1, state.length),
        ];
      }

      return [...state];

    default:
      return state;
  }
};

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    title,
    onClose,
    mappings = {},
    lookups,
    application,
    generateFields,
    extractFields,
  } = props;
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [lookupState, setLookup] = useState(lookups || []);
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [state, dispatchLocalAction] = useReducer(
    reducer,
    mappings.fields || []
  );
  const mappingsTmp = deepClone(state);
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

  const handleSubmit = () => {
    const mappings = state.map(
      ({ index, hardCodedValueTmp, ...others }) => others
    );
    // check for all mapping with useAsAnInitializeValue set to true
    const initialValues = [];

    mappings.forEach(mapping => {
      if (mapping.useAsAnInitializeValue) {
        initialValues.push(mapping.generate);
      }
    });
    // check for initial value mapping
    const initialMappingIndex = mappings.findIndex(
      mapping => mapping.generate === 'celigo_initializeValues'
    );

    if (initialValues.length) {
      if (initialMappingIndex !== -1) {
        mappings[initialMappingIndex].hardCodedValue = initialValues.join(',');
      } else {
        mappings.push({
          generate: 'celigo_initializeValues',
          hardCodedValue: initialValues.join(','),
        });
      }
    } else if (initialMappingIndex !== -1) {
      mappings.splice(initialMappingIndex, 1);
    }

    if (validateMapping(mappings)) {
      onClose(true, mappings, lookupState);
    }
  };

  let generateLabel;

  switch (application) {
    case 'REST':
      generateLabel = 'REST API Field';
      break;
    case 'netsuite':
      generateLabel = 'NetSuite Field';
      break;
    default:
  }

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
      <DialogTitle>{title}</DialogTitle>
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
                      <DynaAutoSuggest
                        // hardCodedValueTmp is a formatted duplicate value of hardCodedValue
                        value={mapping.extract || mapping.hardCodedValueTmp}
                        options={extractFields}
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
                      <DynaAutoSuggest
                        value={mapping.generate}
                        options={generateFields}
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
                      <DynaMappingSettings
                        id={mapping.index}
                        onSave={handleSettingsClose}
                        value={mapping}
                        application={application}
                        updateLookup={updateLookupHandler}
                        lookup={
                          mapping &&
                          mapping.lookupName &&
                          getLookup(mapping.lookupName)
                        }
                        extractFields={extractFields}
                      />
                    </Grid>
                    <Grid item key="edit_button">
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          handleDelete(mapping.index);
                        }}
                        className={classes.margin}>
                        <CloseIcon style={svgFontSizes(24)} />
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
          onClick={handleSubmit}
          variant="contained"
          size="small"
          color="secondary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

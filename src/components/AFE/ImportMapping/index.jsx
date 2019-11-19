import { useReducer, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import produce from 'immer';
import Button from '@material-ui/core/Button';
import deepClone from 'lodash/cloneDeep';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import MappingSettings from '../ImportMappingSettings/MappingSettingsField';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import MappingUtil from '../../../utils/mapping';
import TrashIcon from '../../icons/TrashIcon';
import ModalDialog from '../../ModalDialog';
import ButtonsGroup from '../../ButtonGroup';
import ActionButton from '../../ActionButton';

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
    display: 'flex',
    width: '100%',
  },
  root: {
    flexGrow: 1,
  },
  rowContainer: {
    display: 'flex',
    padding: '0px',
  },
  child: {
    flexBasis: '40%',
  },
  childHeader: {
    flexBasis: '42%',
  },
  innerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '& > div': {
      marginRight: theme.spacing(1),
      '&:last-child': {
        marginRight: 0,
      },
    },
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
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = closeModal => {
    let mappings = state.map(
      ({ index, hardCodedValueTmp, ...others }) => others
    );
    const {
      status: validationStatus,
      message: validationErrMsg,
    } = MappingUtil.validateMappings(mappings);

    if (validationStatus) {
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
    } else {
      enquesnackbar({
        message: validationErrMsg,
        variant: 'error',
      });
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
    <ModalDialog handleClose={handleCancel} show width="md">
      <div>{title}</div>
      <div className={classes.container}>
        <div className={classes.root}>
          <div className={classes.header}>
            <div className={classes.header}>
              <Typography varaint="h4" className={classes.childHeader}>
                Source Record Field
              </Typography>

              <Typography varaint="h4" className={classes.childHeader}>
                {generateLabel}
              </Typography>
            </div>
          </div>
          <div key={changeIdentifier}>
            {tableData.map(mapping => (
              <div className={classes.rowContainer} key={mapping.index}>
                <div className={classes.innerRow}>
                  <div className={classes.child}>
                    <DynaTypeableSelect
                      id={`extract-${mapping.index}`}
                      labelName="name"
                      valueName="id"
                      value={mapping.extract || mapping.hardCodedValueTmp}
                      options={extractFields}
                      disabled={mapping.isNotEditable || disabled}
                      onBlur={(id, evt) => {
                        handleFieldUpdate(
                          mapping.index,
                          { target: { value: evt } },
                          'extract'
                        );
                      }}
                    />
                  </div>
                  <div className={classes.child}>
                    <DynaTypeableSelect
                      id={`generate-${mapping.index}`}
                      value={mapping.generate}
                      labelName="name"
                      valueName="id"
                      options={formattedGenerateFields}
                      disabled={mapping.isRequired || disabled}
                      onBlur={(id, evt) => {
                        handleFieldUpdate(
                          mapping.index,
                          { target: { value: evt } },
                          'generate'
                        );
                      }}
                    />
                  </div>
                  <div>
                    <MappingSettings
                      id={mapping.index}
                      onSave={handleSettingsClose}
                      value={mapping}
                      options={options}
                      generate={mapping.generate}
                      application={application}
                      updateLookup={updateLookupHandler}
                      disabled={mapping.isNotEditable || disabled}
                      lookup={
                        mapping &&
                        mapping.lookupName &&
                        getLookup(mapping.lookupName)
                      }
                      extractFields={extractFields}
                      generateFields={formattedGenerateFields}
                    />
                  </div>
                  <div key="delete_button">
                    <ActionButton
                      data-test="editMapping"
                      aria-label="delete"
                      disabled={
                        mapping.isRequired || mapping.isNotEditable || disabled
                      }
                      onClick={() => {
                        handleDelete(mapping.index);
                      }}>
                      <TrashIcon />
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <ButtonsGroup>
          {isStandaloneMapping && (
            <Button
              disabled={disabled}
              data-test="saveMapping"
              onClick={() => handleSubmit(false)}
              variant="outlined"
              color="secondary">
              Save
            </Button>
          )}
          <Button
            disabled={disabled}
            data-test="saveAndCloseMapping"
            onClick={() => handleSubmit(true)}
            variant="outlined"
            color="primary">
            {isStandaloneMapping ? 'Save and Close' : 'Save'}
          </Button>
          {!isStandaloneMapping && (
            <Button
              data-test="cancelMapping"
              onClick={handleCancel}
              variant="text"
              color="primary">
              Cancel
            </Button>
          )}
        </ButtonsGroup>
      </div>
    </ModalDialog>
  );
}

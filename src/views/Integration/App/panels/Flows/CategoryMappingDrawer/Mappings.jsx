/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MappingSettings from '../../../../../../components/AFE/ImportMappingSettings/MappingSettingsField';
import mappingUtil from '../../../../../../utils/mapping';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import * as selectors from '../../../../../../reducers';
import IconTextButton from '../../../../../../components/IconTextButton';
import ActionButton from '../../../../../../components/ActionButton';
import RefreshIcon from '../../../../../../components/icons/RefreshIcon';
import Spinner from '../../../../../../components/Spinner';
import LockIcon from '../../../../../../components/icons/LockIcon';
import actions from '../../../../../../actions';
import DynaTypeableSelect from '../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import AddIcon from '../../../../../../components/icons/AddIcon';
import ApplicationImg from '../../../../../../components/icons/ApplicationImg';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
    height: '100%',
  },
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px 50px',
    gridColumnGap: '1%',
    marginBottom: theme.spacing(2),
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
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
  innerRow: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '40% 40% 50px 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
  },
  mappingsBody: {
    height: `calc(100% - 32px)`,
    overflow: 'auto',
  },
  childRow: {
    display: 'flex',
    position: 'relative',
  },
  disableChildRow: {
    cursor: 'not-allowed',
    // TODO: (Aditya) Temp fix. To be removed on changing Import Mapping as Dyna Form
    '& > div > div > div': {
      background: theme.palette.secondary.lightest,
    },
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  spinner: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
}));

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    application,
    generateFields = [],
    extractFields = [],
    resource = {},
    disabled,
    optionalHanlder,
    isGeneratesLoading,
    isGenerateRefreshSupported,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { refreshGenerateFields } = optionalHanlder;
  const { mappings, lookups, initChangeIdentifier } = useSelector(state =>
    selectors.mapping(state, editorId)
  );
  const mappingsCopy = mappings ? [...mappings] : [];

  mappingsCopy.push({});
  const tableData = (mappingsCopy || []).map((value, index) => {
    const obj = value;

    obj.index = index;

    if (obj.hardCodedValue) {
      obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
    }

    return obj;
  });
  const handleFieldUpdate = useCallback(
    (rowIndex, event, field) => {
      const { value } = event.target;

      dispatch(actions.mapping.patchField(editorId, field, rowIndex, value));
    },
    [dispatch, editorId]
  );
  const patchSettings = (row, settings) => {
    dispatch(actions.mapping.patchSettings(editorId, row, settings));
  };

  const handleDelete = row => {
    dispatch(actions.mapping.delete(editorId, row));
  };

  const generateLabel = mappingUtil.getGenerateLabelForMapping(
    application,
    resource
  );
  const getLookup = name => lookups.find(lookup => lookup.name === name);
  const updateLookupHandler = (isDelete, obj) => {
    let lookupsTmp = [...lookups];

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

    dispatch(actions.mapping.updateLookup(editorId, lookupsTmp));
  };

  const handleGenerateUpdate = mapping => (id, val) => {
    handleFieldUpdate(mapping.index, { target: { value: val } }, 'generate');
  };

  function RefreshButton(props) {
    return (
      <IconTextButton
        variant="contained"
        color="secondary"
        className={classes.refreshButton}
        {...props}>
        Refresh <RefreshIcon />
      </IconTextButton>
    );
  }

  return (
    <div
      className={classes.root}
      key={`mapping-${editorId}-${initChangeIdentifier}`}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.childHeader}>
          Amazon <ApplicationImg assistant="amazon" size="small" />
        </Typography>

        <Typography variant="h5" className={classes.childHeader}>
          {generateLabel}
          {isGenerateRefreshSupported && !isGeneratesLoading && (
            <RefreshButton
              disabled={disabled}
              onClick={refreshGenerateFields}
              data-test="refreshGenerates"
            />
          )}
          {isGeneratesLoading && (
            <span className={classes.spinner}>
              <Spinner size={24} color="primary" />
            </span>
          )}
        </Typography>
      </div>
      <div className={classes.mappingsBody}>
        {tableData.map(mapping => (
          <div className={classes.rowContainer} key={mapping.index}>
            <div className={classes.innerRow}>
              <div
                className={clsx(classes.childHeader, classes.childRow, {
                  [classes.disableChildRow]: mapping.isNotEditable || disabled,
                })}>
                {
                  // TODO: Azhar change this icon to one of preferred, conditional, optional, required
                }
                <AddIcon />
                <DynaTypeableSelect
                  key={`extract-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                  id={`fieldMappingExtract-${mapping.index}`}
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

                {mapping.isNotEditable && (
                  <span className={classes.lockIcon}>
                    <LockIcon />
                  </span>
                )}
              </div>
              <div
                className={clsx(classes.childHeader, classes.childRow, {
                  [classes.disableChildRow]: mapping.isRequired || disabled,
                })}>
                <DynaTypeableSelect
                  key={`generate-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                  id={`fieldMappingGenerate-${mapping.index}`}
                  value={mapping.generate}
                  labelName="name"
                  valueName="id"
                  options={generateFields}
                  disabled={mapping.isRequired || disabled}
                  onBlur={handleGenerateUpdate(mapping)}
                />
                {mapping.isRequired && (
                  <Tooltip
                    title="This field is required by the application you are importing to"
                    placement="top">
                    <span className={classes.lockIcon}>
                      <LockIcon />
                    </span>
                  </Tooltip>
                )}
              </div>
              <div>
                <MappingSettings
                  id={`fieldMappingSettings-${mapping.index}`}
                  onSave={(id, evt) => {
                    patchSettings(mapping.index, evt);
                  }}
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
                  generateFields={generateFields}
                />
              </div>
              <div key="delete_button">
                <ActionButton
                  data-test={`fieldMappingRemove-${mapping.index}`}
                  aria-label="delete"
                  disabled={
                    mapping.isRequired || mapping.isNotEditable || disabled
                  }
                  onClick={() => {
                    handleDelete(mapping.index);
                  }}
                  className={classes.margin}>
                  <TrashIcon />
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

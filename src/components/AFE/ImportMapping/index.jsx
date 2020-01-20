/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Tooltip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import actions from '../../../actions';
import MappingSettings from '../ImportMappingSettings/MappingSettingsField';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import mappingUtil from '../../../utils/mapping';
import TrashIcon from '../../icons/TrashIcon';
import * as selectors from '../../../reducers';
import IconTextButton from '../../IconTextButton';
import ActionButton from '../../ActionButton';
import { adaptorTypeMap } from '../../../utils/resource';
import RefreshIcon from '../../icons/RefreshIcon';
import Spinner from '../../Spinner';
import LockIcon from '../../icons/LockIcon';
import MappingConnectorIcon from '../../icons/MappingConnectorIcon';
import ButtonGroup from '../../ButtonGroup';
import MappingSaveButton from '../../ResourceFormFactory/Actions/MappingSaveButton';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
    height: '100%',
    display: 'flex',
    width: '100%',
  },
  mappingContainer: {
    // overflow: 'auto',
    height: `calc(100vh - 180px)`,
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(1),
    flex: 1,
  },
  assistantContainer: {
    flex: 1,
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
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
    width: '46%',
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  mappingsBody: {
    height: `calc(100% - 32px)`,
    overflow: 'auto',
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
  },
  disableChildRow: {
    cursor: 'not-allowed',
    // TODO: (Aditya) Temp fix. To be removed on changing Import Mapping as Dyna Form
    '& > div > div > div': {
      background: theme.palette.background.paper2,
    },
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: theme.palette.text.hint,
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
  deleteBtn: {
    border: 'none',
    width: 0,
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: theme.spacing(6),
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
    isExtractsLoading,
    isGeneratesLoading,
    isGenerateRefreshSupported,
    onClose,
    options = {},
  } = props;
  const { sObjectType, connectionId } = options;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    fetchSalesforceSObjectMetadata,
    refreshGenerateFields,
    refreshExtractFields,
  } = optionalHanlder;
  const {
    mappings,
    lookups,
    initChangeIdentifier,
    previewData,
    lastModifiedRow,
    salesforceMasterRecordTypeId,
    showSalesforceNetsuiteAssistant,
  } = useSelector(state => selectors.mapping(state, editorId));
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
    if (
      application === adaptorTypeMap.SalesforceImport &&
      val &&
      val.indexOf('_child_') > -1
    ) {
      const childRelationshipField =
        generateFields && generateFields.find(field => field.id === val);

      if (childRelationshipField) {
        const { childSObject, relationshipName } = childRelationshipField;

        dispatch(
          actions.mapping.patchIncompleteGenerates(
            editorId,
            mapping.index,
            relationshipName
          )
        );
        fetchSalesforceSObjectMetadata(childSObject);
      }
    }

    handleFieldUpdate(mapping.index, { target: { value: val } }, 'generate');
  };

  const handleSalesforceAssistantFieldClick = useCallback(meta => {
    if (lastModifiedRow > -1)
      dispatch(
        actions.mapping.patchField(
          editorId,
          'generate',
          lastModifiedRow,
          meta.id
        )
      );
  });
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handlePreviewClick = () => {
    dispatch(actions.mapping.requestPreview(editorId));
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
    <div className={classes.root}>
      <div
        className={classes.mappingContainer}
        key={`mapping-${editorId}-${initChangeIdentifier}`}>
        <div className={classes.header}>
          <Typography variant="h5" className={classes.childHeader}>
            Source Record Field
            {!isExtractsLoading && (
              <RefreshButton
                disabled={disabled}
                onClick={refreshExtractFields}
                data-test="refreshExtracts"
              />
            )}
            {isExtractsLoading && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
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
                  className={clsx(classes.childHeader, classes.mapField, {
                    [classes.disableChildRow]:
                      mapping.isNotEditable || disabled,
                  })}>
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
                <MappingConnectorIcon className={classes.mappingIcon} />
                <div
                  className={clsx(classes.childHeader, classes.mapField, {
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
                    className={classes.deleteBtn}>
                    <TrashIcon />
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ButtonGroup>
          {showSalesforceNetsuiteAssistant && (
            <Button
              variant="text"
              data-test="preview"
              onClick={handlePreviewClick}>
              Preview
            </Button>
          )}
          <MappingSaveButton
            id={editorId}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"
          />
          <MappingSaveButton
            id={editorId}
            variant="outlined"
            color="secondary"
            dataTest="saveAndCloseImportMapping"
            onClose={handleClose}
            submitButtonLabel="Save & Close"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>
      {showSalesforceNetsuiteAssistant && (
        <div className={classes.assistantContainer}>
          <SalesforceMappingAssistant
            style={{
              width: '100%',
              height: '100%',
            }}
            connectionId={connectionId}
            sObjectType={sObjectType}
            sObjectLabel={sObjectType}
            layoutId={salesforceMasterRecordTypeId}
            onFieldClick={handleSalesforceAssistantFieldClick}
            data={previewData && previewData.data}
          />
        </div>
      )}
    </div>
  );
}

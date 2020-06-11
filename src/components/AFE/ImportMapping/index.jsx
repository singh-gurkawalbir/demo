import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import actions from '../../../actions';
import mappingUtil from '../../../utils/mapping';
import * as selectors from '../../../reducers';
import IconTextButton from '../../IconTextButton';
import RefreshIcon from '../../icons/RefreshIcon';
import Spinner from '../../Spinner';
import ButtonGroup from '../../ButtonGroup';
import MappingSaveButton from '../../ResourceFormFactory/Actions/MappingSaveButton';
import SalesforceMappingAssistant from '../../SalesforceMappingAssistant';
import NetSuiteMappingAssistant from '../../NetSuiteMappingAssistant';
import MappingRow from './MappingRow';
import HttpMappingAssistant from './HttpMappingAssistant';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    width: '100%',
  },
  mappingContainer: {
    height: 'calc(100vh - 180px)',
    padding: theme.spacing(1, 0, 3),
    marginBottom: theme.spacing(1),
    maxWidth: '100%',
    flex: '1 1 0',
  },
  mapCont: {
    width: '0px',
    flex: '1.1 1 0',
  },
  assistantContainer: {
    flex: '1 1 0',
    width: '0px',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(0, 0, 0, 1),
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
  mappingsBody: {
    height: 'calc(100% - 32px)',
    overflow: 'auto',
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
  topHeading: {
    fontFamily: 'Roboto500',
  },
  importMappingButtonGroup: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    padding: '16px 0px',
  },

}));
const emptyMappingRow = {};

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    application,
    extractFields = [],
    resource = {},
    disabled,
    optionalHanlder,
    isExtractsLoading,
    isGeneratesLoading,
    isGenerateRefreshSupported,
    onClose,
    exportResource = {},
    options = {},
  } = props;
  const { sObjectType, connectionId, recordType } = options;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    refreshExtractFields,
  } = optionalHanlder;
  const {
    mappings,
    lookups,
    changeIdentifier,
    preview = {},
    lastModifiedKey,
    salesforceMasterRecordTypeId,
    showSalesforceNetsuiteAssistant,
    importSampleData,
    httpAssistantPreview,
  } = useSelector(state => selectors.mapping(state, editorId));
  const salesforceNetsuitePreviewData = useMemo(() => {
    if (showSalesforceNetsuiteAssistant) {
      const { data } = preview;

      if (data && Array.isArray(data) && data.length) {
        const [_val] = data;

        return _val;
      }

      return data;
    }

    return undefined;
  }, [preview, showSalesforceNetsuiteAssistant]);
  const showPreviewPane = !!(
    showSalesforceNetsuiteAssistant || httpAssistantPreview
  );
  const generateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
  // TODO: Change to return status and comparison could be made here for progress/completed
  const saveInProgress = useSelector(
    state => selectors.mappingsSaveStatus(state, editorId).saveInProgress
  );
  const saveCompleted = useSelector(
    state => selectors.mappingsSaveStatus(state, editorId).saveCompleted
  );
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const { localMappings, localChangeIdentifier } = state;

  const handleRefreshGenerates = useCallback(
    () => {
      dispatch(
        actions.mapping.refreshGenerates(
          editorId
        )
      );
    },
    [dispatch, editorId],
  )
  useEffect(() => {
    // update local mapping state when mappings in data layer changes
    if (localChangeIdentifier !== changeIdentifier) {
      setState({
        localMappings: mappings,
        localChangeIdentifier: changeIdentifier,
      });
    }
  }, [changeIdentifier, localChangeIdentifier, localMappings, mappings]);

  const tableData = useMemo(
    () =>
      (localMappings || []).map((value, index) => {
        const obj = { ...value };

        obj.index = index;

        if (obj.hardCodedValue) {
          obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
        }

        return obj;
      }),
    [localMappings]
  );
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings.length,
  ]);
  const handleFieldUpdate = useCallback(
    (_mapping, field, value) => {
      console.log('_mapping', _mapping, field, value)
      const { key, generate = '', extract = '' } = _mapping;

      if (value === '') {
        if (
          (field === 'extract' && generate === '') ||
          (field === 'generate' &&
            extract === '' &&
            !('hardCodedValue' in _mapping))
        ) {
          dispatch(actions.mapping.delete(editorId, key));

          return;
        }
      }

      dispatch(actions.mapping.patchField(editorId, field, key, value));
    },
    [dispatch, editorId]
  );
  const patchSettings = useCallback(
    (key, settings) => {
      dispatch(actions.mapping.patchSettings(editorId, key, settings));
    },
    [dispatch, editorId]
  );
  const handleDelete = key => {
    dispatch(actions.mapping.delete(editorId, key));
  };

  const exportConn = useSelector(state =>
    selectors.resource(state, 'connections', exportResource._connectionId)
  );
  const importConn = useSelector(state =>
    selectors.resource(state, 'connections', resource._connectionId)
  );
  const extractLabel = exportResource._connectionId
    ? `Export field (${mappingUtil.getApplicationName(
      exportResource,
      exportConn
    )})`
    : 'Source Record Field';
  const generateLabel = `Import field (${mappingUtil.getApplicationName(
    resource,
    importConn
  )})`;
  const updateLookupHandler = (lookupOps = []) => {
    let lookupsTmp = [...lookups];
    // Here lookupOPs will be an array of lookups and actions. Lookups can be added and delted simultaneously from settings.

    lookupOps.forEach(({ isDelete, obj }) => {
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
    });

    dispatch(actions.mapping.updateLookup(editorId, lookupsTmp));
  };

  const handleSalesforceAssistantFieldClick = useCallback(
    meta => {
      if (lastModifiedKey) {
        dispatch(
          actions.mapping.patchField(
            editorId,
            'generate',
            lastModifiedKey,
            meta.id
          )
        );
      }
    },
    [dispatch, editorId, lastModifiedKey]
  );
  const handleNetSuiteAssistantFieldClick = useCallback(
    meta => {
      if (lastModifiedKey) {
        dispatch(
          actions.mapping.patchField(
            editorId,
            'generate',
            lastModifiedKey,
            meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id
          )
        );
      }
    },
    [dispatch, editorId, lastModifiedKey]
  );
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleDrop = useCallback(() => {
    dispatch(actions.mapping.changeOrder(editorId, localMappings));
  }, [dispatch, editorId, localMappings]);
  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const mappingsCopy = [...localMappings];
      const dragItem = mappingsCopy[dragIndex];

      mappingsCopy.splice(dragIndex, 1);
      mappingsCopy.splice(hoverIndex, 0, dragItem);

      setState({
        ...state,
        localMappings: mappingsCopy,
      });
    },
    [localMappings, state]
  );
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

  const httpAssistantPreviewData = useMemo(() => {
    const model = {
      connection: importConn,
      data: [],
    };
    const { data: previewData } = preview;

    if (previewData) {
      model.data = previewData;
    } else if (importSampleData) {
      model.data = Array.isArray(importSampleData)
        ? importSampleData
        : [importSampleData];
    }

    return JSON.stringify(model);
  }, [importConn, importSampleData, preview]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer, {
          [classes.mapCont]: showPreviewPane,
        })}
        key={`mapping-${editorId}`}>
        <div className={classes.header}>
          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading, {
              [classes.topHeadingCustomWidth]: showPreviewPane,
            })}>
            {extractLabel}
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

          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading)}>
            {generateLabel}
            {isGenerateRefreshSupported && !isGeneratesLoading && (
              <RefreshButton
                disabled={disabled}
                onClick={handleRefreshGenerates}
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

        <div className={classes.mappingsBody} key={`${editorId}`}>
          {tableData.map((mapping, index) => (
            <MappingRow
              index={index}
              id={`${mapping.key}-${mapping.rowIdentifier}`}
                // eslint-disable-next-line react/no-array-index-key
              key={`${mapping.key}-${mapping.rowIdentifier}`}
              mapping={mapping}
              extractFields={extractFields}
              onFieldUpdate={handleFieldUpdate}
              generateFields={generateFields}
              disabled={disabled}
              updateLookupHandler={updateLookupHandler}
              patchSettings={patchSettings}
              application={application}
              options={options}
              lookups={lookups}
              onDelete={handleDelete}
              onMove={handleMove}
              onDrop={handleDrop}
              isDraggable={!disabled}
              />
          ))}
          <MappingRow
            key={`${emptyRowIndex}`}
            index={emptyRowIndex}
            mapping={emptyMappingRow}
            extractFields={extractFields}
            onFieldUpdate={handleFieldUpdate}
            generateFields={generateFields}
            disabled={disabled}
            updateLookupHandler={updateLookupHandler}
            patchSettings={patchSettings}
            application={application}
            options={options}
            lookups={lookups}
            onDelete={handleDelete}
            isDraggable={false}
          />
        </div>
        <ButtonGroup
          className={classes.importMappingButtonGroup}>
          {showPreviewPane && (
            <Button
              variant="outlined"
              color="primary"
              data-test="preview"
              disabled={!!(disabled || saveInProgress)}
              onClick={handlePreviewClick}>
              Preview
            </Button>
          )}
          <MappingSaveButton
            id={editorId}
            disabled={!!(disabled || saveInProgress)}
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
            disabled={!!(disabled || saveInProgress)}
            showOnlyOnChanges
            submitButtonLabel="Save & close"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            disabled={!!saveInProgress}
            onClick={handleClose}>
            {saveCompleted ? 'Close' : 'Cancel'}
          </Button>
        </ButtonGroup>
      </div>
      {showPreviewPane && (
        <div className={classes.assistantContainer}>
          {showSalesforceNetsuiteAssistant && sObjectType && (
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
              data={salesforceNetsuitePreviewData}
            />
          )}
          {showSalesforceNetsuiteAssistant && recordType && (
            <NetSuiteMappingAssistant
              style={{
                width: '100%',
                height: '100%',
              }}
              netSuiteConnectionId={connectionId}
              netSuiteRecordType={recordType}
              onFieldClick={handleNetSuiteAssistantFieldClick}
              data={salesforceNetsuitePreviewData}
            />
          )}
          {httpAssistantPreview && (
            <HttpMappingAssistant
              editorId={`httpPreview-${editorId}`}
              rule={httpAssistantPreview.rule}
              data={httpAssistantPreviewData}
            />
          )}
        </div>
      )}
    </div>
  );
}

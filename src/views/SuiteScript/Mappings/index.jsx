import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, makeStyles, ButtonGroup, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import MappingRow from './MappingRow';
import SaveButton from './SaveButton';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import Spinner from '../../../components/Spinner';
import SpinnerWrapper from '../../../components/SpinnerWrapper';
import NetSuiteMappingAssistant from '../NetSuiteMappingAssistant';
import SalesforceMappingAssistant from '../SalesforceMappingAssistant';
import SalesforceSubListDialog from './SalesforceSubList';

const getAppType = (resType) => {
  if (resType === 'netsuite') return 'Netsuite';
  if (resType === 'rakuten') return 'Rakuten';
  if (resType === 'sears') return 'Sears';
  if (resType === 'newegg') return 'Newegg';
  if (resType === 'salesforce') return 'Salesforce';
};
const emptyObj = {};
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
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      width: '100%',
    },
    '&:first-child': {
      paddingLeft: 20,
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
    cursor: 'pointer'
  },
  disableRefresh: {
    pointerEvents: 'none',
    cursor: 'not-allowed',
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
    '& > button': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
  },

}));
const SuiteScriptMapping = (props) => {
  const {onClose, ssLinkedConnectionId, integrationId, flowId, subRecordMappingId } = props;
  const [state, setState] = useState({
    localMappings: [],
    localChangeIdentifier: -1,
  });
  const [salesforceLayoutId, setSalesforceLayoutId] = useState('');
  const { localMappings, localChangeIdentifier } = state;
  const classes = useStyles();
  const dispatch = useDispatch();

  const isManageLevelUser = useSelector(
    state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId)
  );
  const {
    mappings,
    lookups,
    changeIdentifier,
    importType,
    exportType,
    connectionId,
    recordType,
    sObjectType,
    lastModifiedRowKey = '',
    sfSubListExtractFieldName,
  } = useSelector(state => selectors.suiteScriptMappings(state));
  const sfLayoutId = useSelector(state => {
    const salesforceMasterRecordTypeInfo = selectors.suiteScriptSalesforceMasterRecordTypeInfo(state, {integrationId,
      ssLinkedConnectionId,
      flowId
    });
    return salesforceMasterRecordTypeInfo?.data?.recordTypeId;
  });
  const saveInProgress = useSelector(
    state => selectors.suiteScriptMappingsSaveStatus(state).saveInProgress
  );
  const {status: importSampleDataStatus, } = useSelector(state => selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}));
  const {status: flowSampleDataStatus} = useSelector(state => selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId}));

  const handleInit = useCallback(() => {
    dispatch(actions.suiteScript.mapping.init({ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}));
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId, subRecordMappingId]);
  const handleRefreshGenerates = useCallback(
    () => {
      dispatch(
        actions.suiteScript.mapping.refreshGenerates()
      );
    },
    [dispatch],
  );

  const handleRefreshExtracts = useCallback(
    () => {
      dispatch(
        actions.suiteScript.sampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
          }
        )
      );
    },
    [dispatch, flowId, integrationId, ssLinkedConnectionId]
  );

  const extractLabel = useMemo(() => `Source Record Field ${getAppType(exportType) ? `(${getAppType(exportType)})` : ''}`, [exportType]);
  const generateLabel = useMemo(() => `Import Field ${getAppType(importType) ? `(${getAppType(importType)})` : ''}`, [importType]);
  const emptyRowIndex = useMemo(() => localMappings.length, [
    localMappings,
  ]);
  const handleClose = useCallback(
    () => {
      onClose();
    },
    [onClose],
  );
  const handleDelete = useCallback(key => {
    dispatch(actions.suiteScript.mapping.delete(key));
  }, [dispatch]);

  const handleFieldUpdate = useCallback(
    (_mapping, field, value) => {
      const { key, generate = '', extract = '' } = _mapping;

      if (field === 'extract' && value.indexOf('_child_') > -1) {
        dispatch(actions.suiteScript.mapping.checkForSFSublistExtractPatch(key, value));
        return;
      }
      if ((!key && value) || (key && _mapping[field] !== value)) {
        // check if value changes or user entered something in new row

        if (key && value === '') {
          if (
            (field === 'extract' && generate === '') ||
                  (field === 'generate' &&
                  extract === '' &&
                  !('hardCodedValue' in _mapping))
          ) {
            dispatch(actions.suiteScript.mapping.delete(key));
            return;
          }
        }
        dispatch(actions.suiteScript.mapping.patchField({ field, key, value}));
        return;
      }
      if (lastModifiedRowKey !== key) {
        const _lastModifiedRowKey = key === undefined ? 'new' : key;
        dispatch(actions.suiteScript.mapping.updateLastFieldTouched(_lastModifiedRowKey));
      }
    },
    [dispatch, lastModifiedRowKey]
  );
  const handleSFNSAssistantFieldClick = useCallback(
    meta => {
      if (!isManageLevelUser) {
        return;
      }
      let value;
      if (sObjectType) {
        value = meta.id;
      } else if (recordType) {
        value = meta.sublistName ? `${meta.sublistName}[*].${meta.id}` : meta.id;
      }
      if (lastModifiedRowKey && value) {
        dispatch(
          actions.suiteScript.mapping.patchField({
            field: 'generate',
            key: lastModifiedRowKey === 'new' ? undefined : lastModifiedRowKey,
            value
          })
        );
      }
    }, [dispatch, isManageLevelUser, lastModifiedRowKey, recordType, sObjectType]);
  const patchSettings = useCallback(
    (key, settings) => {
      dispatch(actions.suiteScript.mapping.patchSettings(key, settings));
    },
    [dispatch]
  );
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

    dispatch(actions.suiteScript.mapping.updateLookups(lookupsTmp));
  };
  const handleDrop = useCallback(() => {
    dispatch(actions.suiteScript.mapping.changeOrder(localMappings));
  }, [dispatch, localMappings]);

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

  useEffect(() => {
    handleInit();
    return () => {
      dispatch(actions.suiteScript.mapping.clear());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // update local mapping state when mappings in data layer changes
    if (localChangeIdentifier !== changeIdentifier && mappings) {
      setState({
        localMappings: mappings,
        localChangeIdentifier: changeIdentifier,
      });
    }
  }, [changeIdentifier, localChangeIdentifier, localMappings, mappings]);

  useEffect(() => {
    if (sfLayoutId && salesforceLayoutId !== sfLayoutId) {
      setSalesforceLayoutId(sfLayoutId);
    }
  }, [sfLayoutId, salesforceLayoutId]);

  const showPreviewPane = ['netsuite', 'salesforce'].includes(importType) && isManageLevelUser;
  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer, {
          [classes.mapCont]: showPreviewPane,
        })}
        >
        <div className={classes.header}>
          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading, {
              [classes.topHeadingCustomWidth]: showPreviewPane,
            })}>
            {extractLabel}
            { flowSampleDataStatus !== 'requested' && (
              <RefreshIcon
                disabled={!isManageLevelUser}
                onClick={handleRefreshExtracts}
                className={
                  clsx(classes.refreshButton,
                    {
                      [classes.disableRefresh]: !isManageLevelUser
                    }
                  )
                }
                data-test="refreshExtracts"
              />
            )}
            {flowSampleDataStatus === 'requested' && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
          </Typography>

          <Typography
            variant="h5"
            className={clsx(classes.childHeader, classes.topHeading)}>
            {generateLabel}
            { importSampleDataStatus !== 'requested' && (
              <RefreshIcon
                disabled={!isManageLevelUser}
                onClick={handleRefreshGenerates}
                className={
                  clsx(classes.refreshButton,
                    {
                      [classes.disableRefresh]: !isManageLevelUser
                    }
                  )
                }
                data-test="refreshGenerates"
              />
            )}
            {importSampleDataStatus === 'requested' && (
              <span className={classes.spinner}>
                <Spinner size={24} color="primary" />
              </span>
            )}
          </Typography>
        </div>

        <div className={classes.mappingsBody}>
          {tableData.map((mapping, index) => (
            <MappingRow
              index={index}
              id={`${mapping.key}-${mapping.rowIdentifier}`}
                // eslint-disable-next-line react/no-array-index-key
              key={`${mapping.key}-${mapping.rowIdentifier}`}
              mapping={mapping}
              onFieldUpdate={handleFieldUpdate}
              disabled={!isManageLevelUser}
              ssLinkedConnectionId={ssLinkedConnectionId}
              integrationId={integrationId}
              flowId={flowId}
              updateLookupHandler={updateLookupHandler}
              patchSettings={patchSettings}
              onDelete={handleDelete}
              onMove={handleMove}
              onDrop={handleDrop}
              isDraggable={isManageLevelUser}
              importType={importType}
              />
          ))}
          <MappingRow
            key={`${emptyRowIndex}-${localChangeIdentifier}`}
            index={emptyRowIndex}
            mapping={emptyObj}
            onFieldUpdate={handleFieldUpdate}
            disabled={!isManageLevelUser}
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
            updateLookupHandler={updateLookupHandler}
            patchSettings={patchSettings}
            onDelete={handleDelete}
            isDraggable={false}
            importType={importType}
          />
        </div>
        <ButtonGroup
          className={classes.importMappingButtonGroup}>

          <SaveButton
            disabled={!isManageLevelUser || saveInProgress}
            color="primary"
            dataTest="saveImportMapping"
            submitButtonLabel="Save"

          />
          <SaveButton
            variant="outlined"
            color="secondary"
            dataTest="saveAndCloseImportMapping"
            onClose={handleClose}
            disabled={!isManageLevelUser || saveInProgress}
            showOnlyOnChanges
            submitButtonLabel="Save & close"
          />
          <Button
            variant="text"
            data-test="saveImportMapping"
            disabled={saveInProgress}
            onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>
      {showPreviewPane && (
        <div className={classes.assistantContainer}>
          {importType === 'netsuite' && (
          <NetSuiteMappingAssistant
            style={{
              width: '100%',
              height: '100%',
            }}
            netSuiteConnectionId={ssLinkedConnectionId}
            netSuiteRecordType={recordType}
            onFieldClick={handleSFNSAssistantFieldClick}
            data={{}}
       />
          )}
          {importType === 'salesforce' && (
          <SalesforceMappingAssistant
            style={{
              width: '100%',
              height: '100%',
            }}
            ssLinkedConnectionId={ssLinkedConnectionId}
            connectionId={connectionId}
            sObjectType={sObjectType}
            sObjectLabel={sObjectType}
            layoutId={salesforceLayoutId}
            onFieldClick={handleSFNSAssistantFieldClick}
            data={{}}
     />
          )}
        </div>
      )}
      {sfSubListExtractFieldName && (
        <SalesforceSubListDialog />
      )}

    </div>
  );
};

export default function SuiteScriptMappingWrapper(props) {
  const {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId} = props;
  // console.log('subRecordMappingId', subRecordMappingId);
  const dispatch = useDispatch();
  const [importSampleDataLoaded, setImportSampleDataLoaded] = useState(false);

  const [flowSampleDataLoaded, setFlowSampleDataLoaded] = useState(false);
  const subRecordType = useSelector(state => selectors.suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}).recordType);
  const {status: importSampleDataStatus, data: importSampleData} = useSelector(state => selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}));
  const {status: flowSampleDataStatus, data: flowSampleData} = useSelector(state => selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId}));
  const requestImportSampleData = useCallback(
    () => {
      dispatch(
        actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {recordType: subRecordType}
          }
        )
      );
    },
    [dispatch, flowId, integrationId, ssLinkedConnectionId, subRecordType]
  );
  const requestFlowSampleData = useCallback(
    () => {
      dispatch(
        actions.suiteScript.sampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
          }
        )
      );
    },
    [dispatch, flowId, integrationId, ssLinkedConnectionId]
  );
  useEffect(() => {
    if (
      !importSampleDataLoaded &&
      (importSampleDataStatus === 'received' || importSampleDataStatus === 'error')
    ) {
      setImportSampleDataLoaded(true);
    }
  }, [importSampleDataStatus, importSampleDataLoaded, setImportSampleDataLoaded]);


  useEffect(() => {
    if (
      !flowSampleDataLoaded &&
      (flowSampleDataStatus === 'received' || flowSampleDataStatus === 'error')
    ) {
      setFlowSampleDataLoaded(true);
    }
  }, [flowSampleDataLoaded, flowSampleDataStatus]);


  useEffect(() => {
    if (!importSampleData && !importSampleDataLoaded) {
      requestImportSampleData();
    }
  }, [importSampleData, dispatch, requestImportSampleData, importSampleDataLoaded]);
  useEffect(() => {
    if (!flowSampleData && !flowSampleDataLoaded) {
      requestFlowSampleData();
    }
  }, [flowSampleData, flowSampleDataLoaded, requestFlowSampleData]);
  if (!importSampleDataLoaded || !flowSampleDataLoaded) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  return (
    <SuiteScriptMapping {...props} />

  );
}

import { useMemo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';
import ImportMapping from './index';
import * as ResourceUtil from '../../../utils/resource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { getImportOperationDetails } from '../../../utils/assistant';
import mappingUtil from '../../../utils/mapping';
import Spinner from '../../Spinner';

// TODO: Azhar to review
const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    '&> div:first-child': {
      margin: 'auto',
    },
  },
});

export default function StandaloneMapping(props) {
  const {
    id,
    flowId,
    resourceId,
    subRecordMappingId,
    //  = 'item[*].celigo_inventorydetail',
    disabled,
    onClose,
  } = props;
  const classes = useStyles();
  const [flowSampleDataLoaded, setFlowSampleDataLoaded] = useState(false);
  const [importSampleDataLoaded, setImportSampleDataLoaded] = useState(false);
  const [flowSampleDataState, setFlowSampleDataState] = useState(undefined);
  const [assistantLoaded, setAssistantLoaded] = useState(false);
  const [
    integrationAppMetadataLoaded,
    setIntegrationAppMetadataLoaded,
  ] = useState(false);
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const [initTriggered, setInitTriggered] = useState(false);
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const isAssistant = !!resourceData.assistant;
  const isIntegrationApp = !!resourceData._connectorId;
  const integrationId = resourceData._integrationId;
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const isSalesforce =
    resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport;
  const isNetsuite =
    resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport;
  const { _connectionId: connectionId, name: resourceName } = resourceData;
  const dispatch = useDispatch();
  const { visible: showMappings } = useSelector(state =>
    selectors.mapping(state, id)
  );
  const subRecordMappingObj = useMemo(
    () =>
      subRecordMappingId
        ? mappingUtil.getSubRecordRecordTypeAndJsonPath(
            resourceData,
            subRecordMappingId
          )
        : {},
    [resourceData, subRecordMappingId]
  );
  const sampleDataObj = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    })
  );
  const { data: extractFields, status: extractStatus } = sampleDataObj || {};
  const requestSampleData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'importMappingExtract',
        true
      )
    );
  }, [dispatch, flowId, resourceId]);

  useEffect(() => {
    if (
      !flowSampleDataLoaded &&
      (extractStatus === 'received' || extractStatus === 'error')
    ) {
      setFlowSampleDataLoaded(true);
    }
  }, [extractStatus, flowSampleDataLoaded]);

  useEffect(() => {
    if (!extractFields) {
      requestSampleData();
    }
  }, [dispatch, extractFields, flowId, requestSampleData, resourceId]);

  if (initTriggered && !isEqual(flowSampleDataState, extractFields)) {
    dispatch(actions.mapping.updateFlowData(id, extractFields));
    setFlowSampleDataState(extractFields);
  }

  const importSampleDataObj = useSelector(state =>
    selectors.getImportSampleData(state, resourceId, subRecordMappingObj)
  );
  const { data: importSampleData, status: generateStatus } =
    importSampleDataObj || {};
  const salesforceMasterRecordTypeInfo = useSelector(state => {
    if (isSalesforce)
      return selectors.getSalesforceMasterRecordTypeInfo(state, resourceId);
  });
  const requestImportSampleData = useCallback(() => {
    dispatch(actions.importSampleData.request(resourceId, subRecordMappingObj));
  }, [dispatch, subRecordMappingObj, resourceId]);

  useEffect(() => {
    if (
      !importSampleDataLoaded &&
      (generateStatus === 'received' || generateStatus === 'error')
    ) {
      setImportSampleDataLoaded(true);
    }
  }, [generateStatus, importSampleDataLoaded]);

  useEffect(() => {
    if (!importSampleData) {
      requestImportSampleData();
    }
  }, [importSampleData, dispatch, resourceId, requestImportSampleData]);

  /**  get assistance metadata from
   *   selector and dispatching an action if not loaded
   */
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: resourceType.type,
      assistant: resourceType.assistant,
    })
  );
  const fetchAssistantResource = useCallback(() => {
    dispatch(
      actions.assistantMetadata.request({
        adaptorType: resourceType.type,
        assistant: resourceType.assistant,
      })
    );
  }, [dispatch, resourceType.assistant, resourceType.type]);

  useEffect(() => {
    // fetching assistant data in case resource type is assistant
    if (isAssistant && !assistantData) {
      fetchAssistantResource();
    }
  }, [
    assistantData,
    fetchAssistantResource,
    isAssistant,
    resourceType.assistant,
  ]);

  /**  get integration app mapping metadata from
   *   selector and dispatching an action if not loaded
   */

  const {
    mappingMetadata: integrationAppMappingMetadata,
    status: integrationAppMappingStatus,
  } = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const fetchIntegrationAppMappingMetadata = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.requestMappingMetadata(integrationId)
    );
  }, [dispatch, integrationId]);

  useEffect(() => {
    // fetching mapping metadata data in case of integration apps
    if (
      resourceData &&
      resourceData._connectorId &&
      !integrationAppMappingMetadata
    ) {
      fetchIntegrationAppMappingMetadata();
    }
  }, [
    dispatch,
    fetchIntegrationAppMappingMetadata,
    integrationAppMappingMetadata,
    resourceData,
  ]);

  const application = resourceType.type;
  const isGroupedSampleData = !!(extractFields && Array.isArray(extractFields));
  const options = {
    flowId,
    connectionId,
    resourceId,
    resourceName,
    isGroupedSampleData,
  };
  const mappingOptions = {
    resourceData,
    adaptorType: resourceType.type,
    isGroupedSampleData,
    application,
    subRecordMappingId,
  };

  if (isSalesforce) {
    options.sObjectType = resourceData.salesforce.sObjectType;
    const { recordTypeId: salesforceMasterRecordTypeId, searchLayoutable } =
      (salesforceMasterRecordTypeInfo && salesforceMasterRecordTypeInfo.data) ||
      {};

    if (searchLayoutable) {
      mappingOptions.salesforceMasterRecordTypeId = salesforceMasterRecordTypeId;
      mappingOptions.showSalesforceNetsuiteAssistant = true;
    }
  }

  if (isNetsuite) {
    let recordType;

    if (subRecordMappingId) {
      ({ recordType } = subRecordMappingObj);
      // recordType = subRecordMappingObj.recordType;
    } else {
      recordType =
        resourceData.netsuite_da && resourceData.netsuite_da.recordType;
    }

    options.recordType = recordType;
    mappingOptions.netsuiteRecordType = recordType;
    mappingOptions.showSalesforceNetsuiteAssistant = true;
  }

  if (isAssistant && assistantData) {
    if (!assistantLoaded) {
      setAssistantLoaded(true);
      setChangeIdentifier(changeIdentifier + 1);
    }

    const { assistantMetadata } = resourceData;
    const { operation, resource, version } = assistantMetadata;
    const { requiredMappings } = getImportOperationDetails({
      operation,
      resource,
      version,
      assistantData,
    });

    mappingOptions.assistant = {
      requiredMappings,
    };
  } else if (
    isIntegrationApp &&
    (integrationAppMappingStatus === 'received' ||
      integrationAppMappingStatus === 'error')
  ) {
    if (!integrationAppMetadataLoaded) {
      setIntegrationAppMetadataLoaded(true);
      setChangeIdentifier(changeIdentifier + 1);
    }

    mappingOptions.integrationApp = {
      mappingMetadata: integrationAppMappingMetadata || {},
      connectorExternalId: resourceData.externalId,
    };
  }

  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = mappingUtil.getExtractPaths(
      extractFields,
      subRecordMappingObj
    );

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  const formattedGenerateFields = mappingUtil.getFormattedGenerateData(
    importSampleData,
    application
  );
  const [importSampleDataState, setImportSampleDataState] = useState([]);
  const handleInit = useCallback(() => {
    dispatch(
      actions.mapping.init({
        id,
        options: mappingOptions,
      })
    );
  }, [dispatch, id, mappingOptions]);
  const isFetchingDuringInit =
    (isIntegrationApp && !integrationAppMetadataLoaded) ||
    (isAssistant && !assistantLoaded) ||
    !flowSampleDataLoaded ||
    ((isNetsuite || isSalesforce || isAssistant) && !importSampleDataLoaded);

  useEffect(() => {
    if (!isFetchingDuringInit && !initTriggered) {
      handleInit();
      setInitTriggered(true);
    }
  }, [dispatch, handleInit, id, initTriggered, isFetchingDuringInit]);

  const setMappingVisibility = useCallback(
    val => {
      dispatch(actions.mapping.setVisibility(id, val));
    },
    [dispatch, id]
  );

  useEffect(() => {
    if (!initTriggered && isFetchingDuringInit) {
      setMappingVisibility(false);
    }
  }, [dispatch, id, initTriggered, isFetchingDuringInit, setMappingVisibility]);

  if (!showMappings || isFetchingDuringInit) {
    return (
      <div className={classes.spinnerWrapper}>
        <Spinner />
      </div>
    );
  }

  if (initTriggered && !isEqual(importSampleDataState, importSampleData)) {
    dispatch(actions.mapping.updateGenerates(id, formattedGenerateFields));
    setImportSampleDataState(importSampleData);
  }

  const fetchSalesforceSObjectMetadata = sObject => {
    dispatch(
      actions.metadata.request(
        connectionId,
        `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObject}`
      )
    );
  };

  const optionalHandler = {
    fetchSalesforceSObjectMetadata,
    refreshGenerateFields: requestImportSampleData,
    refreshExtractFields: requestSampleData,
  };
  const isGenerateRefreshSupported =
    resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport ||
    resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport;

  return (
    <ImportMapping
      key={changeIdentifier}
      editorId={id}
      onClose={onClose}
      disabled={disabled}
      extractFields={formattedExtractFields}
      generateFields={formattedGenerateFields}
      resource={resourceData}
      isExtractsLoading={extractStatus === 'requested'}
      isGeneratesLoading={generateStatus === 'requested'}
      isGenerateRefreshSupported={isGenerateRefreshSupported}
      application={application}
      options={options}
      optionalHanlder={optionalHandler}
    />
  );
}

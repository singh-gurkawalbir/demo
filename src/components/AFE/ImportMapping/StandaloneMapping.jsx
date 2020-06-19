import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import ImportMapping from './index';
import * as ResourceUtil from '../../../utils/resource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { getImportOperationDetails } from '../../../utils/assistant';
import mappingUtil from '../../../utils/mapping';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';

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
  const exportResource = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);
    const _exportId =
      flow &&
      flow.pageGenerators &&
      flow.pageGenerators.length &&
      flow.pageGenerators[0]._exportId;

    return selectors.resource(state, 'exports', _exportId) || undefined;
  });
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const isAssistant =
    !!resourceData.assistant && resourceData.assistant !== 'financialforce';
  const isIntegrationApp = !!resourceData._connectorId;
  const integrationId = resourceData._integrationId;
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const isSalesforce =
    resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport;
  const isNetsuite =
    resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport;
  const isHTTP = resourceType.type === ResourceUtil.adaptorTypeMap.HTTPImport;
  const isREST = resourceType.type === ResourceUtil.adaptorTypeMap.RESTImport;
  const { _connectionId: connectionId, name: resourceName } = resourceData;
  const dispatch = useDispatch();
  // TODO (Aditya): Calculation connection/resource at data layer rather than sending heavy object
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const {
    visible: showMappings,
    importSampleData: savedImportSampleData,
  } = useSelector(state => selectors.mapping(state, id));
  /**
   * subRecordMappingObj returns subRecord mapping and filePath in case of subrecord mapping
   */
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
  const requestSampleData = useCallback((refresh = false) => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'importMappingExtract',
        refresh
      )
    );
  }, [dispatch, flowId, resourceId]);

  const refreshExtractFields = useCallback(
    () => requestSampleData(true), [requestSampleData]
  );

  useEffect(() => {
    if (
      !flowSampleDataLoaded &&
      (extractStatus === 'received' || extractStatus === 'error')
    ) {
      setFlowSampleDataLoaded(true);
    }
  }, [extractStatus, flowSampleDataLoaded]);

  useEffect(() => {
    if (!extractStatus) {
      requestSampleData(false);
    }
  }, [requestSampleData, extractStatus]);

  if (initTriggered && !isEqual(flowSampleDataState, extractFields)) {
    dispatch(actions.mapping.updateFlowData(id, extractFields));
    setFlowSampleDataState(extractFields);
  }

  /**
   * subRecordMappingObj={recordType:'accounts'}
   */
  const importSampleDataObj = useSelector(state =>
    selectors.getImportSampleData(state, resourceId, subRecordMappingObj)
  );
  const { data: importSampleData, status: generateStatus } =
    importSampleDataObj || {};
  const salesforceMasterRecordTypeInfo = useSelector(state => {
    if (isSalesforce) return selectors.getSalesforceMasterRecordTypeInfo(state, resourceId);
  });
  const requestImportSampleData = useCallback(
    (refreshCache = true) => {
      dispatch(
        actions.importSampleData.request(
          resourceId,
          subRecordMappingObj,
          refreshCache
        )
      );
    },
    [dispatch, resourceId, subRecordMappingObj]
  );

  useEffect(() => {
    if (
      !importSampleDataLoaded &&
      (generateStatus === 'received' || generateStatus === 'error')
    ) {
      setImportSampleDataLoaded(true);
    }
  }, [generateStatus, importSampleDataLoaded]);

  useEffect(() => {
    // request for import sample data for 1st time without refreshCache=true

    if (!importSampleData && !importSampleDataLoaded) {
      requestImportSampleData(false);
    }
  }, [
    importSampleData,
    dispatch,
    resourceId,
    requestImportSampleData,
    importSampleDataLoaded,
  ]);

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
    selectors.integrationAppMappingMetadata(state, integrationId)
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
  let isComposite;

  if (isHTTP) {
    isComposite =
      resourceData &&
      resourceData.http &&
      resourceData.http.method &&
      resourceData.http.method.length === 2;
  } else if (isREST) {
    isComposite =
      resourceData &&
      resourceData.rest &&
      resourceData.rest.method &&
      resourceData.rest.method.length === 2;
  } else if (isNetsuite) {
    isComposite =
      resourceData.netsuite_da &&
      resourceData.netsuite_da.operation &&
      resourceData.netsuite_da.operation === 'addupdate';
  }

  const options = {
    flowId,
    connectionId,
    resourceId,
    resourceName,
    isGroupedSampleData,
    isComposite,
  };
  const mappingOptions = {
    resourceData,
    adaptorType: resourceType.type,
    isGroupedSampleData,
    application,
    subRecordMappingId,
    connection,
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

  if (importSampleData) {
    mappingOptions.importSampleData = importSampleData;
  }

  let formattedExtractFields = [];

  /**
   * Get extracts path
   */
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

  useEffect(() => {
    if (
      initTriggered &&
      importSampleData &&
      !isEqual(importSampleData, savedImportSampleData)
    ) {
      dispatch(actions.mapping.updateImportSampleData(id, importSampleData));
    }
  }, [dispatch, id, importSampleData, initTriggered, savedImportSampleData]);

  if (!showMappings || isFetchingDuringInit) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  const optionalHandler = {
    refreshGenerateFields: requestImportSampleData,
    refreshExtractFields,
  };
  const isGenerateRefreshSupported =
    resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport ||
    resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport ||
    isIntegrationApp;

  return (
    <ImportMapping
      key={changeIdentifier}
      editorId={id}
      onClose={onClose}
      disabled={disabled}
      extractFields={formattedExtractFields}
      resource={resourceData}
      exportResource={exportResource}
      isExtractsLoading={extractStatus === 'requested'}
      isGeneratesLoading={generateStatus === 'requested'}
      isGenerateRefreshSupported={isGenerateRefreshSupported}
      application={application}
      options={options}
      optionalHanlder={optionalHandler}
    />
  );
}

import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import ImportMapping from './index';
import * as ResourceUtil from '../../../utils/resource';
import lookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { getImportOperationDetails } from '../../../utils/assistant';
import mappingUtil from '../../../utils/mapping';
import getJSONPaths from '../../../utils/jsonPaths';

export default function StandaloneMapping(props) {
  const { id, flowId, resourceId, disabled } = props;
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
  const options = {};
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const connectionId = resourceData._connectionId;
  const dispatch = useDispatch();
  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    })
  );
  const requestSampleData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'importMappingExtract'
      )
    );
  }, [dispatch, flowId, resourceId]);

  useEffect(() => {
    if (!extractFields) {
      requestSampleData();
    }
  }, [dispatch, extractFields, flowId, requestSampleData, resourceId]);

  const importSampleData = useSelector(state =>
    selectors.getImportSampleData(state, resourceId)
  );

  useEffect(() => {
    if (!importSampleData) {
      dispatch(actions.importSampleData.request(resourceId));
    }
  }, [importSampleData, dispatch, resourceId]);

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

  const { mappingMetadata: integrationAppMappingMetadata } = useSelector(
    state => selectors.integrationAppAddOnState(state, integrationId)
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

  if (resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport) {
    options.connectionId = connectionId;
    options.sObjectType = resourceData.salesforce.sObjectType;
  }

  if (resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport) {
    options.recordType =
      resourceData.netsuite_da && resourceData.netsuite_da.recordType;
    options.connectionId = connectionId;
  }

  const mappingOptions = {};

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
  } else if (isIntegrationApp && integrationAppMappingMetadata) {
    if (!integrationAppMetadataLoaded) {
      setIntegrationAppMetadataLoaded(true);
      setChangeIdentifier(changeIdentifier + 1);
    }

    mappingOptions.integrationApp = {
      mappingMetadata: integrationAppMappingMetadata,
      connectorExternalId: resourceData.externalId,
    };
  }

  const mappings = mappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type,
    false,
    mappingOptions
  );
  const lookups = lookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = getJSONPaths(extractFields);

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
      actions.mapping.init(
        id,
        mappings,
        lookups || [],
        resourceType.type,
        application
      )
    );
  }, [application, dispatch, id, lookups, mappings, resourceType.type]);

  useEffect(() => {
    if (
      (isIntegrationApp && integrationAppMetadataLoaded) ||
      (isAssistant && assistantLoaded) ||
      (!isAssistant && !isIntegrationApp)
    ) {
      handleInit();
      setInitTriggered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isIntegrationApp,
    integrationAppMetadataLoaded,
    isAssistant,
    assistantLoaded,
  ]);

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
  };

  return (
    <ImportMapping
      key={changeIdentifier}
      editorId={id}
      disabled={disabled}
      extractFields={formattedExtractFields}
      generateFields={formattedGenerateFields}
      value={mappings}
      adaptorType={resourceType.type}
      application={application}
      lookups={lookups}
      options={options}
      optionalHanlder={optionalHandler}
    />
  );
}

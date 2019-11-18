import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
import LookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ImportMapping from './';
import LoadResources from '../../../components/LoadResources';
import getJSONPaths from '../../../utils/jsonPaths';
import { getImportOperationDetails } from '../../../utils/assistant';

/**
 *
 *(This component can be used to manage Import lookups)
 * @export
 * @param {string} id (unique Id)
 * @param {string} resourceId (Import Resource Id)
 * @param {function} onClose (callback for closing the mapping dialog)
 */

export default function StandaloneImportMapping(props) {
  const {
    id,
    resourceId,
    onClose,
    connectionId,
    extractFields,
    disabled,
  } = props;
  const dispatch = useDispatch();
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const [assistantState, setAssistantState] = useState({
    assistantLoaded: false,
    changeIdentifier: 0,
  });
  const { assistantLoaded, changeIdentifier } = assistantState;
  const options = {};
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
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
    if (resourceType.assistant && !assistantData) {
      fetchAssistantResource();
    }
  }, [assistantData, fetchAssistantResource, resourceType.assistant]);

  if (resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport) {
    options.connectionId = connectionId;
    options.sObjectType = resourceData.salesforce.sObjectType;
  }

  if (resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport) {
    options.recordType =
      resourceData.netsuite_da && resourceData.netsuite_da.recordType;
    options.connectionId = connectionId;
  }

  const mappings = MappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type
  );

  if (assistantData) {
    const { assistantMetadata } = resourceData;
    const { operation, resource, version } = assistantMetadata;
    const assistantOperationDetail = getImportOperationDetails({
      operation,
      resource,
      version,
      assistantData,
    });
    const { requiredMappings } = assistantOperationDetail;

    if (requiredMappings && Array.isArray(requiredMappings)) {
      requiredMappings.forEach(_mandatoryMapping => {
        const _mappingObj = mappings.find(
          _mapping => _mapping.generate === _mandatoryMapping
        );

        if (_mappingObj) {
          _mappingObj.isRequired = true;
        } else {
          mappings.push({
            generate: _mandatoryMapping,
            isRequired: true,
          });
        }
      });
    }

    if (!assistantLoaded) {
      setAssistantState({
        assistantLoaded: !assistantLoaded,
        changeIdentifier: changeIdentifier + 1,
      });
    }
  }

  const lookups = LookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  const handleSave = (_mappings, _lookups, closeModal) => {
    // perform save operation only when mapping object is passed as parameter to the function.
    if (_mappings) {
      const patchSet = [];
      const mappingPath = MappingUtil.getMappingPath(resourceType.type);

      // if mapping doesnt exist in resouce object , perform add patch else replace patch
      patchSet.push({
        op: mappings ? 'replace' : 'add',
        path: mappingPath,
        value: _mappings,
      });

      // update _lookup only if its being passed as param to function
      if (_lookups) {
        const lookupPath = LookupUtil.getLookupPath(resourceType.type);

        patchSet.push({
          op: lookups ? 'replace' : 'add',
          path: lookupPath,
          value: _lookups,
        });
      }

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    }

    if (closeModal) onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = getJSONPaths(extractFields);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  return (
    <LoadResources resources="imports">
      <ImportMapping
        disabled={disabled}
        title="Define Import Mapping"
        key={changeIdentifier}
        id={id}
        application={resourceType.type}
        lookups={lookups}
        isStandaloneMapping
        resourceId={resourceId}
        mappings={mappings}
        showDialogClose
        extractFields={formattedExtractFields}
        onCancel={handleCancel}
        onSave={handleSave}
        options={options}
      />
    </LoadResources>
  );
}

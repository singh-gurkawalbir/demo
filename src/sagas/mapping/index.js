import { call, takeEvery, put, select, takeLatest, all, take, race } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import shortid from 'shortid';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import {selectors} from '../../reducers';
import { commitStagedChanges } from '../resources';
import mappingUtil from '../../utils/mapping';
import lookupUtil from '../../utils/lookup';
import { apiCallWithRetry } from '..';
import { getResourceSubType, adaptorTypeMap} from '../../utils/resource';
import { getImportOperationDetails } from '../../utils/assistant';
import {requestSampleData as requestFlowSampleData} from '../sampleData/flows';
import {requestSampleData as requestImportSampleData} from '../sampleData/imports';
import {requestAssistantMetadata} from '../resources/meta';
import {getMappingMetadata as getIAMappingMetadata} from '../integrationApps/settings';

export function* fetchRequiredMappingData({
  flowId,
  importId,
  subRecordMappingId,
}) {
  const importResource = yield select(selectors.resource, 'imports', importId);

  const subRecordMappingObj = subRecordMappingId
    ? mappingUtil.getSubRecordRecordTypeAndJsonPath(importResource, subRecordMappingId) : {};

  yield all([
    call(requestFlowSampleData, {
      flowId,
      resourceId: importId,
      resourceType: 'imports',
      stage: 'importMappingExtract',
    }),
    call(requestImportSampleData, {
      resourceId: importId,
      options: subRecordMappingObj,
    }),
    (importResource.assistant && importResource.assistant !== 'financialforce') && call(requestAssistantMetadata, {
      adaptorType: importResource.type,
      assistant: importResource.assistant,
    }),
    importResource._connectorId && call(getIAMappingMetadata, {
      integrationId: importResource._integrationId,
    }),
  ]);
}
export function* refreshGenerates({ isInit = false }) {
  const {
    mappings,
    importId,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, importId, subRecordMappingId);
  const importResource = yield select(selectors.resource, 'imports', importId);

  if (importResource.adaptorType === 'SalesforceImport') {
    // salesforce Import could have sub objects as well
    const { _connectionId, salesforce } = importResource;
    const { sObjectType } = salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: _connectionId,
        commMetaPath: `salesforce/metadata/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    // during init, parent sObject metadata is already fetched.
    let sObjectList = [sObjectType];

    // check for each mapping sublist if it relates to childSObject
    generateFields.forEach(({id}) => {
      if (id.indexOf('[*].') !== -1) {
        const childObjectName = id.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === childObjectName);

        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    // check for child sObject in mappings.
    mappings.forEach(({generate}) => {
      if (generate && generate.indexOf('[*].') !== -1) {
        const subListName = generate.split('[*].')[0];
        const childRelationshipObject = childRelationshipFields.find(field => field.value === subListName);

        if (childRelationshipObject && sObjectList.indexOf(childRelationshipObject?.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    if (isInit) {
      sObjectList = sObjectList.filter(_sObjectType => _sObjectType !== sObjectType);
    }
    // fetch all child sObject used in mapping
    yield put(actions.importSampleData.request(
      importId,
      {sObjects: sObjectList},
      !isInit
    ));

    /** fetup SF mapping assistant metadata begins */
    const salesforceMasterRecordTypeInfo = yield select(selectors.getSalesforceMasterRecordTypeInfo, importId);

    if (salesforceMasterRecordTypeInfo?.data) {
      const {recordTypeId, searchLayoutable} = salesforceMasterRecordTypeInfo.data;

      if (searchLayoutable) {
        yield put(actions.metadata.request(_connectionId,
          `salesforce/metadata/connections/${_connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${recordTypeId}`,
          {refreshCache: !isInit}
        ));
      }
    }
    /** fetup SF mapping assistant metadata ends */
  } else {
    const opts = {};

    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importResource.adaptorType) && subRecordMappingId) {
      opts.recordType = yield select(selectors.mappingNSRecordType, importId, subRecordMappingId);
    }
    yield put(actions.importSampleData.request(
      importId,
      opts,
      !isInit
    )
    );
  }
}
export function* mappingInit({
  flowId,
  importId,
  subRecordMappingId,
}) {
  /** Flow Preview data & metadata needs to be loaded before generating mapping list */
  const { cancelInit } = yield race({
    fetchData: call(fetchRequiredMappingData, {
      flowId,
      importId,
      subRecordMappingId,
    }),
    cancelInit: take(actionTypes.MAPPING.CLEAR),
  });

  if (cancelInit) return;
  const importResource = yield select(selectors.resource, 'imports', importId);
  const exportResource = yield select(selectors.firstFlowPageGenerator, flowId);
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId: importId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = Array.isArray(flowSampleData);
  let formattedMappings = [];
  let lookups = [];
  const options = {};

  if (importResource.netsuite_da) {
    const recordType = yield select(selectors.mappingNSRecordType, importId, subRecordMappingId);

    options.recordType = recordType;
  }
  if (importResource._connectorId) {
    const { _integrationId } = importResource;

    const { mappingMetadata } = yield select(
      selectors.integrationAppMappingMetadata,
      _integrationId
    );

    options.integrationApp = {
      mappingMetadata: mappingMetadata || {},
      connectorExternalId: importResource.externalId,
    };
  } else if (importResource.assistant) {
    const { type: adaptorType, assistant } = getResourceSubType(
      importResource
    );
    const { operation, resource, version } = importResource.assistantMetadata;

    const assistantData = yield select(
      selectors.assistantData, {
        adaptorType,
        assistant,
      }
    );

    const { requiredMappings } = getImportOperationDetails({
      operation,
      resource,
      version,
      assistantData,
    });

    options.assistant = { requiredMappings };
  }
  if (subRecordMappingId) {
    const {
      mappings: subRecordMapping,
      lookups: subrecordLookups = [],
    } = mappingUtil.generateSubrecordMappingAndLookup(
      importResource,
      subRecordMappingId,
      isGroupedSampleData,
      options
    );

    formattedMappings = subRecordMapping;
    lookups = subrecordLookups;
  } else {
    formattedMappings = mappingUtil.getMappingFromResource(
      importResource,
      false,
      isGroupedSampleData,
      options.recordType,
      options,
      exportResource
    );
    lookups = lookupUtil.getLookupFromResource(importResource) || [];
  }
  // adding conditional lookup
  lookups = lookups.map(lookup => {
    const isConditionalLookup = formattedMappings.find(mapping => mapping?.conditional?.lookupName === lookup.name);

    return {...lookup, isConditionalLookup: !!isConditionalLookup};
  });
  yield put(
    actions.mapping.initComplete({
      mappings: formattedMappings.map(m => ({
        ...m,
        rowIdentifier: 0,
        key: shortid.generate(),
      })),
      lookups,
      flowId,
      importId,
      subRecordMappingId,
    })
  );
  yield call(refreshGenerates, {isInit: true});
}

export function* saveMappings() {
  const patch = [];
  const {
    mappings,
    lookups,
    importId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, importId, subRecordMappingId);
  const importResource = yield select(selectors.resource, 'imports', importId);
  let netsuiteRecordType;

  if (importResource.netsuite_da) {
    netsuiteRecordType = yield select(selectors.mappingNSRecordType, importId, subRecordMappingId);
  }
  const exportResource = yield select(selectors.firstFlowPageGenerator, flowId);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, key, ...others }) => others
  );
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId: importId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = Array.isArray(flowSampleData);

  _mappings = mappingUtil.generateFieldsAndListMappingForApp({
    mappings: _mappings,
    generateFields,
    isGroupedSampleData,
    importResource,
    netsuiteRecordType,
    exportResource,
  });
  let mappingPath = '/mapping';

  if (
    ['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importResource.adaptorType)
  ) {
    // in case of subRecord mapping, modify the subrecord and return the root mapping object
    if (subRecordMappingId) {
      _mappings = mappingUtil.appendModifiedSubRecordToMapping({
        resource: importResource,
        subRecordMappingId,
        subRecordMapping: _mappings,
        subRecordLookups: lookups,
      });
    }
    mappingPath = '/netsuite_da/mapping';
  }

  patch.push({
    op: _mappings ? 'replace' : 'add',
    path: mappingPath,
    value: _mappings,
  });

  if (lookups && !subRecordMappingId) {
    // remove all unused conditional lookups
    const filteredLookups = lookups.filter(({name, isConditionalLookup}) => {
      if (isConditionalLookup) {
        return !!mappings.find(mapping => mapping?.conditional?.lookupName === name);
      }

      return true;
    }).map(({isConditionalLookup, ...others}) => ({...others}));
    const lookupPath = lookupUtil.getLookupPath(adaptorTypeMap[importResource.adaptorType]);

    // TODO: temporary fix Remove check once backend adds lookup support for Snowflake.
    if (lookupPath) {
      patch.push({
        op: filteredLookups ? 'replace' : 'add',
        path: lookupPath,
        value: filteredLookups,
      });
    }
  }

  yield put(actions.resource.patchStaged(importId, patch, SCOPES.VALUE));

  const { cancelSave, resp } = yield race({
    resp: call(commitStagedChanges, {
      resourceType: 'imports',
      id: importId,
      scope: SCOPES.VALUE,
      context: { flowId },
    }),
    cancelSave: take(actionTypes.MAPPING.CLEAR),
  });

  if (cancelSave) return;

  if (resp && (resp.error || resp.conflict)) return yield put(actions.mapping.saveFailed());

  yield put(actions.mapping.saveComplete());
}

export function* previewMappings() {
  const {
    mappings,
    lookups,
    importId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const generateFields = yield select(selectors.mappingGenerates, importId, subRecordMappingId);
  const _importRes = yield select(selectors.resource, 'imports', importId);
  let importResource = deepClone(_importRes);
  let netsuiteRecordType;

  if (importResource.netsuite_da) {
    netsuiteRecordType = yield select(selectors.mappingNSRecordType, importId, subRecordMappingId);
  }
  const exportResource = yield select(selectors.firstFlowPageGenerator, flowId);
  const {data: flowSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId: importId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  });
  const isGroupedSampleData = Array.isArray(flowSampleData);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, key, ...others }) => others
  );

  _mappings = mappingUtil.generateFieldsAndListMappingForApp({
    mappings: _mappings,
    generateFields,
    isGroupedSampleData,
    importResource,
    netsuiteRecordType,
    exportResource,
  });

  const { _connectionId } = importResource;
  let path = `/connections/${_connectionId}/mappingPreview`;
  const requestBody = {
    data: flowSampleData,
  };
  const filteredLookups = lookups.filter(({name, isConditionalLookup}) => {
    if (isConditionalLookup) {
      return !!mappings.find(mapping => mapping?.conditional?.lookupName === name);
    }

    return true;
  }).map(({isConditionalLookup, ...others}) => ({...others}));

  if (importResource.adaptorType === 'SalesforceImport') {
    importResource.mapping = _mappings;

    if (filteredLookups) {
      importResource.salesforce.lookups = filteredLookups;
    }
  } else if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importResource.adaptorType)) {
    path = `/netsuiteDA/previewImportMappingFields?_connectionId=${_connectionId}`;

    // in case of subRecord mapping, modify the subrecord and return the root mapping object
    if (subRecordMappingId) {
      _mappings = mappingUtil.appendModifiedSubRecordToMapping({
        resource: importResource,
        subRecordMappingId,
        subRecordMapping: _mappings,
        subRecordLookups: filteredLookups,
      });
    }

    importResource = importResource.netsuite_da;

    if (!subRecordMappingId) {
      importResource.lookups = filteredLookups;
    }

    importResource.mapping = _mappings;
    requestBody.data = [requestBody.data];
    requestBody.celigo_resource = 'previewImportMappingFields';
  } else if (importResource.adaptorType === 'HTTPImport') {
    importResource.mapping = _mappings;

    if (filteredLookups) importResource.http.lookups = filteredLookups;
  }

  requestBody.importConfig = importResource;

  const opts = {
    method: 'PUT',
    body: requestBody,
  };

  try {
    const { cancelPreview, preview } = yield race({
      preview: call(apiCallWithRetry, {
        path,
        opts,
        message: 'Loading',
      }),
      cancelPreview: take(actionTypes.MAPPING.CLEAR),
    });

    if (cancelPreview) return;

    if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(importResource.adaptorType)) {
      if (
        preview?.data?.returnedObjects?.mappingErrors[0]?.error
      ) {
        return yield put(actions.mapping.previewFailed());
      }
    }
    yield put(actions.mapping.previewReceived(preview));
  } catch (e) {
    yield put(actions.mapping.previewFailed());
  }
}

export function* validateMappings() {
  const {
    mappings,
    lookups,
    validationErrMsg,
  } = yield select(selectors.mapping);
  const {
    isSuccess,
    errMessage,
  } = mappingUtil.validateMappings(mappings, lookups);
  const newValidationErrMsg = isSuccess ? undefined : errMessage;

  if (newValidationErrMsg !== validationErrMsg) {
    yield put(actions.mapping.setValidationMsg(newValidationErrMsg));
  }
}

export function* checkForIncompleteSFGenerateWhilePatch({ field, value = '' }) {
  if (value.indexOf('_child_') === -1) {
    return yield call(validateMappings);
  }
  const {
    mappings,
    importId,
    subRecordMappingId,
  } = yield select(selectors.mapping);
  const importResource = yield select(selectors.resource, 'imports', importId);

  if (importResource.adaptorType !== 'SalesforceImport' || field !== 'generate') {
    return;
  }
  const generateFields = yield select(selectors.mappingGenerates, importId, subRecordMappingId);

  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj;
  const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);

  if (childRelationshipField && childRelationshipField.childSObject) {
    const { childSObject, relationshipName } = childRelationshipField;

    yield put(actions.mapping.patchIncompleteGenerates(
      key,
      relationshipName
    )
    );
    yield put(actions.importSampleData.request(
      importId,
      {sObjects: [childSObject]}
    ));
  }
}
export function* updateImportSampleData() {
  const {
    incompleteGenerates = [],
    mappings = [],
    importId,
    subRecordMappingId,
  } = yield select(selectors.mapping);

  if (!incompleteGenerates.length) return;

  const generateFields = yield select(selectors.mappingGenerates, importId, subRecordMappingId);
  const modifiedMappings = deepClone(mappings);

  incompleteGenerates.forEach(generateObj => {
    const {
      value: incompleteGenValue,
      key: incompleteGenKey,
    } = generateObj;
    const incompleteGenIndex = modifiedMappings.findIndex(
      m => m.key === incompleteGenKey
    );
    const childSObject =
      generateFields &&
      generateFields.find(
        field => field.id.indexOf(`${incompleteGenValue}[*].`) > -1
      );

    if (childSObject) {
      const objCopy = { ...modifiedMappings[incompleteGenIndex] };

      objCopy.generate = childSObject.id;
      modifiedMappings[incompleteGenIndex] = objCopy;
    }
  });

  yield put(actions.mapping.updateMappings(modifiedMappings));
}

export const mappingSagas = [
  takeEvery(actionTypes.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.MAPPING.SAVE, saveMappings),
  takeEvery(actionTypes.MAPPING.PREVIEW_REQUESTED, previewMappings),
  takeLatest(actionTypes.MAPPING.REFRESH_GENERATES, refreshGenerates),
  takeLatest(actionTypes.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),
  takeLatest([
    actionTypes.MAPPING.DELETE,
    actionTypes.MAPPING.UPDATE_LOOKUP,
    actionTypes.MAPPING.PATCH_SETTINGS,
  ], validateMappings),
];

import { takeEvery, put, select, call, takeLatest } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { commitStagedChanges } from '../resources';
import generateFieldAndListMappings, { updateMappingConfigs } from '../../../utils/suiteScript/mapping';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};

export function* refreshGenerates({ isInit = false }) {
  const {
    mappings = [],
    ssLinkedConnectionId,
    integrationId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMappings);

  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const { import: importRes } = flow;
  const {type: importType, _connectionId} = importRes;

  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields = [] } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
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

        if (sObjectList.indexOf(childRelationshipObject.childSObject) === -1) {
          sObjectList.push(childRelationshipObject.childSObject);
        }
      }
    });
    if (isInit) {
      // during init, parent sObject metadata is already fetched.
      sObjectList = sObjectList.filter(sObject => sObject !== sObjectType);
    }
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          sObjects: sObjectList,
        },
      }
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    const opts = {
      refreshCache: !isInit,
    };

    if (subRecordMappingId) {
      const netsuiteSubrecordObj = yield select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

      opts.recordType = netsuiteSubrecordObj.recordType;
    }
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: opts,
      }
    )
    );
  }
}
export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId, subRecordMappingId }) {
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const {export: exportRes, import: importRes} = flow;
  const {type: importType} = importRes;

  let exportType;

  if (exportRes.netsuite && ['restlet', 'batch', 'realtime'].includes(exportRes.netsuite.type)) {
    exportType = 'netsuite';
  } else {
    exportType = exportRes.type;
  }
  const options = {
    importType,
    exportType,
    connectionId: importRes._connectionId,
    subRecordMappingId,
  };
  let mapping;
  let lookups;

  if (importType === 'netsuite') {
    if (subRecordMappingId) {
      const netsuiteSubrecordObj = yield select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

      options.recordType = netsuiteSubrecordObj.recordType;
      mapping = netsuiteSubrecordObj.mapping;
      lookups = netsuiteSubrecordObj.lookups;
    } else {
      options.recordType = importRes.netsuite.recordType;
      mapping = importRes.mapping;
      lookups = importRes.netsuite.lookups;
    }
  } else if (importType === 'salesforce') {
    options.sObjectType = importRes.salesforce.sObjectType;
    mapping = importRes.mapping;
    lookups = importRes[importType].lookups;
  }
  const subRecordFields = mapping?.fields?.filter(f => f.mappingId);
  // const {type: importType, mapping} = importRes;
  const generatedMappings = generateFieldAndListMappings({importType, mapping, exportRes, isGroupedSampleData: false});

  yield put(actions.suiteScript.mapping.initComplete(
    {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      generatedMappings,
      subRecordFields,
      lookups,
      options,
    }));
  yield call(refreshGenerates, {isInit: true });
}

export function* saveMappings() {
  const {
    mappings,
    lookups,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    recordType,
    subRecordFields,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const {export: exportConfig, import: importRes, _id: resourceId} = flow;
  const { type: importType, _connectionId } = importRes;
  const options = {};

  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;

    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });

    options.childRelationships = childRelationshipFields;
  } else if (importType === 'netsuite') {
    options.recordType = recordType;
  }
  const _mappings = updateMappingConfigs({importType, mappings, exportConfig, options});

  // add subrecord fields
  if (subRecordFields?.length) {
    _mappings.fields = [..._mappings.fields, ...subRecordFields];
  }
  const patchSet = [];

  if (subRecordMappingId) {
    const {subRecordImports} = importRes?.netsuite;
    const modifiedsubRecordImports = deepClone(subRecordImports);
    const modifyMappingForSubRecord = subRecords => {
      if (subRecords?.length) {
        for (let i = 0; i < subRecords.length; i += 1) {
          const subRecord = subRecords[i];

          if (subRecord.mappingId === subRecordMappingId) {
            subRecord.mapping = _mappings;
            subRecord.lookups = lookups;
            break;
          }
          modifyMappingForSubRecord(subRecord?.subRecordImports);
        }
      }
    };

    modifyMappingForSubRecord(modifiedsubRecordImports);
    patchSet.push({
      op: 'replace',
      path: '/import/netsuite/subRecordImports',
      value: modifiedsubRecordImports,
    });
  } else {
    patchSet.push({
      op: importRes.mapping ? 'replace' : 'add',
      path: '/import/mapping',
      value: _mappings,
    });
    if (lookups) {
      patchSet.push({
        op: importRes[importType] && importRes[importType].lookups ? 'replace' : 'add',
        path: `/import/${importType}/lookups`,
        value: lookups,
      });
    }
  }

  const resourceType = 'imports';

  yield put(
    actions.suiteScript.resource.patchStaged(
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      patchSet,
      SCOPES.VALUE,
    )
  );
  const resp = yield call(commitStagedChanges, {
    resourceType,
    id: resourceId,
    scope: SCOPES.VALUE,
    ssLinkedConnectionId,
    integrationId,
  });

  if (resp && (resp.error || resp.conflict)) {
    return yield put(
      actions.suiteScript.mapping.saveFailed()
    );
  }

  return yield put(
    actions.suiteScript.mapping.saveComplete()
  );
}
export function* checkForIncompleteSFGenerateWhilePatch({ field, value = '' }) {
  if (value.indexOf('_child_') === -1) {
    return;
  }
  const {
    mappings = [],
    subRecordMappingId,
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );
  const { import: importRes } = flow;
  const {type: importType} = importRes;

  if (importType !== 'salesforce' || field !== 'generate') {
    return;
  }
  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId });
  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj;
  const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);

  if (childRelationshipField && childRelationshipField.childSObject) {
    const { childSObject, relationshipName } = childRelationshipField;

    yield put(actions.suiteScript.mapping.patchIncompleteGenerates(
      {
        key,
        value: relationshipName,
      }
    )
    );
    yield put(actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          sObjects: [childSObject],
        },
      }
    ));
  }
}

export function* checkForSFSublistExtractPatch({key, value}) {
  const {
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMappings);
  const {data: flowSampleData} = yield select(selectors.suiteScriptFlowSampleData, {ssLinkedConnectionId, integrationId, flowId});

  const childRelationshipField =
  flowSampleData && flowSampleData.find(field => field.value === value);

  if (childRelationshipField && childRelationshipField.childSObject) {
    yield put(actions.suiteScript.mapping.setSFSubListFieldName(value));
    yield put(actions.suiteScript.mapping.updateLastFieldTouched(key));
  }
}

export function* updateImportSampleData() {
  // identify sample data change
  const {
    incompleteGenerates = [],
    mappings = [],
    ssLinkedConnectionId,
    integrationId,
    flowId,
    subRecordMappingId,
  } = yield select(selectors.suiteScriptMappings);

  if (!incompleteGenerates.length) return;

  const {data: generateFields} = yield select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId });
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
      objCopy.rowIdentifier += 1;
      modifiedMappings[incompleteGenIndex] = objCopy;
    }
  });

  yield put(actions.suiteScript.mapping.updateMappings(modifiedMappings));
}

export function* patchGenerateThroughAssistant({value}) {
  const {
    lastModifiedRowKey,
  } = yield select(selectors.suiteScriptMappings);

  // trigger patch only when user has touched some field.On touch of last field lastModifiedRowKey = 'new'
  if (lastModifiedRowKey) {
    yield put(actions.suiteScript.mapping.patchField('generate',
      lastModifiedRowKey,
      value)
    );
  }
}
export const mappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.SAVE, saveMappings),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.REFRESH_GENEREATES, refreshGenerates),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH, checkForSFSublistExtractPatch),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_GENERATE_THROUGH_ASSISTANT, patchGenerateThroughAssistant),

];

import { takeEvery, put, select, call, takeLatest } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import * as selectors from '../../reducers';
import suiteScriptMappingUtil from '../../utils/suiteScriptMapping';
import { commitStagedChanges } from '../suiteScript/resources';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};

export function* refreshGenerates({ ssLinkedConnectionId, integrationId, flowId, isInit = false }) {
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId);
  const { import: importRes } = selectedFlow;
  const {type: importType, _connectionId} = importRes;

  const {
    mappings = [],
  } = yield select(selectors.suiteScriptMapping);
  const {data: importData} = yield select(selectors.getSuiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
  if (importType === 'salesforce') {
    const { sObjectType } = importRes.salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    // during init, parent sObject metadata is already fetched.
    const sObjectList = isInit ? [] : [sObjectType];
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
    yield put(actions.importSampleData.requestSuiteScriptData(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          refreshCache: !isInit,
          sObjects: sObjectList,
        }
      }
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    // TODO
    // if (application === adaptorTypeMap.NetSuiteImport && subRecordMappingId) {
    //   opts.recordType = netsuiteRecordType;
    // }
    yield put(actions.importSampleData.requestSuiteScriptData(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          refreshCache: !isInit,
        }
      }
    )
    );
  }
}
export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId }) {
  yield call(refreshGenerates, {ssLinkedConnectionId, integrationId, flowId, isInit: true });
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId);
  const {export: exportRes, import: importRes} = selectedFlow;
  const {type: importType, mapping} = importRes;
  const generatedMappings = suiteScriptMappingUtil.generateFieldAndListMappings({importType, mapping, exportRes, isGroupedSampleData: false});
  let lookups = [];
  if (importType === 'netsuite' && importRes.netsuite && importRes.netsuite.lookups) { lookups = deepClone(importRes.netsuite.lookups); } else if (importType === 'salesforce' && importRes.salesforce && importRes.salesforce.lookups) { lookups = deepClone(importRes.salesforce.lookups); }
  yield put(actions.suiteScriptMapping.initComplete({ ssLinkedConnectionId, integrationId, flowId, generatedMappings, lookups }));
}

export function* saveMappings({ ssLinkedConnectionId, integrationId, flowId }) {
  const {mappings, lookups} = yield select(selectors.suiteScriptMapping, {ssLinkedConnectionId, integrationId, flowId });
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId);
  const {export: exportConfig, import: importRes} = selectedFlow;
  const {type: importType, recordType} = importRes;

  const _mappings = suiteScriptMappingUtil.updateMappingConfigs({importType, mappings, recordType, exportConfig});
  const patchSet = [];
  patchSet.push({
    op: selectedFlow.import.mapping ? 'replace' : 'add',
    path: '/import/mapping',
    value: _mappings,
  });
  if (lookups) {
    patchSet.push({
      op: lookups ? 'replace' : 'add',
      path: importType === 'netsuite' ? '/import/netsuite/lookups' : '/import/salesforce/lookups',
      value: lookups,
    });
  }

  const resourceId = selectedFlow._id;
  const resourceType = 'imports';
  yield put(
    actions.suiteScript.resource.patchStaged(
      resourceId,
      patchSet,
      SCOPES.VALUE,
      ssLinkedConnectionId,
      integrationId,
      resourceType
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
      actions.suiteScriptMapping.saveFailed({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      })
    );
  }
  return yield put(
    actions.suiteScriptMapping.saveComplete({
      ssLinkedConnectionId,
      integrationId,
      flowId,
    })
  );
}
export function* checkForIncompleteSFGenerateWhilePatch({ ssLinkedConnectionId, integrationId, flowId, field, value = '' }) {
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId);
  const { import: importRes } = selectedFlow;
  const {type: importType} = importRes;

  if (value.indexOf('_child_') === -1) {
    return;
  }
  const {
    mappings = [],
  } = yield select(selectors.suiteScriptMapping);
  if (importType !== 'salesforce' || field !== 'generate') {
    return;
  }
  const {data: importData} = yield select(selectors.getSuiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
  const mappingObj = mappings.find(_mapping => _mapping.generate === value);
  // while adding new row in mapping, key is generated in MAPPING.PATCH_FIELD reducer
  const {key} = mappingObj;
  const childRelationshipField =
          generateFields && generateFields.find(field => field.id === value);
  if (childRelationshipField && childRelationshipField.childSObject) {
    const { childSObject, relationshipName } = childRelationshipField;

    yield put(actions.suiteScriptMapping.patchIncompleteGenerates(
      {
        key,
        value: relationshipName
      }
    )
    );
    yield put(actions.importSampleData.requestSuiteScriptData(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options: {
          sObjects: [childSObject],
        }
      }
    ));
  }
}

export function* updateImportSampleData() {
  // identify sample data change
  const {
    incompleteGenerates = [],
    mappings = [],
    ssLinkedConnectionId, integrationId, flowId
  } = yield select(selectors.suiteScriptMapping);
  if (!incompleteGenerates.length) return;
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId);
  const { import: importRes } = selectedFlow;
  const {type: importType} = importRes;

  const {data: importData} = yield select(selectors.getSuiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
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

  yield put(actions.suiteScriptMapping.updateMappings(modifiedMappings));
}

export const suiteScriptMappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT_MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT_MAPPING.SAVE, saveMappings),
  takeLatest(actionTypes.SUITESCRIPT_MAPPING.REFRESH_GENEREATES, refreshGenerates),
  takeLatest(actionTypes.SUITESCRIPT_MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),
];

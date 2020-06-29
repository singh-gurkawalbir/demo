import { takeEvery, put, select, call, takeLatest } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import suiteScriptMappingUtil from '../../../utils/suiteScriptMapping';
import { commitStagedChanges } from '../resources';

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
  } = yield select(selectors.suiteScriptMappings);

  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importConfig } = flow;
  const {type: importType, _connectionId} = importConfig;

  const {data: importData} = yield select(selectors.getSuiteScriptImportSampleData, {ssLinkedConnectionId, integrationId, flowId});
  const generateFields = suiteScriptMappingUtil.getFormattedGenerateData(
    importData,
    importType
  );
  if (importType === 'salesforce') {
    const { sObjectType } = importConfig.salesforce;
    // getting all childRelationshipFields of parent sObject
    const { data: childRelationshipFields = [] } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    let sObjectList = [];
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
        }
      }
    ));
    // in case of salesforce import, fetch all child sObject reference
  } else {
    // TODO
    // if (application === adaptorTypeMap.NetSuiteImport && subRecordMappingId) {
    //   opts.recordType = netsuiteRecordType;
    // }
    yield put(actions.suiteScript.importSampleData.request(
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
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const {export: exportRes, import: importConfig} = flow;
  const {type: importType, mapping} = importConfig;
  const generatedMappings = suiteScriptMappingUtil.generateFieldAndListMappings({importType, mapping, exportRes, isGroupedSampleData: false});
  let lookups = [];
  if (importType === 'netsuite' && importConfig.netsuite && importConfig.netsuite.lookups) { lookups = deepClone(importConfig.netsuite.lookups); } else if (importType === 'salesforce' && importConfig.salesforce && importConfig.salesforce.lookups) { lookups = deepClone(importConfig.salesforce.lookups); }
  const exportType = flow.export.netsuite ? 'netsuite' : flow.export.type;

  const options = {
    importType,
    exportType,
    connectionId: importConfig._connectionId
  };
  if (importType === 'netsuite') {
    options.recordType = importConfig.netsuite.recordType;
  } else if (importType === 'salesforce') {
    options.sObjectType = importConfig.salesforce.sObjectType;
  }
  yield put(actions.suiteScript.mapping.initComplete(
    {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      generatedMappings,
      lookups,
      options
    }));
  yield call(refreshGenerates, {isInit: true });
}

export function* saveMappings() {
  const {
    mappings,
    lookups,
    ssLinkedConnectionId,
    integrationId,
    flowId
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const {export: exportConfig, import: importConfig, _id: resourceId} = flow;
  const {type: importType, _connectionId } = importConfig;
  const options = {};
  if (importType === 'salesforce') {
    const { sObjectType } = importConfig.salesforce;

    const { data: childRelationshipFields } = yield select(selectors.getMetadataOptions,
      {
        connectionId: ssLinkedConnectionId,
        commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
        filterKey: 'salesforce-sObjects-childReferenceTo',
      });
    options.childRelationships = childRelationshipFields;
  } else if (importType === 'netsuite') {
    const { recordType } = importConfig.netsuite;
    options.recordType = recordType;
  }
  const _mappings = suiteScriptMappingUtil.updateMappingConfigs({importType, mappings, exportConfig, options});
  const patchSet = [];
  patchSet.push({
    op: importConfig.mapping ? 'replace' : 'add',
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
    ssLinkedConnectionId, integrationId, flowId,
  } = yield select(selectors.suiteScriptMappings);
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importConfig } = flow;
  const {type: importType} = importConfig;
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

    yield put(actions.suiteScript.mapping.patchIncompleteGenerates(
      {
        key,
        value: relationshipName
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
    ssLinkedConnectionId,
    integrationId,
    flowId
  } = yield select(selectors.suiteScriptMappings);
  if (!incompleteGenerates.length) return;
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importConfig } = flow;
  const {type: importType} = importConfig;

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

  yield put(actions.suiteScript.mapping.updateMappings(modifiedMappings));
}

export const mappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT.MAPPING.SAVE, saveMappings),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.REFRESH_GENEREATES, refreshGenerates),
  takeLatest(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD, checkForIncompleteSFGenerateWhilePatch),
  takeLatest(actionTypes.METADATA.RECEIVED, updateImportSampleData),


];

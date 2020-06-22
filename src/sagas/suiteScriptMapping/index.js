import { takeEvery, put, select, call } from 'redux-saga/effects';
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
export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId }) {
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
export const suiteScriptMappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT_MAPPING.INIT, mappingInit),
  takeEvery(actionTypes.SUITESCRIPT_MAPPING.SAVE, saveMappings),
];

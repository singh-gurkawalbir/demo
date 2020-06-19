import { takeEvery, put, select } from 'redux-saga/effects';
// import { deepClone } from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { generateFieldAndListMappings } from './util';


export function* mappingInit({ ssLinkedConnectionId, integrationId, flowId }) {
  const flows = yield select(
    selectors.suiteScriptResourceList,
    {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    }
  );
  const selectedFlow = flows && flows.find(flow => flow._id === flowId)
  const {export: exportRes, import: importRes} = selectedFlow;
  const {type: importType, mapping} = importRes;
  const generatedMappings = generateFieldAndListMappings({importType, mapping, exportRes, isGroupedSampleData: false})
  yield put(actions.suiteScriptMapping.initComplete({ ssLinkedConnectionId, integrationId, flowId, generatedMappings }));
}

export const suiteSciptMappingSagas = [
  takeEvery(actionTypes.SUITESCRIPT_MAPPING.INIT, mappingInit),
];

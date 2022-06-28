import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import shortid from 'shortid';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import { selectors } from '../../reducers';
import { commitStagedChanges } from '../resources';
import { requestSampleData } from '../sampleData/flows';
import responseMappingUtil from '../../utils/responseMapping';
import { emptyObject } from '../../constants';
import { autoEvaluateProcessorWithCancel } from '../editor';
import { getPageProcessorFromFlow } from '../../utils/flows';

export function* responseMappingInit({ flowId, resourceId, resourceType }) {
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;
  const pageProcessor = getPageProcessorFromFlow(flow, resourceId);

  if (!pageProcessor) {
    return yield put(actions.responseMapping.initFailed());
  }

  // responseMappingExtract must be loaded as it is used to show input data to response mapper
  // we also need to explicitly request for flowInput stage which is used to show output to response mapper
  const responseMappingInput = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    stage: 'responseMappingExtract',
    resourceType,
  });

  if (responseMappingInput.status !== 'received') {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'responseMappingExtract',
    });
  }

  const flowInputStage = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    stage: 'inputFilter',
    resourceType,
  });

  if (flowInputStage.status !== 'received') {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
    });
  }

  const mappings = responseMappingUtil.getFieldsAndListMappings(pageProcessor.responseMapping);

  yield put(
    actions.responseMapping.initComplete({
      mappings: mappings.map(m => ({
        ...m,
        key: shortid.generate(),
      })),
      flowId,
      resourceId,
      resourceType,
    })
  );
}

export function* responseMappingSave() {
  const { mappings, flowId, resourceId } = yield select(selectors.responseMapping);
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;
  let routerIndex = -1;
  let branchIndex = -1;
  let pageProcessorIndex = -1;

  if (flow?.routers?.length) {
    flow.routers.forEach((router, rIndex) => {
      router.branches.forEach((branch, bIndex) => {
        branch.pageProcessors.forEach((pp, ppIndex) => {
          if (pp.id === resourceId) {
            routerIndex = rIndex;
            branchIndex = bIndex;
            pageProcessorIndex = ppIndex;
          }
        });
      });
    });
  } else if (flow?.pageProcessors?.length) {
    pageProcessorIndex = flow.pageProcessors.findIndex(({_importId, _exportId}) => _exportId === resourceId || _importId === resourceId);
  }

  if ((!flow?.pageProcessors && !flow?.routers) || pageProcessorIndex === -1) {
    return yield put(actions.responseMapping.saveFailed());
  }
  const patchSet = [];
  const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(
    mappings
  );

  patchSet.push({
    op: 'replace',
    path: flow?.routers?.length ? `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}/responseMapping`
      : `/pageProcessors/${pageProcessorIndex}/responseMapping`,
    value: mappingsWithListsAndFields,
  });

  yield put(actions.resource.patchStaged(flowId, patchSet, SCOPES.VALUE));
  const error = yield call(commitStagedChanges, {
    resourceType: 'flows',
    id: flowId,
    scope: SCOPES.VALUE,
  });

  // trigger save failed in case of error
  if (error) {
    return yield put(actions.responseMapping.saveFailed());
  }

  // trigger save complete in case of success
  yield put(actions.responseMapping.saveComplete());
}

export function* autoPreview() {
  const { resourceId } = yield select(selectors.responseMapping);

  yield call(autoEvaluateProcessorWithCancel, { id: `responseMappings-${resourceId}` });
}

export const responseMappingSagas = [
  takeLatest(actionTypes.RESPONSE_MAPPING.INIT, responseMappingInit),
  takeEvery(actionTypes.RESPONSE_MAPPING.SAVE, responseMappingSave),
  takeLatest([actionTypes.RESPONSE_MAPPING.PATCH_FIELD,
    actionTypes.RESPONSE_MAPPING.DELETE], autoPreview),
];

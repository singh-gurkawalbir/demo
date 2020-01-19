import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers';
import { JOB_STATUS, JOB_TYPES, EMPTY_RAW_DATA } from '../../utils/constants';
import { fileTypeToApplicationTypeMap } from '../../utils/file';
import { uploadRawData } from '../uploadFile';

export function* run({ flowId, customStartDate, options = {} }) {
  const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
    resourceId: flowId,
  });

  if (customStartDate) {
    opts.body = {
      export: { startDate: customStartDate },
    };
  }

  if (options.isDataLoader) {
    opts.body = {
      runKey: options.runKey,
    };
  }

  const flow = yield select(selectors.resource, 'flows', flowId);

  if (!flow) return true;

  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  const additionalProps = {
    _id: job._jobId,
    _flowId: flowId,
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.QUEUED,
  };

  additionalProps._integrationId = flow._integrationId;

  yield put(
    actions.job.receivedFamily({ job: { ...job, ...additionalProps } })
  );
  yield put(actions.job.requestInProgressJobStatus());
}

export function* runDataLoader({ flowId, fileContent, fileType }) {
  const flow = yield select(selectors.resource, 'flows', flowId);

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    const exportId = flow.pageGenerators[0]._exportId;
    const exp = yield select(selectors.resource, 'exports', exportId);

    if (exp && exp.type === 'simple') {
      if (fileContent) {
        const dataLoaderFileType = fileTypeToApplicationTypeMap[fileType];
        const rawDataKey = yield call(uploadRawData, {
          file: fileContent,
          fileName: `file.${fileType}`,
          fileType: dataLoaderFileType,
        });
        const options = {
          isDataLoader: true,
          runKey: rawDataKey,
        };

        yield put(actions.flow.run({ flowId, options }));
      } else if (exp && exp.rawData && exp.rawData !== EMPTY_RAW_DATA) {
        const options = {
          isDataLoader: true,
          runKey: exp.rawData,
        };

        yield call(run, { flowId, options });
        // Removes rawData field from the Data loader export, once the flow is run
        // TODO @Raghu Remove this EMPTY_RAW_DATA and remove rawData prop once BE Fix is done
        // As currently, we are not able to remove this prop once set. We assign EMPTY_RAW_DATA to handle that case
        const patchSet = [
          {
            op: 'replace',
            path: '/rawData',
            value: EMPTY_RAW_DATA,
          },
        ];

        yield put(actions.resource.patchStaged(exportId, patchSet, 'value'));
        yield put(actions.resource.commitStaged('exports', exportId, 'value'));
      }
    }
  }
}

export function* getLastExportDateTime({ flowId }) {
  const path = `/flows/${flowId}/lastExportDateTime`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'GET', error && error.message, false));
    yield put(actions.flow.receivedLastExportDateTime(flowId));

    return undefined;
  }

  if (response) {
    yield put(actions.flow.receivedLastExportDateTime(flowId, response));
  }
}

export const flowSagas = [
  takeEvery(actionTypes.FLOW.RUN, run),
  takeEvery(actionTypes.FLOW.RUN_DATA_LOADER, runDataLoader),
  takeEvery(
    actionTypes.FLOW.REQUEST_LAST_EXPORT_DATE_TIME,
    getLastExportDateTime
  ),
];

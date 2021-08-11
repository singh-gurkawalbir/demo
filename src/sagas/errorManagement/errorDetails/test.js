/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {
  requestErrorDetails,
  retryErrors,
  resolveErrors,
  _formatErrors,
  saveAndRetryError,
  downloadErrors,
  selectAllErrorDetailsInCurrPage,
  deselectAllErrors,
} from './index';
import { updateRetryData } from '../metadata';
import { selectors } from '../../../reducers';
import getRequestOptions from '../../../utils/requestOptions';
import actionTypes from '../../../actions/types';
import openExternalUrl from '../../../utils/window';

const flowId = 'flow-123';
const resourceId = 'id-123';
const retryId = 'retry-123';

describe('errorDetails sagas', () => {
  describe('requestErrorDetails saga', () => {
    test('should invoke api for open/resolved errors without loadMore', () => {
      const openErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
      });
      const resolvedErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        isResolved: true,
      });

      const test1 = expectSaga(requestErrorDetails, { flowId, resourceId })
        .call(apiCallWithRetry, {
          path: openErrorOptions.path,
          opts: openErrorOptions.opts,
        })
        .run();
      const test2 = expectSaga(requestErrorDetails, { flowId, resourceId, isResolved: true })
        .call(apiCallWithRetry, {
          path: resolvedErrorOptions.path,
          opts: resolvedErrorOptions.opts,
        })
        .run();

      return test1 && test2;
    });
    test('should invoke api for open/resolved errors with loadMore', () => {
      const openErrors = {
        errors: [{ errorId: 'error123', message: 'application error' }],
        nextPageURL: '/api/flows/flowId/exportId/errors?startAtErrorId=errorId',
      };
      const resolvedErrors = {
        resolved: [{ errorId: 'error123', message: 'application error', resolvedBy: '123456543' }],
        nextPageURL: '/api/flows/flowId/exportId/resolved?startAtErrorId=errorId',
      };
      const openErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        nextPageURL: openErrors.nextPageURL,
      });
      const resolvedErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        isResolved: true,
        nextPageURL: resolvedErrors.nextPageURL,
      });

      const test1 = expectSaga(requestErrorDetails, { flowId, resourceId, loadMore: true })
        .provide([
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), openErrors],
        ])
        .call(apiCallWithRetry, {
          path: openErrorOptions.path,
          opts: openErrorOptions.opts,
        })
        .run();
      const test2 = expectSaga(requestErrorDetails, { flowId, resourceId, loadMore: true, isResolved: true })
        .provide([
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: true,
          }), resolvedErrors],
        ])
        .call(apiCallWithRetry, {
          path: resolvedErrorOptions.path,
          opts: resolvedErrorOptions.opts,
        })
        .run();

      return test1 && test2;
    });
    test('should invoke api with filters source & date', () => {
      const yesterdayDate = new Date();

      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      const openErrors = {
        errors: [{ errorId: 'error123', message: 'application error' }],
        nextPageURL: '/api/flows/flowId/exportId/errors?startAtErrorId=errorId',
      };
      const resolvedErrors = {
        resolved: [{ errorId: 'error123', message: 'application error', resolvedBy: '123456543' }],
        nextPageURL: '/api/flows/flowId/exportId/resolved?startAtErrorId=errorId',
      };

      const openFilters = { sources: ['application'], occuredAt: { startDate: yesterdayDate, endDate: new Date() }};
      const resolvedFilters = {sources: ['connection'], resolvedAt: { startDate: yesterdayDate, endDate: new Date() }};

      const openErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        nextPageURL: openErrors.nextPageURL,
        filters: openFilters,
      });
      const resolvedErrorOptions = getRequestOptions(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        isResolved: true,
        nextPageURL: resolvedErrors.nextPageURL,
        filters: resolvedFilters,
      });

      const test1 = expectSaga(requestErrorDetails, { flowId, resourceId, loadMore: true })
        .provide([
          [select(selectors.filter, 'openErrors'), openFilters],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), openErrors],
        ])
        .call(apiCallWithRetry, {
          path: openErrorOptions.path,
          opts: openErrorOptions.opts,
        })
        .run();
      const test2 = expectSaga(requestErrorDetails, { flowId, resourceId, loadMore: true, isResolved: true })
        .provide([
          [select(selectors.filter, 'resolvedErrors'), resolvedFilters],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: true,
          }), resolvedErrors],
        ])
        .call(apiCallWithRetry, {
          path: resolvedErrorOptions.path,
          opts: resolvedErrorOptions.opts,
        })
        .run();

      return test1 && test2;
    });
    test('should call _formatErrors to add application name for source ', () => {
      const openErrors = {
        errors: [
          { errorId: 'error123', source: 'application' },
          { errorId: 'error123', source: 'connection' },
        ],
      };

      return expectSaga(requestErrorDetails, { flowId, resourceId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), openErrors],
        ])
        .call(_formatErrors, { resourceId, errors: openErrors.errors })
        .run();
    });
    test('should dispatch received action with formatted errors incase of api success ', () => {
      const openErrors = {
        errors: [
          { errorId: 'error123', source: 'application' },
          { errorId: 'error123', source: 'connection' },
        ],
      };
      const applicationName = 'bigcommerce';
      const formattedErrors = {
        errors: [
          { errorId: 'error123', source: applicationName },
          { errorId: 'error123', source: 'connection' },
        ],
      };

      return expectSaga(requestErrorDetails, { flowId, resourceId })
        .provide([
          [select(selectors.applicationName, resourceId), applicationName],
          [matchers.call.fn(apiCallWithRetry), openErrors],
        ])
        .call(_formatErrors, { resourceId, errors: openErrors.errors })
        .put(actions.errorManager.flowErrorDetails.received({
          flowId,
          resourceId,
          errorDetails: formattedErrors,
          loadMore: false,
          isResolved: false,
        }))
        .run();
    });
    test('should do nothing incase of api failure', () => {
      const error = { status: 422, message: 'error'};

      return expectSaga(requestErrorDetails, { flowId, resourceId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.call.fn(_formatErrors)
        .not.put(actions.errorManager.flowErrorDetails.received({
          flowId,
          resourceId,
          errorDetails: undefined,
          loadMore: false,
          isResolved: false,
        }))
        .run();
    });
  });
  describe('retryErrors saga', () => {
    test('should invoke retry api with passed retryIds or from the selected errors and dispatch retryReceived action with number of errors retried', () => {
      const retryIds = ['id1', 'id2', 'id3'];

      const testWithPassingRetryIds = expectSaga(retryErrors, { flowId, resourceId, retryIds })
        .call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/retry`,
          opts: {
            method: 'POST',
            body: {
              retryDataKeys: retryIds,
            },
          },
          hidden: true,
        })
        .run();
      const testWithoutPassingRetryIds = expectSaga(retryErrors, { flowId, resourceId })
        .provide([
          [select(selectors.selectedRetryIds, {
            flowId,
            resourceId,
            isResolved: false,
          }), retryIds],
        ])
        .call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/retry`,
          opts: {
            method: 'POST',
            body: {
              retryDataKeys: retryIds,
            },
          },
          hidden: true,
        })
        .run();

      return testWithPassingRetryIds && testWithoutPassingRetryIds;
    });
    test('should invoke retry api and do nothing incase of api failure', () => {
      const retryIds = ['id1', 'id2', 'id3'];
      const error = { status: 422, message: 'error'};

      return expectSaga(retryErrors, { flowId, resourceId, retryIds, retryAll: false })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId }))
        .not.put(actions.errorManager.flowErrorDetails.retryReceived({
          flowId,
          resourceId,
          response: undefined,
          retryCount: 0,
        }))
        .run();
    });
    test('should dispatch selectErrors action to unselect retried errors if they are from resolved error list ', () => {
      const retryIds = ['id1', 'id2', 'id3'];
      const response = { _jobId: 'job-123' };
      const errors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
        { errorId: 'error3', message: 'invalid id', retryDataKey: 'id3' },
      ];

      return expectSaga(retryErrors, { flowId, resourceId, retryIds, isResolved: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: true,
          }), { errors }],
        ])
        .put(actions.errorManager.flowErrorDetails.retryReceived({
          flowId,
          resourceId,
          retryCount: retryIds.length,
        }))
        .put(actions.errorManager.flowErrorDetails.selectErrors({
          flowId,
          resourceId,
          errorIds: ['error1', 'error2', 'error3'],
          checked: false,
          isResolved: true,
        }))
        .run();
    });
    test('should dispatch remove action to remove retried open errors from the list', () => {
      const retryIds = ['id1', 'id2', 'id3'];
      const response = { _jobId: 'job-123' };
      const errors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1', traceKey: 't1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
        { errorId: 'error3', message: 'invalid id', retryDataKey: 'id3', traceKey: 't2' },
      ];
      const errorIds = ['error1', 'error2', 'error3'];

      return expectSaga(retryErrors, { flowId, resourceId, retryIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), { errors }],
        ])
        .put(actions.errorManager.flowErrorDetails.retryReceived({
          flowId,
          resourceId,
          retryCount: retryIds.length,
        }))
        .not.put(actions.errorManager.flowErrorDetails.selectErrors({
          flowId,
          resourceId,
          errorIds,
          checked: false,
          isResolved: true,
        }))
        .put(actions.errorManager.flowErrorDetails.remove({
          flowId,
          resourceId,
          errorIds,
        }))
        .run();
    });
    test('should dispatch requestPoll action to start polling for retry status if there are retryIds requested for retry succesfully', () => {
      const retryIds = ['id1', 'id2', 'id3'];
      const response = { _jobId: 'job-123' };
      const errors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1', traceKey: 't1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
        { errorId: 'error3', message: 'invalid id', retryDataKey: 'id3', traceKey: 't2' },
      ];

      return expectSaga(retryErrors, { flowId, resourceId, retryIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), { errors }],
        ])
        .put(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId }))
        .run();
    });
    test('should not dispatch requestPoll action if there are no retryIds requested for retry', () => {
      const retryIds = [];
      const response = { _jobId: 'job-123' };
      const errors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1', traceKey: 't1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
        { errorId: 'error3', message: 'invalid id', retryDataKey: 'id3', traceKey: 't2' },
      ];

      return expectSaga(retryErrors, { flowId, resourceId, retryIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), { errors }],
        ])
        .not.put(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId }))
        .run();
    });
    test('should retry all the filtered errors using resourceFilteredErrorDetails selector when retryAll is true ', () => {
      const response = { _jobId: 'job-123' };
      const errors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
        { errorId: 'error3', message: 'invalid id', retryDataKey: 'id3' },
      ];
      const filteredErrors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
      ];

      return expectSaga(retryErrors, { flowId, resourceId, retryAll: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
          [select(selectors.resourceFilteredErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), { errors: filteredErrors }],
          [select(selectors.allResourceErrorDetails, {
            flowId,
            resourceId,
            isResolved: false,
          }), { errors }],
        ])
        .put(actions.errorManager.flowErrorDetails.retryReceived({
          flowId,
          resourceId,
          retryCount: filteredErrors.length,
        }))
        .put(actions.errorManager.flowErrorDetails.remove({
          flowId,
          resourceId,
          errorIds: filteredErrors.map(e => e.errorId),
        }))
        .run();
    });
  });
  describe('resolveErrors saga', () => {
    test('should invoke resolve api with passed errorIds or from the selected errors and dispatch resolveReceived action on api success', () => {
      const errorIds = ['error1', 'error2', 'error3'];

      const testWithPassingErrorIds = expectSaga(resolveErrors, { flowId, resourceId, errorIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/resolved`,
          opts: {
            method: 'PUT',
            body: {
              errors: errorIds,
            },
          },
          hidden: true,
        })
        .put(actions.errorManager.flowErrorDetails.resolveReceived({
          flowId,
          resourceId,
          resolveCount: errorIds.length,
        }))
        .run();
      const testWithoutPassingErrorIds = expectSaga(resolveErrors, { flowId, resourceId })
        .provide([
          [select(selectors.selectedErrorIds, {
            flowId,
            resourceId,
          }), errorIds],
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .call(apiCallWithRetry, {
          path: `/flows/${flowId}/${resourceId}/resolved`,
          opts: {
            method: 'PUT',
            body: {
              errors: errorIds,
            },
          },
          hidden: true,
        })
        .put(actions.errorManager.flowErrorDetails.resolveReceived({
          flowId,
          resourceId,
          resolveCount: errorIds.length,
        }))
        .run();

      return testWithPassingErrorIds && testWithoutPassingErrorIds;
    });
    test('should do nothing if the resolve api is failed', () => {
      const errorIds = ['error1', 'error2', 'error3'];
      const error = { status: 422, message: 'error'};

      return expectSaga(resolveErrors, { flowId, resourceId, errorIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.put(actions.errorManager.flowErrorDetails.resolveReceived({
          flowId,
          resourceId,
          resolveCount: errorIds.length,
        }))
        .not.put(actions.errorManager.flowErrorDetails.remove({
          flowId,
          resourceId,
          errorIds,
        }))
        .run();
    });
    test('should dispatch remove action with all errorIds successfully resolved to remove from the list', () => {
      const errorIds = ['error1', 'error2', 'error3'];

      return expectSaga(resolveErrors, { flowId, resourceId, errorIds })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .put(actions.errorManager.flowErrorDetails.resolveReceived({
          flowId,
          resourceId,
          resolveCount: errorIds.length,
        }))
        .put(actions.errorManager.flowErrorDetails.remove({
          flowId,
          resourceId,
          errorIds,
        }))
        .run();
    });
    test('should resolve all the filtered errors using resourceFilteredErrorDetails selector when resolveAll is true, ', () => {
      const filteredErrors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
      ];

      return expectSaga(resolveErrors, { flowId, resourceId, resolveAll: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.resourceFilteredErrorDetails, { flowId, resourceId }), { errors: filteredErrors}],
        ])
        .put(actions.errorManager.flowErrorDetails.resolveReceived({
          flowId,
          resourceId,
          resolveCount: filteredErrors.length,
        }))
        .put(actions.errorManager.flowErrorDetails.remove({
          flowId,
          resourceId,
          errorIds: filteredErrors.map(e => e.errorId),
        }))
        .run();
    });
  });
  describe('_formatErrors saga', () => {
    test('should return empty list incase of no errors passed', () => {
      const test1 = expectSaga(_formatErrors, { errors: [], resourceId })
        .provide([
          [select(selectors.applicationName, resourceId), 'bigcommerce'],
        ])
        .returns([])
        .run();
      const test2 = expectSaga(_formatErrors, { resourceId })
        .provide([
          [select(selectors.applicationName, resourceId), 'bigcommerce'],
        ])
        .returns([])
        .run();

      return test1 && test2;
    });
    test('should return the list unchanged if none of the errors have source as application', () => {
      const errors = [
        { errorId: 'error1', message: 'application error', source: 'connection'},
        { errorId: 'error2', message: 'source error', source: 'premap'},
        { errorId: 'error3', message: 'invalid id', source: 'postmap'},
      ];

      expectSaga(_formatErrors, { errors, resourceId })
        .provide([
          [select(selectors.applicationName, resourceId), 'bigcommerce'],
        ])
        .returns(errors)
        .run();
    });
    test('should return the list with source application replaced with actual application name if exists', () => {
      const errors = [
        { errorId: 'error1', message: 'application error', source: 'connection'},
        { errorId: 'error2', message: 'source error', source: 'application'},
        { errorId: 'error3', message: 'invalid id', source: 'application'},
      ];
      const applicationName = 'bigcommerce';
      const formattedErrors = [
        { errorId: 'error1', message: 'application error', source: 'connection'},
        { errorId: 'error2', message: 'source error', source: applicationName},
        { errorId: 'error3', message: 'invalid id', source: applicationName},
      ];
      const testWithValidApplicationName = expectSaga(_formatErrors, { errors, resourceId })
        .provide([
          [select(selectors.applicationName, resourceId), applicationName],
        ])
        .returns(formattedErrors)
        .run();
      const testWithoutApplicationName = expectSaga(_formatErrors, { errors, resourceId })
        .returns(errors)
        .run();

      return testWithValidApplicationName && testWithoutApplicationName;
    });
  });
  describe('saveAndRetryError saga', () => {
    test('should call updateRetryData saga and dispatch retry action to retry the error with updated retry data ', () => {
      const retryData = { test: 4 };

      return expectSaga(saveAndRetryError, { flowId, resourceId, retryId, retryData})
        .provide([
          [matchers.call.fn(updateRetryData), undefined],
        ])
        .call(updateRetryData, { flowId, resourceId, retryId, retryData })
        .put(actions.errorManager.flowErrorDetails.retry({ flowId, resourceId, retryIds: [retryId]}))
        .run();
    });
  });
  describe('downloadErrors saga', () => {
    const yesterdayDate = new Date();

    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    test('should invoke download errors api for open/resolved errors without any date filter', () => {
      const openErrorOptions = getRequestOptions(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
        { flowId, resourceId }
      );
      const resolvedErrorOptions = getRequestOptions(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
        { flowId, resourceId, isResolved: true }
      );
      const response = { signedURL: 'http://mockUrl.com/SHA256/2345sdcv' };
      const downloadOpenErrorsTest = expectSaga(downloadErrors, { flowId, resourceId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, {
          path: openErrorOptions.path,
          opts: openErrorOptions.opts,
        })
        .call(openExternalUrl, { url: response.signedURL })
        .run();
      const downloadResolvedErrorsTest = expectSaga(downloadErrors, { flowId, resourceId, isResolved: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, {
          path: resolvedErrorOptions.path,
          opts: resolvedErrorOptions.opts,
        })
        .call(openExternalUrl, { url: response.signedURL })
        .run();

      return downloadOpenErrorsTest && downloadResolvedErrorsTest;
    });
    test('should invoke download errors api for open errors with occuredAt date filters', () => {
      const filters = {
        fromDate: yesterdayDate.toISOString(),
        toDate: new Date().toISOString(),
      };
      const openErrorOptions = getRequestOptions(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
        { flowId, resourceId, filters }
      );

      const response = { signedURL: 'http://mockUrl.com/SHA256/2345sdcv' };

      return expectSaga(downloadErrors, { flowId, resourceId, filters })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, {
          path: openErrorOptions.path,
          opts: openErrorOptions.opts,
        })
        .call(openExternalUrl, { url: response.signedURL })
        .run();
    });
    test('should invoke download errors api for resolved errors with resolvedAt date filters', () => {
      const filters = {
        fromDate: yesterdayDate.toISOString(),
        toDate: new Date().toISOString(),
      };
      const resolvedErrorOptions = getRequestOptions(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
        { flowId, resourceId, filters, isResolved: true }
      );

      const response = { signedURL: 'http://mockUrl.com/SHA256/2345sdcv' };

      return expectSaga(downloadErrors, { flowId, resourceId, filters, isResolved: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, {
          path: resolvedErrorOptions.path,
          opts: resolvedErrorOptions.opts,
        })
        .call(openExternalUrl, { url: response.signedURL })
        .run();
    });
  });
  describe('selectAllErrorDetailsInCurrPage saga test cases', () => {
    test('should use resourceFilteredErrorsInCurrPage selector to get filtered errors in current page and dispatch selectErrors action', () => {
      const filteredErrors = [
        { errorId: 'error1', message: 'application error', retryDataKey: 'id1' },
        { errorId: 'error2', message: 'source error', retryDataKey: 'id2' },
      ];

      const openErrorsTest = expectSaga(selectAllErrorDetailsInCurrPage, { flowId, resourceId, checked: true })
        .provide([
          [select(selectors.resourceFilteredErrorsInCurrPage, {
            flowId,
            resourceId,
            isResolved: false,
          }), filteredErrors],
        ])
        .put(
          actions.errorManager.flowErrorDetails.selectErrors({
            flowId,
            resourceId,
            errorIds: filteredErrors.map(e => e.errorId),
            checked: true,
            isResolved: false,
          })
        )
        .run();

      const resolvedErrorsTest = expectSaga(selectAllErrorDetailsInCurrPage, { flowId, resourceId, checked: true, isResolved: true })
        .provide([
          [select(selectors.resourceFilteredErrorsInCurrPage, {
            flowId,
            resourceId,
            isResolved: true,
          }), filteredErrors],
        ])
        .put(
          actions.errorManager.flowErrorDetails.selectErrors({
            flowId,
            resourceId,
            errorIds: filteredErrors.map(e => e.errorId),
            checked: true,
            isResolved: true,
          })
        )
        .run();

      return openErrorsTest && resolvedErrorsTest;
    });
  });
  describe('deselectAllErrors saga test cases', () => {
    test('should use selectedErrorIds selector to get all selected errorIds and dispatch selectErrors action for them', () => {
      const errorIds = ['id1', 'id2', 'id3'];

      const openErrorsTest = expectSaga(deselectAllErrors, { flowId, resourceId })
        .provide([
          [select(selectors.selectedErrorIds, {
            flowId,
            resourceId,
            isResolved: false,
          }), errorIds],
        ])
        .put(
          actions.errorManager.flowErrorDetails.selectErrors({
            flowId,
            resourceId,
            errorIds,
            checked: false,
            isResolved: false,
          })
        )
        .run();
      const resolvedErrorsTest = expectSaga(deselectAllErrors, { flowId, resourceId, isResolved: true })
        .provide([
          [select(selectors.selectedErrorIds, {
            flowId,
            resourceId,
            isResolved: true,
          }), errorIds],
        ])
        .put(
          actions.errorManager.flowErrorDetails.selectErrors({
            flowId,
            resourceId,
            errorIds,
            checked: false,
            isResolved: true,
          })
        )
        .run();

      return openErrorsTest && resolvedErrorsTest;
    });
  });
});

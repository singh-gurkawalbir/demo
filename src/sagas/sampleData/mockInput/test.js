
import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestMockInput, _handlePreviewError, _requestImportMockInput, _requestLookupMockInput } from '.';
import { getConstructedResourceObj } from '../flows/utils';
import { pageProcessorPreview } from '../utils/previewCalls';

const resourceId = 'export-123';
const flowId = 'flow-123';
const refresh = 'false';

describe('mockInput sagas', () => {
  describe('_handlePreviewError saga', () => {
    test('should do nothing if there is no resourceId or invalid error', () => {
      const e = {
        status: 401,
        message: '{"message":"invalid processor", "code":"code"}',
      };

      expectSaga(_handlePreviewError, { e })
        .returns(undefined)
        .run();
      expectSaga(_handlePreviewError, { e: {} })
        .returns(undefined)
        .run();
      expectSaga(_handlePreviewError, { resourceId })
        .returns(undefined)
        .run();
    });
    test('should dispatch receivedPreviewError action when there is a valid error', () => {
      const e = {
        status: 422,
        message: '{"message":"invalid processor", "code":"code"}',
      };
      const parsedMessage = { message: 'invalid processor', code: 'code'};

      expectSaga(_handlePreviewError, { e, resourceId })
        .put(actions.mockInput.receivedError(resourceId, parsedMessage))
        .run();
    });
    test('should not dispatch receivedPreviewError action when error code is below 400 or greater than or equal to 500', () => {
      const e = {
        status: 399,
        message: '{"message":"invalid processor", "code":"code"}',
      };
      const parsedMessage = { message: 'invalid processor', code: 'code'};

      expectSaga(_handlePreviewError, { e, resourceId })
        .not.put(actions.mockInput.receivedError(resourceId, parsedMessage))
        .run();

      e.status = 500;
      expectSaga(_handlePreviewError, { e, resourceId })
        .not.put(actions.mockInput.receivedError(resourceId, parsedMessage))
        .run();
    });
  });
  describe('_requestLookupMockInput saga', () => {
    const resourceType = 'exports';

    test('should call pageProcessorPreview saga to fetch preview data for lookup and dispatch mockInput received action on success', () => {
      const previewData = { id: 123 };
      const _pageProcessorDoc = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        oneToMany: true,
        test: { limit: 10 },
      };

      expectSaga(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }),
            _pageProcessorDoc],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType,
            hidden: true,
            previewType: 'flowInput',
            _pageProcessorDoc,
            throwOnError: true,
            includeStages: false,
            refresh,
            includeFilterProcessing: true,
          }), previewData],
        ])
        .call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined })
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          hidden: true,
          previewType: 'flowInput',
          _pageProcessorDoc,
          throwOnError: true,
          includeStages: false,
          refresh,
          includeFilterProcessing: true,
        })
        .put(actions.mockInput.received(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for lookup and dispatch mockInput received action on success if oneToMany is configured on the resource', () => {
      const previewData = { _PARENT: { id: 123 } };
      const _pageProcessorDoc = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        oneToMany: true,
        pathToMany: 'test',
        test: { limit: 10 },
      };

      expectSaga(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }),
            _pageProcessorDoc],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType,
            hidden: true,
            previewType: 'flowInput',
            _pageProcessorDoc,
            throwOnError: true,
            includeStages: false,
            refresh,
            includeFilterProcessing: true,
          }), previewData._PARENT],
        ])
        .call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined })
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          hidden: true,
          previewType: 'flowInput',
          _pageProcessorDoc,
          throwOnError: true,
          includeStages: false,
          refresh,
          includeFilterProcessing: true,
        })
        .put(actions.mockInput.received(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for lookup and call _handlePreviewError saga on failure', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
      };
      const error = { status: 401, message: '{"code":"error code"}' };

      expectSaga(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }), { resourceId, flowId, resourceObj: restResource}],
          [matchers.call.fn(pageProcessorPreview), throwError(error)],
        ])
        .call.fn(pageProcessorPreview)
        .not.put(actions.mockInput.received(resourceId, undefined))
        .call(_handlePreviewError, { e: error, resourceId })
        .run();
    });
  });
  describe('_requestImportMockInput saga', () => {
    const resourceType = 'imports';

    test('should call pageProcessorPreview saga to fetch preview data for import and dispatch mockInput received action on success', () => {
      const previewData = { id: 123 };
      const _pageProcessorDoc = {
        _id: resourceId,
        adaptorType: 'RESTImport',
        oneToMany: true,
        test: { limit: 10 },
      };

      expectSaga(_requestImportMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }),
            _pageProcessorDoc],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType,
            hidden: true,
            _pageProcessorDoc,
            throwOnError: true,
            includeStages: false,
            refresh,
            includeFilterProcessing: true,
          }), previewData],
        ])
        .call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined })
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          hidden: true,
          _pageProcessorDoc,
          throwOnError: true,
          includeStages: false,
          refresh,
          includeFilterProcessing: true,
        })
        .put(actions.mockInput.received(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for import and dispatch mockInput received action on success if oneToMany is configured on the resource', () => {
      const previewData = { _PARENT: { id: 123 } };
      const _pageProcessorDoc = {
        _id: resourceId,
        adaptorType: 'RESTImport',
        oneToMany: true,
        pathToMany: 'test',
        test: { limit: 10 },
      };

      expectSaga(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }),
            _pageProcessorDoc],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType,
            hidden: true,
            previewType: 'flowInput',
            _pageProcessorDoc,
            throwOnError: true,
            includeStages: false,
            refresh,
            includeFilterProcessing: true,
          }), previewData._PARENT],
        ])
        .call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined })
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          hidden: true,
          previewType: 'flowInput',
          _pageProcessorDoc,
          throwOnError: true,
          includeStages: false,
          refresh,
          includeFilterProcessing: true,
        })
        .put(actions.mockInput.received(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for import and call _handlePreviewError saga on failure', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
      };
      const error = { status: 401, message: '{"code":"error code"}' };

      expectSaga(_requestLookupMockInput, { resourceId, resourceType, flowId, refresh })
        .provide([
          [call(getConstructedResourceObj, { resourceId, resourceType, formKey: undefined }), { resourceId, flowId, resourceObj: restResource}],
          [matchers.call.fn(pageProcessorPreview), throwError(error)],
        ])
        .call.fn(pageProcessorPreview)
        .not.put(actions.mockInput.received(resourceId, undefined))
        .call(_handlePreviewError, { e: error, resourceId })
        .run();
    });
  });
  describe('requestMockInput saga', () => {
    test('should do nothing if there is no resourceId or resourceType', () => expectSaga(requestMockInput, {})
      .not.call.fn(_requestLookupMockInput)
      .not.call.fn(_requestImportMockInput)
      .run());
    test('should do nothing if the resourceType is not a valid one for sample data', () => expectSaga(requestMockInput, { resourceId, resourceType: 'flows', flowId, options: {} })
      .not.call.fn(_requestLookupMockInput)
      .not.call.fn(_requestImportMockInput)
      .run());
    test('should call _requestLookupMockInput with refreshCache option incase of lookups', () => {
      const resourceId = 'import-123';

      expectSaga(requestMockInput, { resourceId, resourceType: 'exports', flowId, options: {refreshCache: refresh} })
        .provide([
          [call(_requestLookupMockInput, { resourceId, resourceType: 'exports', flowId, refresh }), {}],
          [select(selectors.isLookUpExport, { flowId, resourceId, resourceType: 'exports' }), true],
        ])
        .call(_requestLookupMockInput, { resourceId, resourceType: 'exports', flowId, refresh })
        .not.call.fn(_requestImportMockInput)
        .run();
    });
    test('should call _requestImportMockInput with refreshCache option incase of imports', () => {
      const resourceId = 'import-123';

      expectSaga(requestMockInput, { resourceId, resourceType: 'imports', flowId, options: {refreshCache: refresh} })
        .provide([
          [call(_requestImportMockInput, { resourceId, resourceType: 'imports', flowId, refresh }), {}],
          [select(selectors.isLookUpExport, { flowId, resourceId, resourceType: 'imports' }), false],
        ])
        .call(_requestImportMockInput, { resourceId, resourceType: 'imports', flowId, refresh })
        .not.call.fn(_requestLookupMockInput)
        .run();
    });
  });
});

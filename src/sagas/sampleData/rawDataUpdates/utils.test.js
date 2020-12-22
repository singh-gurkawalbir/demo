/* global describe, test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { saveRawDataOnResource, saveSampleDataOnResource, removeRawDataOnResource} from './utils';
import { uploadRawData } from '../../uploadFile';
import { EMPTY_RAW_DATA } from '../../../utils/constants';

describe('rawDataUpdates utility sagas', () => {
  describe('saveRawDataOnResource saga', () => {
    test('should do nothing when there is no resourceId or raw data to save', () => expectSaga(saveRawDataOnResource, {})
      .not.call.fn(uploadRawData)
      .run() &&
      expectSaga(saveRawDataOnResource, { resourceId: 'export-123' })
        .not.call.fn(uploadRawData)
        .run()
    );
    test('should dispatch patchStaged and commitStaged with the rawData patchSet', () => {
      const resourceId = 'export-123';
      const rawData = { test: 5 };
      const runKey = 'abc1234';
      const userId = 'user123';
      const patchSet = [{
        op: 'add',
        path: '/rawData',
        value: userId + runKey,
      }];

      return expectSaga(saveRawDataOnResource, { resourceId, rawData })
        .provide([
          [call(uploadRawData, {
            file: rawData,
          }), runKey],
          [select(selectors.ownerUserId), userId],
        ])
        .put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
        .put(actions.resource.commitStaged('exports', resourceId, SCOPES.VALUE))
        .run();
    });
  });
  describe('saveSampleDataOnResource saga', () => {
    test('should do nothing when there is no resourceId or raw data', () => expectSaga(saveSampleDataOnResource, {})
      .not.call.fn(uploadRawData)
      .run() &&
      expectSaga(saveSampleDataOnResource, { resourceId: 'export-123' })
        .not.call.fn(uploadRawData)
        .run());
    test('should dispatch patchStaged and commitStaged with the sampleData patchSet', () => {
      const resourceId = 'export-123';
      const sampleData = { test: 5 };
      const patchSet = [{
        op: 'add',
        path: '/sampleData',
        value: sampleData,
      }];

      return expectSaga(saveSampleDataOnResource, { resourceId, rawData: sampleData, resourceType: 'exports' })
        .delay(50)
        .put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
        .put(actions.resource.commitStaged('exports', resourceId, SCOPES.VALUE))
        .run();
    });
  });
  describe('removeRawDataOnResource saga', () => {
    test('should do nothing if the resourceId is invalid / resource', () => expectSaga(removeRawDataOnResource, {})
      .not.put(actions.resource.patchStaged(undefined, [], SCOPES.VALUE))
      .not.put(actions.resource.commitStaged('some type', undefined, SCOPES.VALUE))
      .run());
    test('should not dispatch actions incase of no rawData', () => {
      const patchSet = [
        {
          op: 'replace',
          path: '/rawData',
          value: EMPTY_RAW_DATA,
        },
      ];
      const resourceId = 'export-123';
      const resourceType = 'exports';

      return expectSaga(removeRawDataOnResource, { resourceId, resourceType })
        .not.put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
        .not.put(actions.resource.commitStaged(resourceType, resourceId, SCOPES.VALUE))
        .run();
    });
    test('should not dispatch actions incase of NS export ', () => {
      const patchSet = [
        {
          op: 'replace',
          path: '/rawData',
          value: EMPTY_RAW_DATA,
        },
      ];
      const resourceId = 'export-123';
      const resourceType = 'exports';
      const resource = {
        _id: resourceId,
        name: 'NS export',
        rawData: 'rawData1234',
        adaptorType: 'NetSuiteExport',
      };

      return expectSaga(removeRawDataOnResource, { resourceId, resourceType })
        .provide([
          [select(selectors.resource, resourceType, resourceId), resource],
        ])
        .not.put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
        .not.put(actions.resource.commitStaged(resourceType, resourceId, SCOPES.VALUE))
        .run();
    });

    test('should dispatch patchStaged and commitStaged with the sampleData patchSet replaced with empty raw data', () => {
      const patchSet = [
        {
          op: 'replace',
          path: '/rawData',
          value: EMPTY_RAW_DATA,
        },
      ];
      const resourceId = 'export-123';
      const resourceType = 'exports';
      const resource = {
        _id: resourceId,
        name: 'rest export',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
      };

      return expectSaga(removeRawDataOnResource, { resourceId, resourceType })
        .provide([
          [select(selectors.resource, resourceType, resourceId), resource],
        ])
        .put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
        .put(actions.resource.commitStaged(resourceType, resourceId, SCOPES.VALUE))
        .run();
    });
  });
});


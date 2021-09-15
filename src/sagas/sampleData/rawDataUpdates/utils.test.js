/* global describe, test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { saveRawDataOnResource } from './utils';
import { uploadRawData } from '../../uploadFile';

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
});


/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { updateFlowDoc } from '../../resourceForm';
import { updateFlowOnResourceUpdate } from './flowUpdates';

describe('sampleData flow saga', () => {
  describe('flowUpdate saga', () => {
    test('should not trigger updateFlowDoc when no flowId context for export', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'exports',
      resourceId: 123,
      patche: null,
    })
      .put(actions.flowData.updateFlowsForResource(123, 'exports'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should not trigger updateFlowDoc when no flowId context for import', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'imports',
      resourceId: 123,
      patche: null,
      context: null,
    })
      .put(actions.flowData.updateFlowsForResource(123, 'imports'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should not trigger updateFlowDoc when no flowId context for script', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'scripts',
      resourceId: 123,
      patche: null,
      context: {
        somethingElse: {}
      }
    })
      .put(actions.flowData.updateFlowsForResource(123, 'scripts'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should trigger updateFlowDoc when no flowId context for export', () => {
      const resourceType = 'exports';
      const resourceId = '123';
      const flowId = '456';
      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        patche: null,
        context: {
          flowId
        },
      })
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: {} }]
        ])
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
    test('should trigger updateFlowDoc when no flowId context for import', () => {
      const resourceType = 'imports';
      const resourceId = '123';
      const flowId = '456';
      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        patche: null,
        context: {
          flowId
        },
      })
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: {} }]
        ])
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
    test('should trigger updateFlowDoc when no flowId context for scripts', () => {
      const resourceType = 'scripts';
      const resourceId = '123';
      const flowId = '456';
      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        patche: null,
        context: {
          flowId
        },
      })
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: {} }]
        ])
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
  });
});

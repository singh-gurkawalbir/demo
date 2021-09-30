/* global describe, test */

import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { requestPreview, createComponents } from '.';
import { getResource } from '../resources';

describe('clone sagas', () => {
  describe('requestPreview saga', () => {
    const resourceType = 'something';
    const resourceId = '123';

    test('should success on successfull api call', () => {
      const testComponents = {
        objects: [
          {
            model: 'dummy',
            doc: {
              _id: 'dummy',
              name: 'dummy',
            },
          },
        ],
      };

      return expectSaga(requestPreview, { resourceType, resourceId })
        .provide([[matchers.call.fn(apiCallWithRetry), testComponents]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.template.receivedPreview(
            testComponents,
            `${resourceType}-${resourceId}`
          )
        )
        .run();
    });
    test('should call failedPreview if api call fails', () => {
      const error = new Error('error');

      return expectSaga(requestPreview, { resourceType, resourceId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.template.failedPreview(`${resourceType}-${resourceId}`))
        .run();
    });
  });

  describe('createComponents saga', () => {
    const resourceId = '123';

    test('should dispatch createdComponents if the newTemplateInstaller is false on successfull api call', () => {
      const resourceType = 'something';
      const cloneData = {
        cMap: { dummy: 'dummy' },
        connectionMap: { dummy: 'dummy' },
        stackId: 'dummy',
        data: {
          name: 'dummy',
          tag: 'dummy',
          sandbox: 'dummy',
          newTemplateInstaller: false,
        },
      };
      const testComponents = [
        {
          model: 'dummy',
          _id: '123',
        },
      ];
      const dependentResource = {
        resourceType: 'something',
        id: '111',
      };
      const outputResource = {
        name: 'dummy',
        _id: 'dummy',
        _integrationId: 'dummy',
      };

      return expectSaga(createComponents, { resourceType, resourceId })
        .provide([
          [select(selectors.template, `${resourceType}-${resourceId}`), cloneData],
          [matchers.call.fn(apiCallWithRetry), testComponents],
          [call(getResource, dependentResource), outputResource],
        ])
        .call.fn(apiCallWithRetry)
        .put(
          actions.template.createdComponents(
            testComponents,
            `${resourceType}-${resourceId}`
          )
        )
        .run();
    });
    test('should dispatch receivedIntegrationClonedStatus if newTemplateInstaller is true and the resource is an integration on successfull api call', () => {
      const resourceType = 'inetgrations';
      const cloneData = {
        cMap: { dummy: 'dummy' },
        connectionMap: { dummy: 'dummy' },
        stackId: 'dummy',
        data: {
          name: 'dummy',
          tag: 'dummy',
          sandbox: 'dummy',
          newTemplateInstaller: true,
        },
      };
      const testComponents = {
        _integrationId: 'something',
      };
      const dependentResource = {
        resourceType: 'something',
        id: '111',
      };
      const outputResource = {
        name: 'dummy',
        _id: 'dummy',
        _integrationId: 'dummy',
      };

      return expectSaga(createComponents, { resourceType, resourceId })
        .provide([
          [select(selectors.template, `${resourceType}-${resourceId}`), cloneData],
          [matchers.call.fn(apiCallWithRetry), testComponents],
          [call(getResource, dependentResource), outputResource],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.resource.requestCollection('integrations'))
        .put(actions.resource.requestCollection('tiles'))
        .put(
          actions.integrationApp.clone.receivedIntegrationClonedStatus(
            resourceId,
            testComponents._integrationId,
            '',
            cloneData.data.sandbox
          )
        )
        .run();
    });
    test('should dispatch failedInstall if api call fails', () => {
      const resourceType = 'something';
      const cloneData = {
        cMap: { dummy: 'dummy' },
        connectionMap: { dummy: 'dummy' },
        stackId: 'dummy',
        data: {
          name: 'dummy',
          tag: 'dummy',
          sandbox: 'dummy',
          newTemplateInstaller: false,
        },
      };
      const error = new Error('error');

      return expectSaga(createComponents, { resourceType, resourceId })
        .provide([
          [select(selectors.template, `${resourceType}-${resourceId}`), cloneData],
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.template.failedInstall(`${resourceType}-${resourceId}`))
        .run();
    });
    test('should dispatch failedInstall and vereceidIntegrationClonedStatus if api call fails and newTemplateInstaller is true', () => {
      const resourceType = 'something';
      const cloneData = {
        cMap: { dummy: 'dummy' },
        connectionMap: { dummy: 'dummy' },
        stackId: 'dummy',
        data: {
          name: 'dummy',
          tag: 'dummy',
          sandbox: 'dummy',
          newTemplateInstaller: true,
        },
      };
      const error = new Error('error');

      return expectSaga(createComponents, { resourceType, resourceId })
        .provide([
          [select(selectors.template, `${resourceType}-${resourceId}`), cloneData],
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.template.failedInstall(`${resourceType}-${resourceId}`))
        .put(
          actions.integrationApp.clone.receivedIntegrationClonedStatus(
            resourceId,
            '',
            error
          )
        )
        .run();
    });
  });
});

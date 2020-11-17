/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { getResource } from '../resources';
import { apiCallWithRetry } from '../index';
import {
  generateZip,
  requestPreview,
  createComponents,
  verifyBundleOrPackageInstall,
} from '.';
import templateUtil from '../../utils/template';

describe('generateZip sagas', () => {
  const integrationId = '123';
  const response = { signedURL: 'something' };

  test('should succeed on successful api call', () =>
    expectSaga(generateZip, { integrationId })
      .provide([[matchers.call.fn(apiCallWithRetry), response]])
      .call.fn(apiCallWithRetry)
      .run());

  test('should return undefined if api call fails', () => {
    const error = new Error('error');

    return expectSaga(generateZip, { integrationId })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .run();
  });
});

describe('requestPreviews sagas', () => {
  const templateId = '123';

  test('should preview successfully on successfull api call', () => {
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

    return expectSaga(requestPreview, { templateId })
      .provide([[matchers.call.fn(apiCallWithRetry), testComponents]])
      .call.fn(apiCallWithRetry)
      .put(actions.template.receivedPreview(testComponents, templateId))
      .run();
  });
  test('should dispatch failedPreview if api call fails', () => {
    const error = new Error('error');

    return expectSaga(requestPreview, { templateId })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .put(actions.template.failedPreview(templateId))
      .run();
  });
});

describe('createComponents sagas', () => {
  const templateId = '123';
  const runKey = 'dummy';

  test('should dispatch createdComponents on successfull api call', () => {
    const templateData = {
      cMap: { dummy: 'dummy' },
      stackId: 'dummy',
    };
    const template = {
      name: 'dummy',
    };
    const userPreferences = { environment: 'something' };
    const components = [
      {
        model: 'something',
        _id: '111',
      },
      {
        model: 'something',
        _id: '222',
      },
    ];
    const dependentResources = templateUtil.getDependentResources(components) || [];
    const provideResource = ({ args: [dependentResource]}, next) => (
      dependentResource.id ? { ...dependentResource, _integrationId: 'dummy' } : next()
    );

    const saga = expectSaga(createComponents, { templateId, runKey })
      .provide([
        [select(selectors.templateSetup, templateId), templateData],
        [(select(selectors.marketplaceTemplateById, { templateId }), template)],
        [select(selectors.userPreferences), userPreferences],
        [matchers.call.fn(apiCallWithRetry), components],
        [matchers.call.fn(getResource), dynamic(provideResource)],
      ])
      .call.fn(apiCallWithRetry);

    dependentResources.map(dependentResource => (
      saga.call(getResource, dependentResource)
    ));

    return saga.put(actions.template.createdComponents(components, templateId)).run();
  });
  test('should dispatch receivedIntegrationClonedStatus if template is an integration on successfull api call', () => {
    const templateData = {
      cMap: { dummy: 'dummy' },
      stackId: 'dummy',
    };
    const template = {
      name: 'dummy',
    };
    const userPreferences = { environment: 'something' };
    const components = {
      _integrationId: 'something',
    };

    return expectSaga(createComponents, { templateId, runKey })
      .provide([
        [select(selectors.templateSetup, templateId), templateData],
        [(select(selectors.marketplaceTemplateById, { templateId }), template)],
        [select(selectors.userPreferences), userPreferences],
        [matchers.call.fn(apiCallWithRetry), components],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.resource.requestCollection('integrations'))
      .put(actions.resource.requestCollection('tiles'))
      .put(
        actions.integrationApp.clone.receivedIntegrationClonedStatus(
          templateId,
          components._integrationId,
          ''
        )
      )
      .run();
  });
  test('should dispatch failedInstall if api call fails', () => {
    const templateData = {
      cMap: { dummy: 'dummy' },
      stackId: 'dummy',
    };
    const template = {
      name: 'dummy',
    };
    const userPreferences = { environment: 'something' };
    const error = new Error('error');

    return expectSaga(createComponents, { templateId, runKey })
      .provide([
        [select(selectors.templateSetup, templateId), templateData],
        [(select(selectors.marketplaceTemplateById, { templateId }), template)],
        [select(selectors.userPreferences), userPreferences],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.template.failedInstall(templateId))
      .run();
  });
});
describe('verifyBundleOrPackageInstall sagas', () => {
  const step = {
    installURL: 'url',
  };
  const connection = {
    _id: '111',
  };
  const templateId = '123';

  test('the status should be completed if response.success is true on successfull api call', () => {
    const response = { success: true };

    return expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), response]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.template.updateStep(
          { status: 'completed', installURL: step.installURL },
          templateId
        )
      )
      .run();
  });
  test('the status should be failed if response.success is false on successfull api call', () => {
    const path = `/connections/${connection._id}/distributed`;
    const response = {
      success: false,
      resBody: {
        dummy: 'dummy',
      },
    };

    return expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), response]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.api.failure(
          path,
          'GET',
          response.resBody || response.message,
          false
        )
      )
      .run();
  });
  test('status should be failed if there is no response on successfull api call', () => {
    const response = {};

    return expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), response]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.template.updateStep(
          { status: 'failed', installURL: step.installURL },
          templateId
        )
      )
      .run();
  });
  test('status should be failed if api call fails', () => {
    const error = new Error('error');

    return expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.template.updateStep(
          { status: 'failed', installURL: step.installURL },
          templateId
        )
      )
      .run();
  });
});

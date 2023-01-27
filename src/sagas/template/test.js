/* eslint-disable jest/no-conditional-in-test */

import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { getResource, commitStagedChanges } from '../resources';
import { apiCallWithRetry } from '../index';
import {
  generateZip,
  requestPreview,
  createComponents,
  verifyBundleOrPackageInstall,
  publishStatus,
} from '.';
import templateUtil from '../../utils/template';
import { SCOPES } from '../resourceForm';

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

    expectSaga(generateZip, { integrationId })
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

    expectSaga(requestPreview, { templateId })
      .provide([[matchers.call.fn(apiCallWithRetry), testComponents]])
      .call.fn(apiCallWithRetry)
      .put(actions.template.receivedPreview(testComponents, templateId))
      .run();
  });
  test('should dispatch failedPreview if api call fails', () => {
    const error = new Error('error');

    expectSaga(requestPreview, { templateId })
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

    saga.put(actions.template.createdComponents(components, templateId)).run();
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

    expectSaga(createComponents, { templateId, runKey })
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

    expectSaga(createComponents, { templateId, runKey })
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
  const type1 = 'suitebundle';
  const type2 = 'suiteapp';

  test('the status should be completed if response.success is true on successfull api call for both suiteapp and suitebundle', () => {
    const response = { success: true };

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type1,
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
    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type2,
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
  test('the status should be failed if response.success is false on successfull api call for both suiteapp and suitebundle', () => {
    let path = `/connections/${connection._id}/distributed?type=${type1}`;
    const response = {
      success: false,
      resBody: {
        dummy: 'dummy',
      },
    };

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type1,
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

    path = `/connections/${connection._id}/distributed?type=${type2}`;
    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type2,
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
  test('status should be failed if there is no response on successfull api call for both suiteapp and suitebundle', () => {
    const response = {};

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type1,
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

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type2,
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
  test('status should be failed if api call fails for both suiteapp and suitebundle', () => {
    const error = new Error('error');

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type1,
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

    expectSaga(verifyBundleOrPackageInstall, {
      step,
      connection,
      templateId,
      type2,
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

describe('publishStatus saga', () => {
  test('should publish template correctly', () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/published',
        value: true,
      },
    ];
    const templateId = '1';
    const isPublished = false;

    expectSaga(publishStatus, {templateId, isPublished})
      .provide([
        [
          call(commitStagedChanges, {
            resourceType: 'templates',
            id: templateId,
            scope: SCOPES.VALUE,
          }), {},
        ],
      ])
      .put(actions.resource.patchStaged(templateId, patchSet, SCOPES.VALUE))
      .put(actions.template.publish.success(templateId))
      .run();
  });
  test('should trigger publish error action in case of error', () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/published',
        value: true,
      },
    ];
    const templateId = '2';
    const isPublished = false;

    expectSaga(publishStatus, {templateId, isPublished})
      .provide([
        [
          call(commitStagedChanges, {
            resourceType: 'templates',
            id: templateId,
            scope: SCOPES.VALUE,
          }), {error: {msg: '123'}},
        ],
      ])
      .put(actions.resource.patchStaged(templateId, patchSet, SCOPES.VALUE))
      .put(actions.template.publish.error(templateId))
      .run();
  });
});

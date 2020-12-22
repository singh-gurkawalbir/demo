/* global describe, test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { deepClone } from 'fast-json-patch';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { getDefinition, getFileDefinitions, saveUserFileDefinition} from '.';
import { SCOPES, saveResourceWithDefinitionID } from '../resourceForm';
import { commitStagedChanges } from '../resources';

describe('fileDefinitions sagas', () => {
  describe('getDefinition saga', () => {
    test('should do nothing if there is no definitionId or format', () => expectSaga(getDefinition, {})
      .not.call.fn(apiCallWithRetry)
      .not.put(actions.fileDefinitions.preBuilt.received(undefined))
      .run());
    test('should invoke api to get sampleData for the definition passed and dispatch preBuilt.received action on success', () => {
      const fileDefinition = {};
      const definitionId = 'def-1234';
      const format = 'fixed';

      return expectSaga(getDefinition, {definitionId, format})
        .provide([
          [call(apiCallWithRetry, {
            path: `/ui/filedefinitions/${definitionId}`,
          }), fileDefinition],
        ])
        .call.fn(apiCallWithRetry)
        .put(
          actions.fileDefinitions.definition.preBuilt.received(
            fileDefinition,
            format,
            definitionId
          )
        )
        .run();
    });
    test('should invoke api to get sampleData for the definition passed and do nothing', () => {
      const definitionId = 'def-1234';
      const format = 'fixed';
      const error = {
        message: '{"code":"error code"}',
      };

      return expectSaga(getDefinition, {definitionId, format})
        .provide([
          [call(apiCallWithRetry, {
            path: `/ui/filedefinitions/${definitionId}`,
          }), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .run();
    });
  });
  describe('getFileDefinitions saga', () => {
    test('should invoke api to get all the preBuilt file definitions available and dispatch received action on success', () => {
      const fileDefinitions = {};

      return expectSaga(getFileDefinitions)
        .provide([
          [call(apiCallWithRetry, {
            path: '/ui/filedefinitions',
            opts: {
              method: 'GET',
            },
          }), fileDefinitions],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.fileDefinitions.preBuilt.received(fileDefinitions))
        .run();
    });
    test('should invoke api to get all the preBuilt file definitions available and dispatch receivedError action on failure', () => {
      const error = {
        status: 402,
        message: '{"code":"error code"}',
      };
      const parsedError = { code: 'error code'};

      return expectSaga(getFileDefinitions)
        .provide([
          [call(apiCallWithRetry, {
            path: '/ui/filedefinitions',
            opts: {
              method: 'GET',
            },
          }), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .put(actions.fileDefinitions.preBuilt.receivedError(parsedError))
        .run();
    });
    test('should invoke api to get all the preBuilt file definitions available and not dispatch any action on invalid error', () => {
      const error = {
        status: 304,
        message: '{"code":"error code"}',
      };
      const parsedError = { code: 'error code'};

      return expectSaga(getFileDefinitions)
        .provide([
          [call(apiCallWithRetry, {
            path: '/ui/filedefinitions',
            opts: {
              method: 'GET',
            },
          }), throwError(error)],
        ])
        .not.put(actions.fileDefinitions.preBuilt.receivedError(parsedError))
        .run();
    });
  });
  describe('saveUserFileDefinition saga', () => {
    const definitionRules = {
      resourcePath: 'SYNTAX IDENTIFIER',
      fileDefinition: {
        _id: '5fda05801730a97681d30444',
        lastModified: '2020-12-16T13:04:39.296Z',
        name: 'Amazon Vendor Central EDIFACT DESADV',
        description: 'Despatch advice message',
        version: '1',
        format: 'delimited/edifact',
        delimited: {
          rowSuffix: "'",
          rowDelimiter: '\n',
          colDelimiter: '+',
        },
        rules: [],
      },
    };
    const formValues = {
      resourceId: 'export-123',
      resourceType: 'exports',
      values: {
        '/name': 'ftp',
        '/desc': '',
      },
    };

    test('should save file definitions and call saveResourceWithDefinitionID with the definitionId passed once the file definition resource is saved', () => {
      const flowId = 'flow-123';
      const fileDefinitionDetails = {
        definitionId: definitionRules.fileDefinition._id,
        resourcePath: definitionRules.resourcePath,
      };

      return expectSaga(saveUserFileDefinition, { definitionRules, formValues, flowId })

        .call(commitStagedChanges, {
          resourceType: 'filedefinitions',
          id: definitionRules.fileDefinition._id,
          scope: SCOPES.VALUE,
        })
        .call(saveResourceWithDefinitionID, {
          formValues,
          fileDefinitionDetails,
          flowId,
          skipClose: undefined,
        })
        .run();
    });
    test('should call saveResourceWithDefinitionID with the created userDefinitionId when it is saved for the first time', () => {
      const newDefinitionRules = deepClone(definitionRules);

      newDefinitionRules.fileDefinition._id = 'new-123';
      const flowId = 'flow-123';
      const createdDefinitionId = '5fda05801730a97681d30444';
      const fileDefinitionDetails = {
        definitionId: createdDefinitionId,
        resourcePath: newDefinitionRules.resourcePath,
      };

      return expectSaga(saveUserFileDefinition, { definitionRules: newDefinitionRules, formValues, flowId })
        .provide([
          [select(selectors.createdResourceId, 'new-123'), createdDefinitionId],
        ])
        .call(commitStagedChanges, {
          resourceType: 'filedefinitions',
          id: 'new-123',
          scope: SCOPES.VALUE,
        })
        .call(saveResourceWithDefinitionID, {
          formValues,
          fileDefinitionDetails,
          flowId,
          skipClose: undefined,
        })
        .run();
    });
    test('should not call saveResourceWithDefinitionID when file definition save is unsuccessfull', () => {
      const newDefinitionRules = deepClone(definitionRules);

      newDefinitionRules.fileDefinition._id = 'new-123';
      const flowId = 'flow-123';

      return expectSaga(saveUserFileDefinition, { definitionRules: newDefinitionRules, formValues, flowId })
        .provide([
          [select(selectors.createdResourceId, 'new-123'), undefined],
        ])
        .call(commitStagedChanges, {
          resourceType: 'filedefinitions',
          id: 'new-123',
          scope: SCOPES.VALUE,
        })
        .not.call.fn(saveResourceWithDefinitionID)
        .run();
    });
    test('should pass empty resourcePath incase of imports ', () => {
      const definitionRules = {
        _id: '5fda05801730a97681d30444',
        lastModified: '2020-12-16T13:04:39.296Z',
        name: 'Amazon Vendor Central EDIFACT DESADV',
        description: 'Despatch advice message',
        version: '1',
        format: 'delimited/edifact',
        delimited: {
          rowSuffix: "'",
          rowDelimiter: '\n',
          colDelimiter: '+',
        },
        rules: [],
      };
      const formValues = {
        resourceId: 'import-123',
        resourceType: 'imports',
        values: {
          '/name': 'ftp',
          '/desc': '',
        },
      };
      const flowId = 'flow-123';
      const fileDefinitionDetails = {
        definitionId: definitionRules._id,
        resourcePath: '',
      };

      return expectSaga(saveUserFileDefinition, { definitionRules, formValues, flowId })

        .call(commitStagedChanges, {
          resourceType: 'filedefinitions',
          id: definitionRules._id,
          scope: SCOPES.VALUE,
        })
        .call(saveResourceWithDefinitionID, {
          formValues,
          fileDefinitionDetails,
          flowId,
          skipClose: undefined,
        })
        .run();
    });
  });
});


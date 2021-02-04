/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestSampleData, _fetchAssistantSampleData, _fetchIAMetaData } from './index';
import { getNetsuiteOrSalesforceMeta, requestAssistantMetadata } from '../../resources/meta';
import { apiCallWithRetry } from '../..';
import { SCOPES } from '../../resourceForm';

describe('sampleData imports saga', () => {
  const resourceId = '123';

  describe('requestSampleData saga', () => {
    test('should return undefined if resource does not exist', () => {
      expectSaga(requestSampleData, { resourceId })
        .returns(undefined)
        .run();

      return expectSaga(requestSampleData, {})
        .returns(undefined)
        .run();
    });

    test('should call fetchAssistantSampleData when import is of assistant type', () => {
      const merged = {
        assistant: 'shipwire',
      };

      return expectSaga(requestSampleData, { resourceId })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, SCOPES.VALUE), { merged }],
        ])
        .call(_fetchAssistantSampleData, {resource: merged})
        .run();
    });

    test('should call getNetsuiteOrSalesforceMeta with commMetaPath in case of NetSuite adaptor', () => {
      const merged = {
        adaptorType: 'NetSuiteImport',
        _connectionId: '456',
        netsuite: {
          recordType: 'accountParent',
        },
      };
      const expectedCommMetaPath = 'netsuite/metadata/suitescript/connections/456/recordTypes/account?parentRecordType=accountParent';

      expectSaga(requestSampleData, { resourceId, options: {recordType: 'account'}, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, SCOPES.VALUE), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath, addInfo: { refreshCache: true }})
        .run();

      const merged2 = {
        adaptorType: 'NetSuiteDistributedImport',
        _connectionId: '789',
        netsuite_da: {
          recordType: 'accountParent',
        },
      };
      const expectedCommMetaPath2 = 'netsuite/metadata/suitescript/connections/789/recordTypes/accountParent';

      return expectSaga(requestSampleData, { resourceId: '111', refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', '111', SCOPES.VALUE), { merged: merged2 }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged2._connectionId, commMetaPath: expectedCommMetaPath2, addInfo: { refreshCache: true }})
        .run();
    });

    test('should call getNetsuiteOrSalesforceMeta with commMetaPath in case of Salesforce adaptor', () => {
      const merged = {
        adaptorType: 'SalesforceImport',
        _connectionId: '456',
        salesforce: {
          sObjectType: 'account',
        },
      };
      const expectedCommMetaPath = 'salesforce/metadata/connections/456/sObjectTypes/account';

      expectSaga(requestSampleData, { resourceId, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, SCOPES.VALUE), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath, addInfo: { refreshCache: true }})
        .run();

      const expectedCommMetaPath1 = 'salesforce/metadata/connections/456/sObjectTypes/contact';
      const expectedCommMetaPath2 = 'salesforce/metadata/connections/456/sObjectTypes/opp';

      return expectSaga(requestSampleData, { resourceId, options: {sObjects: ['contact', 'opp']}, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, SCOPES.VALUE), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath1, addInfo: { refreshCache: true }})
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath2, addInfo: { refreshCache: true }})

        .run();
    });

    test('should call fetchIAMetaData when resource is of IA type', () => {
      const merged = {
        _connectorId: '9999',
        _integrationId: '222',
        sampleData: {},

      };

      return expectSaga(requestSampleData, { resourceId })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, SCOPES.VALUE), { merged }],
        ])
        .call(_fetchIAMetaData, {
          _importId: resourceId,
          _integrationId: merged._integrationId,
          refreshMetadata: undefined,
          sampleData: merged.sampleData,
        })
        .run();
    });
  });

  describe('fetchIAMetaData saga', () => {
    test('should call /refreshMetadata api when refreshMetadata prop is passed', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        refreshMetadata: true,
      })
        .call(apiCallWithRetry, {
          path: '/integrations/_integrationId/settings/refreshMetadata',
          opts: {
            method: 'PUT',
            body: {
              _importId,
            },
          },
          hidden: true,
        })
        .run();
    });

    test('should dispatch iaMetadataReceived action in case of success', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';
      const sampleData = {key: 'value'};

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        sampleData,
      })
        .put(actions.importSampleData.iaMetadataRequest({ _importId }))
        .put(
          actions.importSampleData.iaMetadataReceived({
            _importId,
            metadata: sampleData,
          })
        )
        .run();
    });

    test('should dispatch iaMetadataReceived action with original sample data in case of error', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';
      const sampleData = {key: 'value'};

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        refreshMetadata: true,
        sampleData,
      })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError({})]])
        .put(actions.importSampleData.iaMetadataRequest({ _importId }))
        .put(
          actions.importSampleData.iaMetadataFailed({
            _importId,
          })
        )
        .run();
    });
  });

  describe('fetchAssistantSampleData saga', () => {
    test('should call requestAssistantMetadata when there is no assistant data', () => {
      const resource = {
        adaptorType: 'RESTImport',
        assistant: 'shipwire',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), undefined],
        ])
        .call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .run();
    });

    test('should dispatch preview received action when import endpoint has sample data', () => {
      const resource = {
        _id: 'someId',
        assistant: 'shipwire',
        assistantMetadata: {
          resource: 'product',
          version: 'v3',
          operation: 'create_product',
          lookups: {},
        },
        adaptorType: 'RESTImport',
      };
      const assistantMetadata = {
        import: {
          versions: [{
            version: 'v3',
            resources: [{
              id: 'product',
              name: 'Product',
              sampleData: {
                sku: 'sportsWatch',
                externalId: 'narp',
              },
              operations: [{
                id: 'create_product',
                url: '/v3/products',
                method: 'POST',
              }],
            }],
          }],
        },
      };

      const expectedSampleData = {
        sku: 'sportsWatch',
        externalId: 'narp',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), assistantMetadata],
        ])
        .not.call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .put(
          actions.metadata.receivedAssistantImportPreview(
            'someId',
            expectedSampleData
          )
        )
        .not.put(actions.metadata.failedAssistantImportPreview('someId'))
        .run();
    });

    test('should dispatch failed preview action when there is no sample data on import', () => {
      const resource = {
        _id: 'someId',
        adaptorType: 'RESTImport',
        assistant: 'shipwire',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), {}],
        ])
        .not.call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .not.put(
          actions.metadata.receivedAssistantImportPreview(
            'someId',
            ''
          )
        )
        .put(actions.metadata.failedAssistantImportPreview('someId'))
        .run();
    });
  });
});

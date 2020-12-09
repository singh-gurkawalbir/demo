/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { call, race, select, take } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';

// TODO to see why its needed. The sagas starts failing if this line is removed
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '../../index';
import { fetchRequiredMappingData,
  mappingInit,
  refreshGenerates,
  saveMappings,
  checkForIncompleteSFGenerateWhilePatch,
  checkForSFSublistExtractPatch,
  updateImportSampleData,
  patchGenerateThroughAssistant,
  requestPatchField,
  validateSuitescriptMappings,
} from './index';
import { selectors } from '../../../reducers';
import {requestSampleData as requestImportSampleData} from '../sampleData/imports';
import { commitStagedChanges } from '../resources';

describe('Suitescript sagas', () => {
  describe('mappingInit saga', () => {
    test('should dispatch initFailed in case there is no flow ', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), undefined],
          [
            race({
              fetchData: call(fetchRequiredMappingData, {
                ssLinkedConnectionId,
                integrationId,
                flowId,
                subRecordMappingId,
              }),
              cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
            }), {},
          ],
        ]).put(actions.suiteScript.mapping.initFailed())
        .run();
    });
    test('should exit incase user logs out while mapping init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [
            race({
              fetchData: call(fetchRequiredMappingData, {
                ssLinkedConnectionId,
                integrationId,
                flowId,
                subRecordMappingId,
              }),
              cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
            }), {cancelInit: true},
          ],
        ]).not.put(actions.suiteScript.mapping.initComplete({}))
        .run();
    });
    test('should trigger initComplete for netsuite import after successful completion of init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: { _connectionId: 's', type: 'xyz'},
            import: {
              type: 'netsuite',
              netsuite: {
                recordType: 'myRecordType',
                lookups: [],
              },
              mapping: {
                fields: [{generate: 'a', extract: 'b'}],
                lists: [],
              },

            },
          }],
          [race({
            fetchData: call(fetchRequiredMappingData, {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
            cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
          }), {}],
        ]).put(actions.suiteScript.mapping.initComplete({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          mappings: [{generate: 'a', extract: 'b'}],
          subRecordFields: [],
          lookups: [],
          options: {
            recordType: 'myRecordType',
            connectionId: 's',
            importType: 'netsuite',
            exportType: 'xyz',
            subRecordMappingId,
          },
        }))
        .run();
    });

    test('should trigger initComplete for netsuite import after successful completion of init[2]', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: { _connectionId: 's',
              type: 'netsuite',
              netsuite: {
                type: 'restlet',
              },

            },
            import: {
              type: 'netsuite',
              netsuite: {
                recordType: 'myRecordType',
                lookups: [],
              },
              mapping: {
                fields: [{generate: 'a', extract: 'b'}],
                lists: [],
              },

            },
          }],
          [race({
            fetchData: call(fetchRequiredMappingData, {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
            cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
          }), {}],
        ]).put(actions.suiteScript.mapping.initComplete({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          mappings: [{generate: 'a', extract: 'b'}],
          subRecordFields: [],
          lookups: [],
          options: {
            recordType: 'myRecordType',
            connectionId: 's',
            importType: 'netsuite',
            exportType: 'netsuite',
            subRecordMappingId,
          },
        }))
        .run();
    });

    test('should trigger initComplete for netsuite import[sub-record] after successful completion of init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = 'subRecordId';

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: { _connectionId: 's',
              type: 'netsuite',
              netsuite: {
                type: 'restlet',
              },

            },
            import: {
              type: 'netsuite',
              netsuite: {
                recordType: 'myRecordType',
                lookups: [],
              },
              mapping: {
                fields: [{generate: 'a', extract: 'b'}],
                lists: [],
              },

            },
          }],
          [
            select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {
              recordType: 'subRecordType',
              mapping: {
                fields: [
                  {mappingId: 'xyz', something: 'else'},
                ],
                lists: [],
              },
              lookups: []},
          ],
          [race({
            fetchData: call(fetchRequiredMappingData, {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
            cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
          }), {}],
        ]).put(actions.suiteScript.mapping.initComplete({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          mappings: [],
          subRecordFields: [{mappingId: 'xyz', something: 'else'}],
          lookups: [],
          options: {
            recordType: 'subRecordType',
            connectionId: 's',
            importType: 'netsuite',
            exportType: 'netsuite',
            subRecordMappingId,
          },
        }))
        .run();
    });

    test('should trigger initComplete for salesforce import after successful completion of init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: { _connectionId: 's', type: 'xyz'},
            import: {
              type: 'salesforce',
              salesforce: {
                sObjectType: 'myRecordType',
                lookups: [],
              },
              mapping: {
                fields: [{generate: 'a', extract: 'b'}],
                lists: [],
              },

            },
          }],
          [race({
            fetchData: call(fetchRequiredMappingData, {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
            cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
          }), {}],
        ]).put(actions.suiteScript.mapping.initComplete({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          mappings: [{generate: 'a', extract: 'b'}],
          subRecordFields: [],
          lookups: [],
          options: {
            sObjectType: 'myRecordType',
            connectionId: 's',
            importType: 'salesforce',
            exportType: 'xyz',
            subRecordMappingId,
          },
        }))
        .run();
    });

    test('should trigger refresh generates after mapping init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;

      return expectSaga(mappingInit, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: { _connectionId: 's', type: 'xyz'},
            import: {
              type: 'netsuite',
              netsuite: {
                recordType: 'myRecordType',
                lookups: [],
              },
              mapping: {
                fields: [{generate: 'a', extract: 'b'}],
                lists: [],
              },

            },
          }],
          [race({
            fetchData: call(fetchRequiredMappingData, {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
            cancelInit: take(actionTypes.SUITESCRIPT.MAPPING.CLEAR),
          }), {}],
        ]).put(actions.suiteScript.mapping.initComplete({
          ssLinkedConnectionId,
          integrationId,
          flowId,
          mappings: [{generate: 'a', extract: 'b'}],
          subRecordFields: [],
          lookups: [],
          options: {
            recordType: 'myRecordType',
            connectionId: 's',
            importType: 'netsuite',
            exportType: 'xyz',
            subRecordMappingId,
          },
        }))
        .put(actions.suiteScript.mapping.refreshGenerates({isInit: true }))
        .run();
    });
  });

  describe('fetchRequiredMappingData saga', () => {
    test('should call flowSampleData and requestImportSampleData[if sample data not loaded] saga', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const subRecordType = 's';

      return expectSaga(fetchRequiredMappingData, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptNetsuiteMappingSubRecord,
            {ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }), {recordType: subRecordType}],
          [select(selectors.suiteScriptGenerates,
            {ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }), {}],

        ])
        .call(requestImportSampleData, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          options: {recordType: subRecordType},
        })
        .run();
    });

    test('should not call requestImportSampleData saga[if sample data already loaded]', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const subRecordType = 's';

      return expectSaga(fetchRequiredMappingData, { ssLinkedConnectionId, integrationId, flowId, subRecordMappingId })
        .provide([
          [select(selectors.suiteScriptNetsuiteMappingSubRecord,
            {ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }), {recordType: subRecordType}],
          [select(selectors.suiteScriptGenerates,
            {ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }), {status: 'received'}],

        ])
        .not.call(requestImportSampleData, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          options: {recordType: subRecordType},
        })
        .run();
    });
  });

  describe('refreshGenerates saga', () => {
    test('should not fetch parent sObject metadata for salesforce import in case of init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: true})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}), {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {data: []}],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'salesforce',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              sObjects: [],
            },
          }
        ))
        .run();
    });

    test('should fetch parent sObject metadata for salesforce import', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: false})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}), {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {data: []}],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'salesforce',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              sObjects: [sObjectType],
            },
          }
        ))
        .run();
    });

    test('should fetch child sObjects for salesforce import from generateFields relationship', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: false})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {data: [
              {id: 'parentSObject[*].xyz'},
              {id: 'parentSObject2[*].xyz'},
            ]}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {
            data: [
              { value: 'parentSObject', childSObject: 'childSObject1'},
              { value: 'parentSObject2', childSObject: 'childSObject2'},
              { value: 'parentSObject3', childSObject: 'childSObject3'},
            ],
          }],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'salesforce',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              sObjects: [sObjectType, 'childSObject1', 'childSObject2'],
            },
          }
        ))
        .run();
    });

    test('should fetch child sObjects for salesforce import from mapping lists', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: false})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [
              {generate: 'parentSObject[*].xyz', extract: 'e1'},
              {generate: 'test2', extract: 'e1'},
            ],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {
            data: [
              { value: 'parentSObject', childSObject: 'childSObject1'},
              { value: 'parentSObject2', childSObject: 'childSObject2'},
              { value: 'parentSObject3', childSObject: 'childSObject3'},
            ],
          }],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'salesforce',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              sObjects: [sObjectType, 'childSObject1'],
            },
          }
        ))
        .run();
    });

    test('should fetch metadata with refreshCache = false for netsuite import during init', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: true})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [
              {generate: 'parentSObject[*].xyz', extract: 'e1'},
              {generate: 'test2', extract: 'e1'},
            ],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {
            data: [
              { value: 'parentSObject', childSObject: 'childSObject1'},
              { value: 'parentSObject2', childSObject: 'childSObject2'},
              { value: 'parentSObject3', childSObject: 'childSObject3'},
            ],
          }],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'netsuite',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              refreshCache: false,
            },
          }
        ))
        .run();
    });

    test('should fetch metadata with refreshCache = true for netsuite import when isInit = false', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: false})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [
              {generate: 'parentSObject[*].xyz', extract: 'e1'},
              {generate: 'test2', extract: 'e1'},
            ],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {
            data: [
              { value: 'parentSObject', childSObject: 'childSObject1'},
              { value: 'parentSObject2', childSObject: 'childSObject2'},
              { value: 'parentSObject3', childSObject: 'childSObject3'},
            ],
          }],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'netsuite',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              refreshCache: true,
            },
          }
        ))
        .run();
    });

    test('should fetch subRecord metadata for netsuite import', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = 'subrecord';
      const _connectionId = 'xyz';
      const sObjectType = 'parentSObject';

      return expectSaga(refreshGenerates, { isInit: false})
        .provide([
          [select(selectors.suiteScriptMapping), {
            mappings: [
              {generate: 'parentSObject[*].xyz', extract: 'e1'},
              {generate: 'test2', extract: 'e1'},
            ],
            ssLinkedConnectionId,
            integrationId,
            flowId,
            subRecordMappingId,
          }],
          [select(selectors.suiteScriptGenerates, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {data: []}],
          [select(selectors.getMetadataOptions,
            {
              connectionId: ssLinkedConnectionId,
              commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
              filterKey: 'salesforce-sObjects-childReferenceTo',
            }), {
            data: [
              { value: 'parentSObject', childSObject: 'childSObject1'},
              { value: 'parentSObject2', childSObject: 'childSObject2'},
              { value: 'parentSObject3', childSObject: 'childSObject3'},
            ],
          }],
          [select(
            selectors.suiteScriptFlowDetail,
            {
              integrationId,
              ssLinkedConnectionId,
              flowId,
            }
          ), {
            import: {
              type: 'netsuite',
              _connectionId,
              salesforce: {
                sObjectType,
              },
            },
          }],
          [
            select(selectors.suiteScriptNetsuiteMappingSubRecord, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}),
            {recordType: 'childRecordType'},
          ],

        ])
        .put(actions.suiteScript.importSampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              recordType: 'childRecordType',
              refreshCache: true,
            },
          }
        ))
        .run();
    });
  });

  describe('saveMappings saga', () => {
    test('should save mapping correctly in case of netsuite import', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const recordType = 'test';
      const subRecordMappingId = undefined;
      const connectionId = 'conn';

      return expectSaga(saveMappings, {})
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extract: 'abcd'},
                {generate: 'njm', extract: 'opo'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'netsuite',
              _connectionId: connectionId,
              netsuite: {

              },
            },
            _id: flowId,
          }],
          [
            call(commitStagedChanges, {
              resourceType: 'imports',
              id: flowId,
              scope: 'value',
              ssLinkedConnectionId,
              integrationId,
            }), undefined,
          ],
        ])
        .put(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'imports',
            flowId,
            [
              {
                op: 'add',
                path: '/import/mapping',
                value: {
                  fields: [
                    {
                      generate: 'xyz',
                      extract: 'abcd',
                      internalId: false,
                    },
                    {
                      generate: 'njm',
                      extract: 'opo',
                      internalId: false,
                    },
                  ],
                  lists: [

                  ],
                },
              },
              {
                op: 'add',
                path: '/import/netsuite/lookups',
                value: [],
              },
            ],
            'value',
          )
        )
        .put(
          actions.suiteScript.mapping.saveComplete()
        )
        .run();
    });

    test('should save mapping correctly in case of netsuite[sub record] import', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const recordType = 'test';
      const subRecordMappingId = 'subRecordId';
      const connectionId = 'conn';

      return expectSaga(saveMappings, {})
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extract: 'abcd'},
                {generate: 'njm', extract: 'opo'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              recordType,
              subRecordFields: [{
                mappingId: 'xyz',
                something: 'else',
              }],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'netsuite',
              _connectionId: connectionId,
              netsuite: {
                subRecordImports: [{
                  mappingId: 'xyz',
                  mapping: {fields: [], lists: []},
                  lookups: [{name: 'test', something: 'else'}],
                }],
              },
            },
            _id: flowId,
          }],
          [
            call(commitStagedChanges, {
              resourceType: 'imports',
              id: flowId,
              scope: 'value',
              ssLinkedConnectionId,
              integrationId,
            }), undefined,
          ],
        ])
        .put(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'imports',
            flowId,
            [
              {
                op: 'replace',
                path: '/import/netsuite/subRecordImports',
                value: [
                  {
                    mappingId: 'xyz',
                    mapping: {
                      fields: [],
                      lists: [

                      ],
                    },
                    lookups: [
                      {
                        name: 'test',
                        something: 'else',
                      },
                    ],
                  },
                ],
              },
            ],
            'value',
          )
        )
        .put(
          actions.suiteScript.mapping.saveComplete()
        )
        .run();
    });

    test('should save mapping correctly in case of netsuite[sub record] import[2]', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const recordType = 'test';
      const subRecordMappingId = 'subRecordId';
      const connectionId = 'conn';

      return expectSaga(saveMappings, {})
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extract: 'abcd'},
                {generate: 'njm', extract: 'opo'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              recordType,
              subRecordFields: [{
                mappingId: 'subRecordId',
                something: 'else',
              }],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'netsuite',
              _connectionId: connectionId,
              netsuite: {
                subRecordImports: [{
                  mappingId: 'subRecordId',
                  mapping: {fields: [], lists: []},
                  lookups: [{name: 'test', something: 'else'}],
                }],
              },
            },
            _id: flowId,
          }],
          [
            call(commitStagedChanges, {
              resourceType: 'imports',
              id: flowId,
              scope: 'value',
              ssLinkedConnectionId,
              integrationId,
            }), undefined,
          ],
        ])
        .put(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'imports',
            flowId,
            [
              {
                op: 'replace',
                path: '/import/netsuite/subRecordImports',
                value: [
                  {
                    mappingId: 'subRecordId',
                    mapping: {
                      fields: [
                        {
                          generate: 'xyz',
                          extract: 'abcd',
                          internalId: false,
                        },
                        {
                          generate: 'njm',
                          extract: 'opo',
                          internalId: false,
                        },
                        {
                          mappingId: 'subRecordId',
                          something: 'else',
                        },
                      ],
                      lists: [

                      ],
                    },
                    lookups: [

                    ],
                  },
                ],
              },
            ],
            'value',
          )
        )
        .put(
          actions.suiteScript.mapping.saveComplete()
        )
        .run();
    });

    test('should save mapping correctly in case of salesforce import', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const sObjectType = 'test';
      const subRecordMappingId = undefined;
      const connectionId = 'conn';
      // const importId = '_i_1';

      return expectSaga(saveMappings, {})
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extract: 'abcd'},
                {generate: 'njm', extract: 'opo'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              // recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [
            select(selectors.getMetadataOptions,
              {
                connectionId: ssLinkedConnectionId,
                commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${sObjectType}`,
                filterKey: 'salesforce-sObjects-childReferenceTo',
              }), {
              data: [],
            },
          ],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'salesforce',
              _connectionId: connectionId,
              salesforce: {
                sObjectType,
              },
            },
            _id: flowId,
          }],
          [
            call(commitStagedChanges, {
              resourceType: 'imports',
              id: flowId,
              scope: 'value',
              ssLinkedConnectionId,
              integrationId,
            }), undefined,
          ],
        ])
        .put(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'imports',
            flowId,
            [
              {
                op: 'add',
                path: '/import/mapping',
                value: {
                  fields: [
                    {
                      generate: 'xyz',
                      extract: 'abcd',
                      internalId: false,
                    },
                    {
                      generate: 'njm',
                      extract: 'opo',
                      internalId: false,
                    },
                  ],
                  lists: [

                  ],
                },
              },
              {
                op: 'add',
                path: '/import/salesforce/lookups',
                value: [

                ],
              },
            ],
            'value',
          )
        )
        .put(
          actions.suiteScript.mapping.saveComplete()
        )
        .run();
    });

    test('should trigger saveFailed action in case of error while saving', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const sObjectType = 'test';
      const subRecordMappingId = undefined;
      const connectionId = 'conn';
      // const importId = '_i_1';

      return expectSaga(saveMappings, {})
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extract: 'abcd'},
                {generate: 'njm', extract: 'opo'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              // recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [
            select(selectors.getMetadataOptions,
              {
                connectionId: ssLinkedConnectionId,
                commMetaPath: `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${sObjectType}`,
                filterKey: 'salesforce-sObjects-childReferenceTo',
              }), {
              data: [],
            },
          ],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'salesforce',
              _connectionId: connectionId,
              salesforce: {
                sObjectType,
              },
            },
            _id: flowId,
          }],
          [
            call(commitStagedChanges, {
              resourceType: 'imports',
              id: flowId,
              scope: 'value',
              ssLinkedConnectionId,
              integrationId,
            }), {error: {}},
          ],
        ])
        .put(
          actions.suiteScript.resource.patchStaged(
            ssLinkedConnectionId,
            'imports',
            flowId,
            [
              {
                op: 'add',
                path: '/import/mapping',
                value: {
                  fields: [
                    {
                      generate: 'xyz',
                      extract: 'abcd',
                      internalId: false,
                    },
                    {
                      generate: 'njm',
                      extract: 'opo',
                      internalId: false,
                    },
                  ],
                  lists: [

                  ],
                },
              },
              {
                op: 'add',
                path: '/import/salesforce/lookups',
                value: [

                ],
              },
            ],
            'value',
          )
        )
        .put(
          actions.suiteScript.mapping.saveFailed()
        )
        .run();
    });
  });

  describe('checkForIncompleteSFGenerateWhilePatch saga', () => {
    test('should not trigger patchIncompleteGenerates action in case generate value  doesnt have _child_ ', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const sObjectType = 'test';
      const subRecordMappingId = undefined;
      const connectionId = 'conn';
      // const importId = '_i_1';

      return expectSaga(checkForIncompleteSFGenerateWhilePatch, { field: 'generate', value: 'xyz' })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              // recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'salesforce',
              _connectionId: connectionId,
              salesforce: {
                sObjectType,
              },
            },
            _id: flowId,
          }],
        ])
        .not.put(actions.suiteScript.mapping.patchIncompleteGenerates(
          {
            key: 'anything',
            value: 'anything',
          }
        ))
        .run();
    });

    test('should not trigger patchIncompleteGenerates action in case of non-salesforce import and value has _child_ ', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const subRecordMappingId = undefined;
      const connectionId = 'conn';

      return expectSaga(checkForIncompleteSFGenerateWhilePatch, { field: 'generate', value: '_child_' })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              // recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'something',
              _connectionId: connectionId,
            },
            _id: flowId,
          }],
        ])
        .not.put(actions.suiteScript.mapping.patchIncompleteGenerates(
          {
            key: 'anything',
            value: 'anything',
          }
        ))
        .run();
    });

    test('should trigger patchIncompleteGenerates action correctly', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const sObjectType = 'test';
      const childSObject = 'childSObject';
      const subRecordMappingId = undefined;
      const relationshipName = 'relationshipName';
      const connectionId = 'conn';
      // const importId = '_i_1';

      return expectSaga(checkForIncompleteSFGenerateWhilePatch, { field: 'generate', value: '_child_abcd' })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: '_child_abcd', key: 'key1'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              // recordType,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [select(selectors.suiteScriptGenerates,
            {
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordMappingId,
            }),
          {
            data: [
              {
                id: '_child_abcd',
                relationshipName,
                childSObject,
              },
            ],
          }],
          [select(selectors.suiteScriptFlowDetail, {
            integrationId,
            ssLinkedConnectionId,
            flowId,
          }), {
            export: {
              type: 'xyz',
            },
            import: {
              type: 'salesforce',
              _connectionId: connectionId,
              salesforce: {
                sObjectType,
              },
            },
            _id: flowId,
          }],
        ])
        .put(actions.suiteScript.mapping.patchIncompleteGenerates(
          {
            key: 'key1',
            value: relationshipName,
          }
        ))
        .run();
    });
  });

  describe('checkForSFSublistExtractPatch saga', () => {
    test('should trigger setSFSubListFieldName and updateLastFieldTouched action successfully', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const value = 'myValue';
      const childSObject = 'childSObject';
      const subRecordMappingId = undefined;
      const key = 'key';

      return expectSaga(checkForSFSublistExtractPatch, {key, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordFields: [],
              subRecordMappingId,
            }],
          [
            select(selectors.suiteScriptFlowSampleData, {ssLinkedConnectionId, integrationId, flowId}),
            {
              data: [{
                value,
                childSObject,
              },
              ],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.setSFSubListFieldName(value))
      // .put(actions.suiteScript.mapping.updateLastFieldTouched(key))
        .run();
    });
  });

  describe('updateImportSampleData saga', () => {
    test('check not do anything if there is no incomplete generates', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const value = 'myValue';
      const subRecordMappingId = undefined;
      const key = 'key';

      return expectSaga(updateImportSampleData, {key, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordFields: [],
              subRecordMappingId,
            }],

        ])
        .not.put(actions.suiteScript.mapping.updateMappings([]))
        .run();
    });

    test('should update mapping if there is sample data update and there was incomplete generate pending', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const value = 'myValue';
      const subRecordMappingId = undefined;
      const key = 'key';

      return expectSaga(updateImportSampleData, {key, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extarct: 'xyz', key: 'k1'},
                {generate: 'sd', extarct: 'ss', key: 'k2'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordFields: [],
              subRecordMappingId,
              incompleteGenerates: [{key: 'k1', value: 'xyz'}],
            }],
          [
            select(selectors.suiteScriptGenerates,
              {
                ssLinkedConnectionId,
                integrationId,
                flowId,
                subRecordMappingId,
              }),
            {data: [
              {
                id: 'xyz[*].abc',
                relationshipName: 'xyz',
                childSObject: 'childSObject',
              },
            ]},
          ],
        ])
        .put(actions.suiteScript.mapping.updateMappings(
          [
            {generate: 'xyz[*].abc', extarct: 'xyz', key: 'k1', rowIdentifier: 1},
            {generate: 'sd', extarct: 'ss', key: 'k2'},
          ]))
        .run();
    });

    test('should update mapping if there is sample data update and there was incomplete generate pending[2]', () => {
      const ssLinkedConnectionId = 'c1';
      const integrationId = 'i1';
      const flowId = 'f1';
      const value = 'myValue';
      const subRecordMappingId = undefined;
      const key = 'key';

      return expectSaga(updateImportSampleData, {key, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {generate: 'xyz', extarct: 'xyz', key: 'k1', rowIdentifier: 1},
                {generate: 'sd', extarct: 'ss', key: 'k2'},
              ],
              lookups: [],
              ssLinkedConnectionId,
              integrationId,
              flowId,
              subRecordFields: [],
              subRecordMappingId,
              incompleteGenerates: [{key: 'k1', value: 'xyz'}],
            }],
          [
            select(selectors.suiteScriptGenerates,
              {
                ssLinkedConnectionId,
                integrationId,
                flowId,
                subRecordMappingId,
              }),
            {data: [
              {
                id: 'xyz[*].abc',
                relationshipName: 'xyz',
                childSObject: 'childSObject',
              },
            ]},
          ],
        ])
        .put(actions.suiteScript.mapping.updateMappings(
          [
            {generate: 'xyz[*].abc', extarct: 'xyz', key: 'k1', rowIdentifier: 2},
            {generate: 'sd', extarct: 'ss', key: 'k2'},
          ]))
        .run();
    });
  });

  describe('patchGenerateThroughAssistant saga', () => {
    test('check not trigger patchField if user has not touched any form row yet', () => {
      const value = 'abcd';

      return expectSaga(patchGenerateThroughAssistant, {value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
            }],

        ])
        .not.put(actions.suiteScript.mapping.patchField('generate',
          undefined,
          value
        ))
        .run();
    });

    test('check trigger patchField if user has touched form', () => {
      const value = 'abcd';
      const lastModifiedRowKey = 'xyz';

      return expectSaga(patchGenerateThroughAssistant, {value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [],
              lookups: [],
              lastModifiedRowKey,
            }],
        ])
        .put(actions.suiteScript.mapping.patchField('generate',
          lastModifiedRowKey,
          value
        ))
        .run();
    });
  });

  describe('requestPatchField saga', () => {
    test('dont trigger any action in case user have not changed the value', () => {
      const value = 'abcd';
      const key = 'key1';
      const field = 'generate';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key1', generate: 'abcd'},
              ],
              lookups: [],
            },
          ],
        ])
        .not.put(actions.suiteScript.mapping.delete(key))
        .not.put(actions.suiteScript.mapping.patchField('extract', key, value))
        .run();
    });

    test('dont trigger delete action correctly', () => {
      const value = '';
      const key = 'key1';
      const field = 'generate';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', generate: 'sdf'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.delete(key))
        .run();
    });

    test('should trigger delete action correctly[2]', () => {
      const value = '';
      const key = 'key1';
      const field = 'generate';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', generate: 'sdf'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.delete(key))
        .run();
    });

    test('should trigger delete action correctly[2]', () => {
      const value = '';
      const key = 'key1';
      const field = 'extract';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', extract: 'sdf'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.delete(key))
        .run();
    });

    test('should trigger patchField action correctly[1]', () => {
      const value = 'test';
      const key = 'key2';
      const field = 'extract';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', extract: 'sdf'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.patchField(field, key, value))
        .run();
    });

    test('should trigger patchField action correctly[2]', () => {
      const value = 'test';
      const key = 'key1';
      const field = 'extract';

      return expectSaga(requestPatchField, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', extract: 't2'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.patchField(field, key, value))
        .run();
    });
  });

  describe('validateSuitescriptMappings saga', () => {
    test('should not trigger setValidation message if no validation error occured', () => {
      const value = 'test';
      const key = 'key1';
      const field = 'extract';
      const newValidationErrMsg = undefined;

      return expectSaga(validateSuitescriptMappings, {key, field, value })
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', extract: 't2', generate: 'jhg'},
              ],
              lookups: [],
            },
          ],
        ])
        .not.put(actions.suiteScript.mapping.setValidationMsg(newValidationErrMsg))
        .run();
    });

    test('should set setValidation message if validation error occured', () => {
      const newValidationErrMsg = 'Extract Fields missing for field(s): jhg';

      return expectSaga(validateSuitescriptMappings)
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', generate: 'jhg'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.setValidationMsg(newValidationErrMsg))
        .run();
    });
    test('should trigger setValidationMsg action if validation error occured', () => {
      const newValidationErrMsg = 'Extract Fields missing for field(s): jhg';

      return expectSaga(validateSuitescriptMappings)
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', generate: 'jhg'},
              ],
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.setValidationMsg(newValidationErrMsg))
        .run();
    });
    test('should trigger setValidationMsg action with value=undefined if validation error is resolved', () => {
      const newValidationErrMsg = undefined;

      return expectSaga(validateSuitescriptMappings)
        .provide([
          [select(selectors.suiteScriptMapping),
            {
              mappings: [
                {key: 'key0', generate: 'hg', extract: 'jh'},
                {key: 'key1', generate: 'jhg', extract: 'jkl'},
              ],
              validationErrMsg: 'Extract Fields missing for field(s): jhg',
              lookups: [],
            },
          ],
        ])
        .put(actions.suiteScript.mapping.setValidationMsg(newValidationErrMsg))
        .run();
    });
  });
});

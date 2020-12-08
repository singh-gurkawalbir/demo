/* global describe, test,jest */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import shortid from 'shortid';
import { responseMappingInit, responseMappingSave } from '.';
import { SCOPES } from '../resourceForm';
import actions from '../../actions';
import { selectors } from '../../reducers';
import responseMappingUtil from '../../utils/responseMapping';
import { commitStagedChanges } from '../resources';

describe('responseMappingInit saga', () => {
  test('should dispatch initFailed in case there is no flow page processor ', () => {
    const flowId = 'f1';
    const resourceId = 'r1';

    return expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), {
          merged: {
            pageProcessors: [],
          }}],
      ]).put(actions.responseMapping.initFailed())
      .run();
  });

  test('should dispatch initFailed if pageProcessor corresponding to resourceId is not present', () => {
    const flowId = 'f1';
    const resourceId = 'r1';
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'r0'},
        ],
      },
    };

    return expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
      ]).put(actions.responseMapping.initFailed())
      .run();
  });

  test('should trigger requestFlowSampleData action in case sample data is not loaded for import pageProcessor', () => {
    const flowId = 'f1';
    const resourceId = 'r1';
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'r0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };

    return expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId,
          stage: 'responseMappingExtract',
          resourceType: 'imports',
        }), {}],
      ])
      .put(actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'responseMappingExtract',
      )).run();
  });

  test('should not trigger requestFlowSampleData action in case sample data is present for import pageProcessor', () => {
    const flowId = 'f1';
    const resourceId = 'r1';
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'r0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };

    return expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId,
          stage: 'responseMappingExtract',
          resourceType: 'imports',
        }), {data: {}}],
      ])
      .not.put(actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'responseMappingExtract',
      )).run();
  });

  test('should not trigger requestFlowSampleData action in case of export pageProcessor ', () => {
    const flowId = 'f1';
    const resourceId = 'exp0';
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'exp0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };

    return expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId,
          stage: 'responseMappingExtract',
          resourceType: 'imports',
        }), {data: {}}],
      ])
      .not.put(actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'responseMappingExtract',
      )).run();
  });

  test('should complete init and trigger initComplete successfully in case of import pageProcessor', () => {
    const flowId = 'f1';
    const resourceId = 'imp0';
    const expectedMappingList = [
      {generate: 'fg1', extract: 'e1'},
      {generate: 'lg1[*].lfg1', extract: 'lge1'},
      {generate: 'lg1[*].lfg2', extract: 'lge2'},
    ];
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'exp0', responseMapping: {}},
          {type: 'import',
            _connectionId: 'something',
            _importId: 'imp0',
            responseMapping: {
              fields: [
                {generate: 'fg1', extract: 'e1'},
              ],
              lists: [
                {
                  generate: 'lg1',
                  fields: [
                    {generate: 'lfg1', extract: 'lge1'},
                    {generate: 'lfg2', extract: 'lge2'},
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');

    const expectedSaga = expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId,
          stage: 'responseMappingExtract',
          resourceType: 'imports',
        }), {data: {}}],
      ])
      .put(
        actions.responseMapping.initComplete({
          mappings: expectedMappingList.map(m => ({
            ...m,
            key: 'mock_key',
          })),
          flowId,
          resourceId,
          resourceType: 'imports',
        }))
      .run();

    mock.mockRestore();

    return expectedSaga;
  });

  test('should complete init and trigger initComplete successfully in case of export pageProcessor', () => {
    const flowId = 'f1';
    const resourceId = 'exp0';
    const expectedMappingList = [
      {generate: 'fg1', extract: 'e1'},
      {generate: 'lg1[*].lfg1', extract: 'lge1'},
      {generate: 'lg1[*].lfg2', extract: 'lge2'},
    ];
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'xyz', responseMapping: {}},
          {type: 'export',
            _connectionId: 'something',
            _exportId: 'exp0',
            responseMapping: {
              fields: [
                {generate: 'fg1', extract: 'e1'},
              ],
              lists: [
                {
                  generate: 'lg1',
                  fields: [
                    {generate: 'lfg1', extract: 'lge1'},
                    {generate: 'lfg2', extract: 'lge2'},
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');

    const expectedSaga = expectSaga(responseMappingInit, { flowId, resourceId })
      .provide([
        [select(selectors.resourceData, 'flows', flowId), flowResource],
      ])
      .put(
        actions.responseMapping.initComplete({
          mappings: expectedMappingList.map(m => ({
            ...m,
            key: 'mock_key',
          })),
          flowId,
          resourceId,
          resourceType: 'exports',
        }))
      .run();

    mock.mockRestore();

    return expectedSaga;
  });
});

describe('responseMappingSave saga', () => {
  test('should dispatch saveFailed if page processor corresponding to resourceId is not present', () => {
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'r0'},
        ],
      },
    };

    return expectSaga(responseMappingSave)
      .provide([
        [select(selectors.responseMapping), {flowId: 'f1', mappings: [], resourceId: 'r1'}],
        [select(selectors.resourceData, 'flows', 'f1'), flowResource],
      ]).put(actions.responseMapping.saveFailed())
      .run();
  });

  test('should patch stage changes to responseMapping property of pageProcessors correctly', () => {
    const listMapping = [
      {generate: 'g1', extract: 'e1', key: 'a'},
      {generate: 'g2', extract: 'e2', key: 'a'},
      {generate: 'l1[*].a1', extract: 'e3', key: 'a'},
    ];
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'exp0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };
    const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(listMapping);

    return expectSaga(responseMappingSave)
      .provide([
        [select(selectors.responseMapping), {flowId: 'f1', mappings: listMapping, resourceId: 'r1'}],
        [select(selectors.resourceData, 'flows', 'f1'), flowResource],
      ])
      .put(actions.resource.patchStaged('f1', [{
        op: 'replace',
        path: '/pageProcessors/1/responseMapping',
        value: mappingsWithListsAndFields,
      }], SCOPES.VALUE))
      .run();
  });

  test('show trigger saveFailed in case commitStagedChanges returns an error', () => {
    const listMapping = [
      {generate: 'g1', extract: 'e1', key: 'a'},
      {generate: 'g2', extract: 'e2', key: 'a'},
      {generate: 'l1[*].a1', extract: 'e3', key: 'a'},
    ];
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'exp0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };

    return expectSaga(responseMappingSave)
      .provide([
        [select(selectors.responseMapping), {flowId: 'f1', mappings: listMapping, resourceId: 'r1'}],
        [select(selectors.resourceData, 'flows', 'f1'), flowResource],
        [call(commitStagedChanges, {
          resourceType: 'flows',
          id: 'f1',
          scope: SCOPES.VALUE,
        }), {error: {}}],
      ])
      .put(actions.responseMapping.saveFailed())
      .run();
  });

  test('show trigger saveComplete on successfully completion of response mapping save', () => {
    const listMapping = [
      {generate: 'g1', extract: 'e1', key: 'a'},
      {generate: 'g2', extract: 'e2', key: 'a'},
      {generate: 'l1[*].a1', extract: 'e3', key: 'a'},
    ];
    const flowResource = {
      merged: {
        pageProcessors: [
          {type: 'export', _connectionId: 'something', _exportId: 'exp0', responseMapping: {}},
          {type: 'import', _connectionId: 'something', _importId: 'r1', responseMapping: {}},
        ],
      },
    };

    return expectSaga(responseMappingSave)
      .provide([
        [select(selectors.responseMapping), {flowId: 'f1', mappings: listMapping, resourceId: 'r1'}],
        [select(selectors.resourceData, 'flows', 'f1'), flowResource],
        [call(commitStagedChanges, {
          resourceType: 'flows',
          id: 'f1',
          scope: SCOPES.VALUE,
        }), undefined],
      ])
      .put(actions.responseMapping.saveComplete())
      .run();
  });
});

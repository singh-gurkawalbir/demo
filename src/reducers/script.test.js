
import { selectors } from '.';

describe('Scripts region selector testcases', () => {
  describe('selectors.mkGetScriptsTiedToFlow test cases', () => {
    const scriptsSelector = selectors.mkGetScriptsTiedToFlow();

    test('should return null in case scripts is not present', () => {
      const state = {
        data: {resources: {imports: [
          {_id: 'i1'},
        ],
        exports: []}},
      };

      expect(scriptsSelector(state)).toBeNull();
    });

    test('should return null if no flow id match', () => {
      const state = {
        data: {
          resources: {
            imports: [
              {_id: 'i1',
                hooks: {
                  preSavePage: {
                    _scriptId: '5e5e3ce03a9b335b1a00407c',
                    function: 'preSavePage',
                  },
                },
                transform: {
                  type: 'script',
                  script: {
                    _scriptId: '5f19ba0c97d87b2b9780d027',
                    function: 'transform',
                  },
                },
              },
            ],
            exports: [],
            scripts: [
              {_id: 's1', name: 'xyz'},
              {_id: 's2', name: 'abc'},
            ],
            flows: [
              {
                _id: 'f1',
                pageProcessors: [{_importId: 'i1'}],
                pageGenerators: [],

              },
            ],
          }},
      };

      expect(scriptsSelector(state, 'f2')).toBeNull();
    });

    test('should return all scripts used in a flow', () => {
      const state = {
        data: {
          resources: {
            imports: [
              {
                _id: 'i1',
                hooks: {
                  preSavePage: {
                    _scriptId: 's1',
                    function: 'preSavePage',
                  },
                },
                transform: {
                  type: 'script',
                  script: {
                    _scriptId: 's2',
                    function: 'transform',
                  },
                },
              },
            ],
            exports: [],
            scripts: [
              {_id: 's1', name: 'xyz'},
              {_id: 's2', name: 'abc'},

            ],
            flows: [
              {
                _id: 'f1',
                pageProcessors: [
                  {
                    type: 'import',
                    _importId: 'i1',
                  },
                ],
                pageGenerators: [],

              },
            ],
          }},
      };

      expect(scriptsSelector(state, 'f1')).toEqual(
        [
          {
            _id: 's1',
            name: 'xyz',
          },
        ]
      );
    });
    test('should return all scripts used in a flow[2]', () => {
      const state = {
        data: {
          resources: {
            imports: [
              {
                _id: 'i1',
                responseTransform: {
                  type: 'script',
                  script: {
                    _scriptId: 's1',
                    function: 'transform',
                  },
                },
                hooks: {
                  preSavePage: {
                    _scriptId: 's1',
                    function: 'preSavePage',
                  },
                },
              },
            ],
            exports: [{
              _id: 'e1',
              filter: {
                type: 'script',
                script: {
                  _scriptId: 's3',
                  function: 'filter',
                },
              },
            }],
            scripts: [
              {_id: 's1', name: 'xyz'},
              {_id: 's2', name: 'abc'},
              {_id: 's3', name: 'xyz2'},
              {_id: 's4', name: 'xyz3'},

            ],
            flows: [
              {
                _id: 'f1',
                pageProcessors: [
                  {
                    type: 'import',
                    _importId: 'i1',
                  },
                ],
                pageGenerators: [
                  {
                    _exportId: 'e1',
                  },
                ],

              },
            ],
          }},
      };

      expect(scriptsSelector(state, 'f1')).toEqual(
        [
          {_id: 's1', name: 'xyz'},
          {_id: 's3', name: 'xyz2'},
        ]
      );
    });
  });
  describe('selectors.getScriptContext test cases', () => {
    test('should return undefined incase of no params', () => {
      expect(selectors.getScriptContext({}, {})).toBeUndefined();
    });
    test('should return undefined incase of contextType other thank hook', () => {
      expect(selectors.getScriptContext({}, { contextType: 'settings'})).toBeUndefined();
    });
    test('should return undefined if there is no integration/flow/api id for contextType hook', () => {
      expect(selectors.getScriptContext({}, { contextType: 'hook' })).toBeUndefined();
      expect(selectors.getScriptContext({}, { contextType: 'hook', resourceType: 'exports' })).toBeUndefined();
      expect(selectors.getScriptContext({}, { contextType: 'hook', resourceType: 'imports' })).toBeUndefined();
      expect(selectors.getScriptContext({}, { contextType: 'hook', resourceType: 'api', resourceId: 'new-1234' })).toBeUndefined();
    });
    test('should return integration container when contextType hook and integration is present', () => {
      const state = {
        data: {
          resources: {
            flows: [
              {_id: 'flow-123', _integrationId: 'integration1'},
            ],
          },
        },
      };

      const expectedContext = {
        type: 'hook',
        container: 'integration',
        _integrationId: 'integration1',
        _flowId: 'flow-123',
      };

      expect(selectors.getScriptContext(state, { contextType: 'hook', flowId: 'flow-123' })).toEqual(expectedContext);
    });
    test('should return flow container when contextType hook and it is standalone flow', () => {
      const state = {
        data: {
          resources: {
            flows: [
              { _id: 'flow-123', name: 'flow1' },
            ],
          },
        },
      };

      const expectedContext = {
        type: 'hook',
        container: 'flow',
        _flowId: 'flow-123',
      };

      expect(selectors.getScriptContext(state, { contextType: 'hook', flowId: 'flow-123' })).toEqual(expectedContext);
    });
    test('should return api container when contextType hook and it is opened from an api', () => {
      const state = {
        data: {
          resources: {
            flows: [
              { _id: 'flow-123', name: 'flow1' },
            ],
          },
        },
      };

      const expectedContext = {
        type: 'hook',
        container: 'api',
        _apiId: 'api-123',
      };

      expect(selectors.getScriptContext(state, { contextType: 'hook', resourceType: 'apis', resourceId: 'api-123' })).toEqual(expectedContext);
    });
  });
});


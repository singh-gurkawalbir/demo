/* global describe, expect, test */
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

      expect(scriptsSelector(state)).toEqual(null);
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

      expect(scriptsSelector(state, 'f2')).toEqual(null);
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
});


/* global describe, expect, test */
import { selectors } from '.';
import { STANDALONE_INTEGRATION } from '../utils/constants';
import {FILTER_KEYS_AD} from '../utils/accountDashboard';

const state = {
  data: {
    resources: {
      tiles: [
        { _integrationId: STANDALONE_INTEGRATION.id, name: STANDALONE_INTEGRATION.name },
      ],
      flows: [
        {_id: 'flow1', name: 'flow1', _integrationId: 'int1'},
        {_id: 'flow2', name: 'flow2', _integrationId: 'int1'},
        {_id: 'flow3', name: 'flow3', _integrationId: 'int2'},
        {_id: 'flow4', name: 'flow4', _integrationId: 'int2'},
        {_id: 'flow5', name: 'flow4', _integrationId: 'int3', sandbox: true},
        {
          _id: 'f1',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f2',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e2',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f3',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e3',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        // standalone flow
        {_id: 'flow6', name: 'flow6'},
      ],
      integrations: [
        {_id: 'int1', name: 'int1'},
        {_id: 'int2', name: 'int2'},
        {_id: 'int3', name: 'int3', sandbox: true },
        {
          _id: 'i1',
          _connectorId: 'ctr1',
          settings: {
            supportsMultiStore: true,
            sections: [
              {
                title: 't1',
                id: 'secId',
                sections: [
                  {
                    flows: [
                      {
                        _id: 'f1',
                      },
                    ],
                  },
                  {
                    flows: [
                      {
                        _id: 'f2',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },

      ],
    },
  },
};

describe('selectors.getAllAccountDashboardIntegrations', () => {
  test('should return default integration list when state is null or undefined', () => {
    const res = selectors.getAllAccountDashboardIntegrations();
    const expected = [{
      _id: 'all',
      name: 'All integrations',
    }];

    expect(res).toEqual(expected);
  });
  test('should return all account integrations', () => {
    const res = selectors.getAllAccountDashboardIntegrations(state);
    const expected = [{_id: 'all', name: 'All integrations'}, {_connectorId: 'ctr1', _id: 'i1', children: [{_id: 'storesecIdpidi1', name: 't1'}], settings: {sections: [{id: 'secId', sections: [{flows: [{_id: 'f1'}]}, {flows: [{_id: 'f2'}]}], title: 't1'}], supportsMultiStore: true}}, {_id: 'int1', name: 'int1'}, {_id: 'int2', name: 'int2'}, {_id: 'none', name: 'Standalone flows'}];

    expect(res).toEqual(expected);
  });
});
describe('selectors.getAllAccountDashboardFlows', () => {
  test('should return default flows list when state is null or undefined', () => {
    const res = selectors.getAllAccountDashboardFlows({}, FILTER_KEYS_AD.RUNNING);
    const expected = [
      {
        _id: 'all',
        name: 'All flows',
      },
    ];

    expect(res).toEqual(expected);
  });
  test('should return all flows of selected integrations list for running flows', () => {
    state.session = {
      filters: {
        runningFlows: {
          integrationIds: ['storesecIdpidi1', 'int2'],

        },
      },
    };
    const res = selectors.getAllAccountDashboardFlows(state, FILTER_KEYS_AD.RUNNING);
    const expected = [
      {
        _id: 'all',
        name: 'All flows',
      },
      {
        _connectorId: 'ctr1',
        _id: 'f1',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      },
      {
        _connectorId: 'ctr1',
        _id: 'f2',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e2',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      },
      {
        _id: 'flow3',
        _integrationId: 'int2',
        name: 'flow3',
      },
      {
        _id: 'flow4',
        _integrationId: 'int2',
        name: 'flow4',
      },
    ];

    expect(res).toEqual(expected);
  });
  test('should return all flows of selected integrations list for completed flows', () => {
    state.session = {
      filters: {
        completedFlows: {
          integrationIds: ['none', 'int3'],

        },
      },
    };
    const res = selectors.getAllAccountDashboardFlows(state, FILTER_KEYS_AD.COMPLETED);
    const expected = [
      {
        _id: 'all',
        name: 'All flows',
      },
      {
        _id: 'flow6',
        name: 'flow6',
      },
    ];

    expect(res).toEqual(expected);
  });
});

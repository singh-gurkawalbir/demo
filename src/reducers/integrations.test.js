/* global describe, expect, test */
import produce from 'immer';
import { selectors } from '.';
import { STANDALONE_INTEGRATION } from '../utils/constants';

const v1Integrations = [
  {
    _id: 'integrationId',
    name: 'integration Name',
    mode: 'settings',
    _connectorId: 'connectorId',
    settings: {
      sections: [
        {
          id: 'store1',
          title: 'store1',
          sections: [
            {
              id: 'sectionTitle',
              flows: [
                {
                  _id: 'ia1.0Flow1',
                },
              ],
            },
          ],
        },
        {
          id: 'store2',
          title: 'store2',
          sections: [
            {
              id: 'sectionTitle',
              flows: [
                {
                  _id: 'ia1.0Flow2',
                },
              ],
            },
          ],
        },
      ],
      supportsMultiStore: true,
    },
  },
  {
    _id: 'integrationId2',
    name: 'integration2 Name',
    _connectorId: 'connectorId1',
    settings: {
      sections: [
        {
          id: 'sectionTitle',
          flows: [
            {
              _id: 'ia1.0Flow3',
            },
          ],
        },
        {
          id: 'sectionTitle',
          flows: [
            {
              _id: 'ia1.0Flow4',
            },
          ],
        },
      ],
    },
  },
];

const someParentIntegrationIdv2 = 'ia2.0';
const diyIntegration = [
  { _id: 'diyIntegration',
    name: 'DIY integration'},
];
const v2Integrations = [
  {_id: someParentIntegrationIdv2,
    _connectorId: 'connector1',
    initChild: {function: 'someValue'},
    installSteps: [{someStep1: 'someprops'}],
  },
  {
    _id: '124',
    name: 'int2',
    _connectorId: 'connector1',
    _parentId: someParentIntegrationIdv2,
    installSteps: [{someStep1: 'someprops'}],

  },
  {
    _id: '123',
    name: 'int1',
    _connectorId: 'connector1',
    _parentId: someParentIntegrationIdv2,
    installSteps: [{someStep1: 'someprops'}],
  },
  {_id: '125',
    _connectorId: 'connector1',
    installSteps: [{someStep1: 'someprops'}],
  },
];
const standaloneFlows = [
  { _id: 'flowStandalone1', name: 'flowStandalone1'},
  { _id: 'flowStandalone2', name: 'flowStandalone2'},

];
const diyFlows = [
  {_integrationId: 'diyIntegration', _id: 'flowdiy1', name: 'flowDiy1'},
  {_integrationId: 'diyIntegration', _id: 'flowdiy2', name: 'flowDiy2'},

];
const v2Flows = [
  {_integrationId: someParentIntegrationIdv2, _id: 'flow1', name: 'a'},
  {_integrationId: '123', _id: 'flow2', name: 'c'},
  {_integrationId: '124', _id: 'flow3', name: 'b'},
];

const v1Flows = [

  {
    _id: 'ia1.0Flow1',
    name: 'ia1.0Flow1',
    _integrationId: 'integrationId',
  },
  {
    _id: 'ia1.0Flow2',
    name: 'ia1.0Flow2',
    _integrationId: 'integrationId',
  },
  {
    _id: 'ia1.0Flow3',
    name: 'ia1.0Flow3',
    _integrationId: 'integrationId2',
  },
  {
    _id: 'ia1.0Flow4',
    name: 'ia1.0Flow4',
    _integrationId: 'integrationId2',
  },
];
const state = {
  data: {
    resources: {
      integrations: [...diyIntegration, ...v1Integrations, ...v2Integrations],

      flows: [...diyFlows, ...v2Flows, ...v1Flows],
    },
  },
};

describe('selectors.mkGetChildIntegrations ', () => {
  const childIntegrationSel = selectors.mkGetChildIntegrations();

  test('should return null for a an empty integrationId', () => {
    const result = childIntegrationSel(state, null);

    expect(result).toEqual(null);
  });
  test('should return undefined for a non existent integrationId', () => {
    const result = childIntegrationSel(state, 'someRandomId');

    expect(result).toEqual(undefined);
  });
  test('should return all v2 childIntegrations sorted', () => {
    const result = childIntegrationSel(state, someParentIntegrationIdv2);

    expect(result).toEqual([
      {
        _id: '123',
        name: 'int1',
        _connectorId: 'connector1',
        _parentId: someParentIntegrationIdv2,
        installSteps: [{someStep1: 'someprops'}],
        label: 'int1',
        value: '123',

      },
      {
        _id: '124',
        name: 'int2',
        _connectorId: 'connector1',
        _parentId: someParentIntegrationIdv2,
        installSteps: [{someStep1: 'someprops'}],
        label: 'int2',
        value: '124',

      },
    ]);
  });
  test('should return all v1 childIntegrations', () => {
    const result = childIntegrationSel(state, 'integrationId');

    expect(result).toEqual(
      [{hidden: false, label: 'store1', mode: 'settings', value: 'store1'},
        {hidden: false, label: 'store2', mode: 'settings', value: 'store2'}]
    );
  });
});

describe('selectors.getChildIntegrationLabelsTiedToFlows ', () => {
  test('should return null for a an empty integrationId', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, null);

    expect(result).toEqual(null);
  });
  test('should return null for a non existent integrationId', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, 'someRandomId', ['someFlowId']);

    expect(result).toEqual(null);
  });
  test('should return all v2 childIntegrations labels tied to the flows', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, someParentIntegrationIdv2, ['flow2', 'flow3']);

    expect(result).toEqual(['int1', 'int2']);
  });
  test('should return storeId specific label for a v1 multistore childIntegrations', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, 'integrationId', ['ia1.0Flow1']);

    expect(result).toEqual(['store1']);
  });
  test('should return null for a non multistore v1 childIntegrations', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, 'integrationId2', ['ia1.0Flow3']);

    expect(result).toEqual(null);
  });
});
describe('selectors.mkAllFlowsTiedToIntegrations ', () => {
  const getAllFlowsTiedToIntegrations = selectors.mkAllFlowsTiedToIntegrations();

  test('should return null for a an empty integrationId', () => {
    const result = getAllFlowsTiedToIntegrations(state, null);

    expect(result).toEqual(null);
  });
  test('should return [] for a an invalid integrationId', () => {
    const result = getAllFlowsTiedToIntegrations(state, 'someRamdomIntegrationId');

    expect(result).toEqual([]);
  });
  describe('2.0', () => {
    test('should return null when a parent integration is not provided and some childIntegrations are provided ', () => {
      const result = getAllFlowsTiedToIntegrations(state, null, ['124']);

      expect(result).toEqual(null);
    });
    test('should return all flows sorted by name when a v2 parent integration  all of its children integrationsProvided', () => {
      const result = getAllFlowsTiedToIntegrations(state, someParentIntegrationIdv2, ['124', '123']);

      expect(result).toEqual([
        {_integrationId: someParentIntegrationIdv2, _id: 'flow1', name: 'a'},
        {_integrationId: '124', _id: 'flow3', name: 'b'},
        {_integrationId: '123', _id: 'flow2', name: 'c'},
      ]);
    });
    test('should return correct flows sorted by name when a v2 parent integration is provided any only one childIntegration ', () => {
      const result = getAllFlowsTiedToIntegrations(state, someParentIntegrationIdv2, ['124']);

      expect(result).toEqual([
        {_integrationId: someParentIntegrationIdv2, _id: 'flow1', name: 'a'},
        {_integrationId: '124', _id: 'flow3', name: 'b'},
      ]);
    });
  });

  describe('DIY', () => {
    test('should return all flows sorted by name when a DIY parent integration and null childIntegrations', () => {
      const result = getAllFlowsTiedToIntegrations(state, 'diyIntegration', null);

      expect(result).toEqual([
        {_integrationId: 'diyIntegration', _id: 'flowdiy1', name: 'flowDiy1'},
        {_integrationId: 'diyIntegration', _id: 'flowdiy2', name: 'flowDiy2'},

      ]);
    });
  });
  describe('1.0', () => {
    test('should return allFlows related to the parent integration when just the integrationParent is provided for a 1.0 multistore integration ', () => {
      const result = getAllFlowsTiedToIntegrations(state, 'integrationId');

      expect(result).toEqual([
        {_id: 'ia1.0Flow1',
          _integrationId: 'integrationId',
          childId: 'store1',
          childName: 'store1',
          errors: 0,
          id: 'ia1.0Flow1',
          name: 'ia1.0Flow1',
        },
        {
          _id: 'ia1.0Flow2',
          _integrationId: 'integrationId',
          childId: 'store2',
          childName: 'store2',
          errors: 0,
          id: 'ia1.0Flow2',
          name: 'ia1.0Flow2',
        },
      ]);
    });
    test('should return allFlows related to the storeId when just the integrationParent and storeId is provided for a 1.0 multistore integration ', () => {
      const result = getAllFlowsTiedToIntegrations(state, 'integrationId', ['store1']);

      expect(result).toEqual([
        {_id: 'ia1.0Flow1',
          _integrationId: 'integrationId',
          childId: 'store1',
          childName: 'store1',
          errors: 0,
          id: 'ia1.0Flow1',
          name: 'ia1.0Flow1',
        },
      ]);
    });
    test('should return allFlows related to the parent integration when just the integrationParent is provided for a 1.0 non multistore integration ', () => {
      const result = getAllFlowsTiedToIntegrations(state, 'integrationId2');

      expect(result).toEqual([
        {
          _id: 'ia1.0Flow3',
          _integrationId: 'integrationId2',
          errors: 0,
          name: 'ia1.0Flow3',
        },
        {
          _id: 'ia1.0Flow4',
          _integrationId: 'integrationId2',
          errors: 0,
          name: 'ia1.0Flow4',
        },
      ]);
    });
  });
});

describe('selectors.getAllValidIntegrations', () => {
  const usersState = {
    preferences: { defaultAShareId: 'ashare1' },
    org: {
      accounts: [
        {
          _id: 'ashare1',
          accepted: true,
          ownerUser: {
            company: 'Company One',
            licenses: [
              {

                created: '2015-10-28T11:30:15.533Z',
                expires: '2030-11-27T11:30:15.533Z',
                lastModified: '2021-01-06T09:28:31.494Z',
                opts: {connectorEdition: 'standard'},
                resumable: false,
                type: 'connector',
                _connectorId: '5666865f67c1650309224904',
                _integrationId: 'integrationId',
                _id: '5dc0481af0222c1c4b566f99',
              },
              {

                created: '2015-10-28T11:30:15.533Z',
                // integration expired
                expires: '2020-11-27T11:30:15.533Z',
                lastModified: '2021-01-06T09:28:31.494Z',
                opts: {connectorEdition: 'standard'},
                resumable: false,
                type: 'connector',
                _connectorId: '5666865f67c1650309224904',
                _integrationId: 'integrationId2',
                _id: '5dc0481af0222c1c4b566f30',
              },
            ],
          },
        },
      ],
    },
  };

  const stateCopy = {

    ...state,
    user: usersState,

  };
  const getAllValidIntegrations = selectors.mkGetAllValidIntegrations();

  test('should return [] when integrations hasn`t loaded ', () => {
    const result = getAllValidIntegrations({user: usersState});

    expect(result).toEqual([]);
  });
  test('should return correct installed and not expired integrations ', () => {
    const result = getAllValidIntegrations(stateCopy);
    const notExpiredV1Int = v1Integrations.find(({_id}) => _id === 'integrationId');

    expect(result).toEqual([
      diyIntegration[0],
      notExpiredV1Int,
    ]);
  });
  test('should return correct installed,not expired integrations and standalone flows', () => {
    const stateWithStandaloneFlows = produce(stateCopy, draft => {
      draft.data.resources.flows = [...standaloneFlows, ...draft.data.resources.flows];
    });
    const result = getAllValidIntegrations(stateWithStandaloneFlows);
    const notExpiredV1Int = v1Integrations.find(({_id}) => _id === 'integrationId');

    expect(result).toEqual([
      {_id: STANDALONE_INTEGRATION.id, name: STANDALONE_INTEGRATION.name},
      diyIntegration[0],
      notExpiredV1Int,
    ]);
  });
});

describe('selectors.isParentChildIntegration', () => {
  describe('1.0', () => {
    test('should return true for a 1.0 integration which supports multistore ', () => {
      const result = selectors.isParentChildIntegration(state, 'integrationId');

      expect(result).toEqual(true);
    });
    test('should return true for a 1.0 integration which does not support multistore ', () => {
      const result = selectors.isParentChildIntegration(state, 'integrationId2');

      expect(result).toEqual(false);
    });
  });
  describe('2.0', () => {
    test('should return true for a 2.0 integration which supports parentChild ', () => {
      const result = selectors.isParentChildIntegration(state, someParentIntegrationIdv2);

      expect(result).toEqual(true);
    });
    test('should return true for a 2.0 integration which does not support parentChild ', () => {
      const result = selectors.isParentChildIntegration(state, '125');

      expect(result).toEqual(false);
    });
  });
  test('should return false for diy integrations', () => {
    const result = selectors.isParentChildIntegration(state, 'diyIntegration');

    expect(result).toEqual(false);
  });
});

/* global describe, expect, test */
import { selectors } from '.';
import {integrations as v1Integrations} from './integrationApps.test';

const someParentIntegrationIdv2 = 'abc';
const v2Integrations = [
  {_id: 'abc',
    installSteps: [{someStep1: 'someprops'}],
  },
  {
    _id: '123',
    name: 'int1',
    _parentId: someParentIntegrationIdv2,
  },
  {
    _id: '124',
    name: 'int2',
    _parentId: someParentIntegrationIdv2,
  },
];

const v2Flows = [

  {_integrationId: '123', _id: 'flow1'},
  {_integrationId: '124', _id: 'flow2'},

];

const v1Flows = [
  {
    _id: '5d9b20328a71fc911a4018a4',
    name: '5d9b20328a71fc911a4018a4',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9b20328a71fc911a4018ad',
    name: '5d9b20328a71fc911a4018ad',
    _integrationId: 'integrationId2',
  },
  {
    _id: '5d9f70b98a71fc911a4068bd',
    name: '5d9f70b98a71fc911a4068bd',
    _integrationId: 'integrationId',
  },
];
const state = {
  data: {
    resources: {
      integrations: [...v1Integrations, ...v2Integrations],

      flows: [...v2Flows, ...v1Flows],
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
  test('should return all v2 childIntegrations', () => {
    const result = childIntegrationSel(state, someParentIntegrationIdv2);

    expect(result).toEqual([
      {
        value: '123',
        label: 'int1',
        _id: '123',
        name: 'int1',
        _parentId: someParentIntegrationIdv2,
      },
      {
        label: 'int2',
        value: '124',
        _id: '124',
        name: 'int2',
        _parentId: someParentIntegrationIdv2,
      },
    ]);
  });
  test('should return all v1 childIntegrations', () => {
    const result = childIntegrationSel(state, 'integrationId');

    expect(result).toEqual(
      [{hidden: false, label: 'BILLTECH', mode: 'settings', value: 'fb5fb65e'}, {hidden: false, label: 'HSBC', mode: 'settings', value: 'dd67a407'}]
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
  test('should return all v2 childIntegrations tied to the flows', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, 'abc', ['flow1']);

    expect(result).toEqual(['int1']);
  });
  test('should return all v1 childIntegrations', () => {
    const result = selectors.getChildIntegrationLabelsTiedToFlows(state, 'integrationId', ['5d9f70b98a71fc911a4068bd']);

    expect(result).toEqual(
      ['BILLTECH']
    );
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
  test('should return correct flows for a v2 integration', () => {
    const result = getAllFlowsTiedToIntegrations(state, ['124', '123']);

    expect(result).toEqual([
      {

        _id: 'flow1',
        _integrationId: '123',
      },
      {
        _id: 'flow2',
        _integrationId: '124',
      },
    ]);
  });

  test('should return correct flows for a non v2 integration', () => {
    const result = getAllFlowsTiedToIntegrations(state, ['integrationId2']);

    expect(result).toEqual([
      {
        _id: '5d9b20328a71fc911a4018a4',
        name: '5d9b20328a71fc911a4018a4',
        _integrationId: 'integrationId2',
      },
      {
        _id: '5d9b20328a71fc911a4018ad',
        name: '5d9b20328a71fc911a4018ad',
        _integrationId: 'integrationId2',
      },
    ]);
  });
});


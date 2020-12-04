/* global describe, test, expect */

import { deepClone } from 'fast-json-patch';
import reducer, { selectors, _addDefinition, _generateFileDefinitionOptions } from '.';
import actions from '../../../actions';

describe('File Definitions', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {},
    });
  });
  test('should update status as requested on request action', () => {
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.request()
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: { status: 'requested' },
    });
  });
  test('should update data as empty when received nothing on received action', () => {
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received()
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: { status: 'received', data: {} },
    });
  });
  test('should update data on received action', () => {
    const sampleFileDefinitions = {
      definitions: [
        {
          _id: 'amazonedi850',
          name: 'Amazon VC 850',
          vendor: 'Amazon Vendor Central',
          format: 'delimited',
        },
        {
          _id: 'macysedi850outbound',
          name: "Macy's 850 Outbound",
          vendor: "Macy's",
          format: 'delimited/edifact',
        },
        {
          _id: 'thehomedepotedi997',
          name: 'The Home Depot 997',
          vendor: 'The Home Depot',
          format: 'delimited/x12',
        },
        {
          _id: 'macysedi850inbound',
          name: "Macy's 850 Inbound",
          vendor: "Macy's",
          format: 'fixed',
        },
      ],
    };
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received(sampleFileDefinitions)
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        status: 'received',
        data: {
          edi: [
            { subHeader: 'Amazon Vendor Central' },
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
            },
            { subHeader: 'The Home Depot' },
            {
              format: 'delimited/x12',
              label: 'The Home Depot 997',
              value: 'thehomedepotedi997',
              vendor: 'The Home Depot',
            },
          ],
          ediFact: [
            { subHeader: "Macy's" },
            {
              format: 'delimited/edifact',
              label: "Macy's 850 Outbound",
              value: 'macysedi850outbound',
              vendor: "Macy's",
            },
          ],
          fixed: [
            { subHeader: "Macy's" },
            {
              format: 'fixed',
              label: "Macy's 850 Inbound",
              value: 'macysedi850inbound',
              vendor: "Macy's",
            },
          ],
        },
      },
    });
  });
  test('should update template with the received definition on received action', () => {
    const sampleFileDefinitions = {
      definitions: [
        {
          _id: 'amazonedi850',
          name: 'Amazon VC 850',
          vendor: 'Amazon Vendor Central',
          format: 'delimited',
        },
      ],
    };
    const fileDefinitionsReceivedState = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received(sampleFileDefinitions)
    );
    const state = reducer(
      fileDefinitionsReceivedState,
      actions.fileDefinitions.definition.preBuilt.received(
        { generate: {}, parse: {} },
        'edi',
        'amazonedi850'
      )
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        data: {
          edi: [
            { subHeader: 'Amazon Vendor Central' },
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
              template: { generate: {}, parse: {} },
            },
          ],
        },
        status: 'received',
      },
    });
  });
  test('should update status as error on receivedError action', () => {
    const requestedState = reducer(
      undefined,
      reducer(undefined, actions.fileDefinitions.preBuilt.request())
    );
    const state = reducer(
      requestedState,
      actions.fileDefinitions.preBuilt.receivedError('Error Occured')
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        status: 'error',
        errorMessage: 'Error Occured',
      },
    });
  });
});

describe('preBuiltFileDefinitions selector', () => {
  test('should return empty set when state is default', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION'});

    expect(selectors.preBuiltFileDefinitions(state)).toEqual({ data: [], status: undefined });
  });
  test('should return proper data with status when asked for a preBuiltDefinition format', () => {
    const state = {
      preBuiltFileDefinitions: {
        data: {
          edi: [
            { subHeader: 'Amazon Vendor Central' },
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
              template: { generate: {}, parse: {} },
            },
          ],
        },
        status: 'received',
      },
    };

    expect(selectors.preBuiltFileDefinitions(state, 'edi')).toEqual({
      data: [
        { subHeader: 'Amazon Vendor Central' },
        {
          format: 'delimited',
          label: 'Amazon VC 850',
          value: 'amazonedi850',
          vendor: 'Amazon Vendor Central',
          template: { generate: {}, parse: {} },
        },
      ],
      status: 'received',
    });
  });
  test('should return empty data when there is no/invalid format passed', () => {
    const state = {
      preBuiltFileDefinitions: {
        data: {
          edi: [
            { subHeader: 'Amazon Vendor Central' },
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
              template: { generate: {}, parse: {} },
            },
          ],
        },
        status: 'received',
      },
    };

    expect(selectors.preBuiltFileDefinitions(state)).toEqual({
      data: [],
      status: 'received',
    });
    expect(selectors.preBuiltFileDefinitions(state, 'INVALID_FORMAT')).toEqual({
      data: [],
      status: 'received',
    });
  });
});

describe('fileDefinition selector', () => {
  test('should return undefined when the state is default and with invalid options passed', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION'});

    expect(selectors.fileDefinition()).toBeUndefined();
    expect(selectors.fileDefinition(state, '123')).toBeUndefined();
    expect(selectors.fileDefinition(state, '123', { resourceType: 'exports', format: 'edi'})).toBeUndefined();
  });
  test('should return parse/generate template when requested by exports/imports respectively for a file definition format', () => {
    const state = {
      preBuiltFileDefinitions: {
        data: {
          edi: [{
            vendor: '84 Lumber',
            value: '84lumberedi810',
            template: {
              generate: {
                name: '84 Lumber 810',
                description: 'Invoice',
                format: 'delimited',
                sampleData: {
                  'Authorization Information Qualifier': '02',
                  'Authorization Information': 'SW810',
                  'Security Information Qualifier': '00',
                  'Security Information': '',
                },
                rules: [{
                  maxOccurrence: 2,
                  required: true,
                }],
              },
              parse: {
                name: '84 Lumber 810',
                description: 'Invoice',
                sampleData: 'ISA*02*SW810 *00* *01*84EXAMPLE *12',
                rules: [{
                  maxOccurrence: 1,
                  skipRowSuffix: true,
                }],
              },
            },
          }],
        },
        status: 'received',
      },
    };

    const expectedParseTemplate = {
      name: '84 Lumber 810',
      description: 'Invoice',
      sampleData: 'ISA*02*SW810 *00* *01*84EXAMPLE *12',
      rules: [{
        maxOccurrence: 1,
        skipRowSuffix: true,
      }],
    };
    const expectedGenerateTemplate = {
      name: '84 Lumber 810',
      description: 'Invoice',
      format: 'delimited',
      sampleData: {
        'Authorization Information Qualifier': '02',
        'Authorization Information': 'SW810',
        'Security Information Qualifier': '00',
        'Security Information': '',
      },
      rules: [{
        maxOccurrence: 2,
        required: true,
      }],
    };
    const importOptions = { resourceType: 'imports', format: 'edi'};
    const exportOptions = { resourceType: 'exports', format: 'edi'};

    expect(selectors.fileDefinition(state, '84lumberedi810', importOptions)).toEqual(expectedGenerateTemplate);

    expect(selectors.fileDefinition(state, '84lumberedi810', exportOptions)).toEqual(expectedParseTemplate);
  });
  test('should return undefined when the template does not exist for a file definition format requested', () => {
    const state = {
      preBuiltFileDefinitions: {
        data: {
          edi: [{
            vendor: '84 Lumber',
            value: '84lumberedi810',
          }],
        },
        status: 'received',
      },
    };
    const exportOptions = { resourceType: 'exports', format: 'edi'};
    const importOptions = { resourceType: 'imports', format: 'edi'};

    expect(selectors.fileDefinition(state, '84lumberedi810', exportOptions)).toBeUndefined();
    expect(selectors.fileDefinition(state, '84lumberedi810', importOptions)).toBeUndefined();
  });
});

describe('_addDefinition util', () => {
  const definitions = [{
    vendor: '84 Lumber',
    value: '84lumberedi810',
  },
  {
    vendor: 'Amazon Vendor Central',
    value: 'amazonedi850',
  },
  ];

  test('should return original definitions if it is undefined or empty', () => {
    expect(_addDefinition()).toBeUndefined();
    expect(_addDefinition([], '234')).toEqual([]);
    expect(_addDefinition(definitions)).toBe(definitions);
  });
  test('should add template to the passed definitionId and return the definitions ', () => {
    const definitionsCopy = deepClone(definitions);
    const definition = {
      generate: {},
      parse: {},
    };
    const expectedDefinitionsWithTemplate = [{
      vendor: '84 Lumber',
      value: '84lumberedi810',
      template: {
        generate: {},
        parse: {},
      },
    },
    {
      vendor: 'Amazon Vendor Central',
      value: 'amazonedi850',
    }];

    expect(_addDefinition(definitionsCopy, '84lumberedi810', definition)).toEqual(expectedDefinitionsWithTemplate);
  });
});

describe('_generateFileDefinitionOptions util', () => {
  test('should return empty object when definitions are empty/undefined', () => {
    expect(_generateFileDefinitionOptions({})).toEqual({});
    expect(_generateFileDefinitionOptions({definitions: []})).toEqual({});
  });
  test('should return definition options with label, value in it', () => {
    const definitions = [
      {_id: 'amazonedi850', name: 'Amazon VC 850', vendor: 'V1', format: 'delimited'},
      {_id: 'macysedi850outbound', name: "Macy's 850 Outbound", vendor: 'V1', format: 'delimited'},
      {_id: 'macysedi850inbound', name: "Macy's 850 Inbound", vendor: 'V2', format: 'delimited/edifact'},
      {_id: 'amazonedi830', name: 'Amazon VC 830', vendor: 'V3', format: 'fixed'},
      {_id: 'amazonedi754', name: 'Amazon VC 754', vendor: 'V3', format: 'fixed'},
    ];
    const expectedOptions = {
      edi: [
        {
          subHeader: 'V1',
        },
        {
          format: 'delimited',
          label: 'Amazon VC 850',
          value: 'amazonedi850',
          vendor: 'V1',
        }, {
          format: 'delimited',
          label: "Macy's 850 Outbound",
          value: 'macysedi850outbound',
          vendor: 'V1',
        }],
      ediFact: [
        {
          subHeader: 'V2',
        },
        {
          format: 'delimited/edifact',
          label: "Macy's 850 Inbound",
          value: 'macysedi850inbound',
          vendor: 'V2',
        },
      ],
      fixed: [
        {
          subHeader: 'V3',
        },
        {
          format: 'fixed',
          label: 'Amazon VC 754',
          value: 'amazonedi754',
          vendor: 'V3',
        },
        {
          format: 'fixed',
          label: 'Amazon VC 830',
          value: 'amazonedi830',
          vendor: 'V3',
        },
      ],
    };

    expect(_generateFileDefinitionOptions({ definitions })).toEqual(expectedOptions);
  });
});


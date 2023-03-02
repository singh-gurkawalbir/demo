
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import FlowScheduleForm from './Form';

const demoFlows = [
  {
    _id: '626bdab2987bb423914b487d',
    lastModified: '2022-06-23T03:40:44.315Z',
    name: 'New flow',
    disabled: false,
    schedule: '? 5 0 ? * 1',
    timezone: 'Asia/Calcutta',
    _integrationId: '626bda66987bb423914b486f',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: { fields: [], lists: [] },
        _importId: '626bdab2987bb423914b487b',
        type: 'import',
      },
    ],
    pageGenerators: [
      { _exportId: '626bdab2987bb423914b4879', skipRetries: false },
    ],
    createdAt: '2022-04-29T12:31:46.612Z',
    free: false,
    _sourceId: '626bda35987bb423914b4868',
    autoResolveMatchingTraceKeys: true,
  },
];

function customSchedule(props) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.flows = demoFlows;
    draft.data.resources.integrations = [
      {
        _id: '626bda66987bb423914b486f',
        lastModified: '2022-04-29T12:31:49.587Z',
        name: 'development',
        description: 'demo integration',
        install: [],
        mode: 'settings',
        sandbox: false,
        _registeredConnectionIds: [
          '626bda95c087e064dcc7f501',
          '626bdaafc087e064dcc7f505',
        ],
        installSteps: [
          {
            name: 'REST API connection',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'http',
              name: 'REST API connection',
              http: { formType: 'rest' },
            },
          },
          {
            name: 'demo REST',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'http',
              name: 'demo REST',
              http: { formType: 'rest' },
            },
          },
          {
            name: 'Copy resources now from template zip',
            completed: true,
            type: 'template_zip',
            templateZip: true,
            isClone: true,
          },
        ],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2022-04-29T12:30:30.857Z',
        _sourceId: '626bd993987bb423914b484f',
      },
    ];
  });
  const ui = (
    <MemoryRouter>
      <FlowScheduleForm {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  getScheduleStartMinute: () => 0,
}));

describe('Flow schedule form UI tests', () => {
  test('should render the fields of form initially', () => {
    customSchedule({
      flow: demoFlows[0],
      disabled: null,
      pg: null,
      index: null,
      testFlag: true,
      formKey: 'flow-schedule',
    });
    expect(screen.getByText('Time zone')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });
});

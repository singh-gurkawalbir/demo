
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FlowNameWithFlowGroupCell from '.';
import { reduxStore, renderWithProviders } from '../../../../../test/test-utils';

const integrations = [
  {
    _id: '62662cc4e06ff462c3db470e',
    name: 'Production',
    description: 'demo integration',
    install: [],
    sandbox: false,
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
  },
  {
    _id: '62662cc4e06ff462c3db470f',
    lastModified: '2022-04-29T12:23:16.887Z',
    name: 'Production',
    description: 'demo integration',
    install: [],
    sandbox: false,
    installSteps: [1],
    uninstallSteps: [],
    flowGroupings: [
      {name: 'Grouping1 name', _id: 'grouping1Id'},
      {name: 'Grouping2 name', _id: 'grouping2Id'},
    ],
  },
  {
    _id: '62662cc4e06ff462c3db4701',
    name: 'Production',
    description: 'demo integration',
    install: [],
    sandbox: false,
    installSteps: [1],
    uninstallSteps: [],
    flowGroupings: [
      {name: 'Grouping1 name', _id: 'grouping1Id'},
      {name: 'Grouping2 name', _id: 'grouping2Id'},
    ],
    _parentId: 'someParentID',
  },
  {
    _id: '5ff579d745ceef7dcd797c15',
    _connectorId: 'connectorId',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2021-01-06T08:50:31.935Z',
    settings: {supportsMultiStore: false,
      sections: [
        {
          id: '1111111',
          label: '11',
          title: 'title1',
          flows: [{_id: 'flow_id4'}] },
      ]},
  },
];

const flows = [
  {
    _id: 'flow_id',
    name: 'demo flow',
    disabled: false,
    _integrationId: '62662cc4e06ff462c3db470e',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
  },
  {
    _id: 'flow_id1',
    name: 'demo flow',
    disabled: false,
    _integrationId: '62662cc4e06ff462c3db470f',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
    _flowGroupingId: 'grouping1Id',
  },
  {
    _id: 'flow_id3',
    name: 'demo flow',
    disabled: false,
    _integrationId: '62662cc4e06ff462c3db4701',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
    _flowGroupingId: 'grouping1Id',
  },
  {
    _id: 'flow_id4',
    name: 'demo flow',
    disabled: false,
    _integrationId: '5ff579d745ceef7dcd797c15',
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
    _flowGroupingId: 'grouping1Id',
  },
];

const initialStore = reduxStore;

initialStore.getState().data.resources.integrations = integrations;
initialStore.getState().data.resources.flows = flows;

describe('flowNameWithFlowGroupCell UI Tests', () => {
  test('should render link with no text when no props are provided', () => {
    renderWithProviders(<MemoryRouter><FlowNameWithFlowGroupCell /></MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/integrations/none/flowBuilder/undefined');
  });
  test('should show link button having link to flowbuilder page of provided flow Id', () => {
    const initialStore = reduxStore;

    renderWithProviders(<MemoryRouter><FlowNameWithFlowGroupCell flowId="flow_id" integrationId="62662cc4e06ff462c3db470e" /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('demo flow');
    expect(link).toHaveAttribute('href', '/integrations/62662cc4e06ff462c3db470e/flowBuilder/flow_id');
  });
  test('should show link text and also flowgroup name', () => {
    renderWithProviders(<MemoryRouter><FlowNameWithFlowGroupCell flowId="flow_id1" integrationId="62662cc4e06ff462c3db470f" /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('demo flow');
    expect(link).toHaveAttribute('href', '/integrations/62662cc4e06ff462c3db470f/flows/sections/grouping1Id/flowBuilder/flow_id1');
    expect(screen.getByText('Grouping1 name')).toBeInTheDocument();
  });
  test('should show parent Id as a integrationID in the link', () => {
    renderWithProviders(<MemoryRouter><FlowNameWithFlowGroupCell flowId="flow_id3" integrationId="62662cc4e06ff462c3db4701" /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('demo flow');
    expect(link).toHaveAttribute('href', '/integrations/someParentID/flows/sections/grouping1Id/flowBuilder/flow_id3');
    expect(screen.getByText('Grouping1 name')).toBeInTheDocument();
  });
  test('should show the title as well as link in version 1', () => {
    renderWithProviders(
      <MemoryRouter>
        <FlowNameWithFlowGroupCell flowId="flow_id4" integrationId="5ff579d745ceef7dcd797c15" />
      </MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('demo flow');
    expect(link).toHaveAttribute('href', '/integrations/5ff579d745ceef7dcd797c15/flows/sections/title1/flowBuilder/flow_id4');
    expect(screen.getByText('title1')).toBeInTheDocument();
  });
});

/* global describe, test,expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import NameCell from '.';
import actions from '../../../../../actions';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().data.resources.connections = [{
  _id: '62bd43c87b94d20de64e9ab3',
  createdAt: '2022-06-30T06:33:44.780Z',
  lastModified: '2022-06-30T06:33:44.870Z',
  offline: true,
  type: 'http',
  name: 'demo',
  sandbox: false,
}];
initialStore.getState().data.resources.flows = [
  {
    _id: '5ea16c600e2fab71928a6152',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: ' Bulk insert with harcode and mulfield mapping settings',
    disabled: true,
    _integrationId: '5e9bf6c9edd8fa3230149fbd',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5ea16cd30e2fab71928a6166',
      },
    ],
    pageGenerators: [
      {
        _exportId: '5d00b9f0bcd64414811b2396',
      },
    ],
    createdAt: '2020-04-23T10:22:24.290Z',
    lastExecutedAt: '2020-04-23T11:08:41.093Z',
    autoResolveMatchingTraceKeys: true,
  },
];

initialStore.getState().data.resources.imports = [
  {
    _id: '5ea16cd30e2fab71928a6166',
    createdAt: '2022-02-25T17:04:59.480Z',
    lastModified: '2022-06-12T06:54:25.628Z',
    name: 'Rest import',
    _connectionId: '62bd43c87b94d20de64e9ab3',
    apiIdentifier: 'ica1cc6072',
    ignoreExisting: false,
    ignoreMissing: false,
    oneToMany: false,
    sandbox: false,
    adaptorType: 'HTTPImport',
  },
];

async function initNameCell(props = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <NameCell
        {...props}
    />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Name Cell of Flow Table UI test cases', () => {
  test('should show undefined as name when no props are provided', () => {
    renderWithProviders(<MemoryRouter><NameCell /></MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('Unnamed (id: undefined)');
    expect(link).toHaveAttribute('href', '/integrations/none/flowBuilder/undefined');
  });
  test('should show name and link to flowBuilder when no connection is offline', async () => {
    renderWithProviders(
      <MemoryRouter>
        <NameCell
          name="SomeName"
          description="somedescription"
          flowId="SomeflowId"
          integrationId="someintegrationId"
          childId="someChildId"
        />
      </MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('SomeName');
    expect(link).toHaveAttribute('href', '/integrations/someintegrationId/flowBuilder/SomeflowId');
  });
  test('should show free label', () => {
    const props = {
      name: 'SomeName',
      description: 'somedescription',
      flowId: 'SomeflowId',
      integrationId: 'someintegrationId',
      childId: 'someChildId',
      isIntegrationApp: true,
      actionProps: {appName: 'someappName', sectionId: 'somesectionId', flowAttributes: []},
      isFree: true,
    };

    initNameCell(props);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
  test('should show name and link to flowBuilder when flow is of integration app', () => {
    const props = {name: 'SomeName',
      description: 'somedescription',
      flowId: 'SomeflowId',
      integrationId: 'someintegrationId',
      childId: 'someChildId',
      isIntegrationApp: true,
      actionProps: {appName: 'someappName', sectionId: 'somesectionId', flowAttributes: []}};

    initNameCell(props);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('SomeName');
    expect(link).toHaveAttribute('href', '/integrationapps/someappName/someintegrationId/child/someChildId/flows/sections/somesectionId/flowBuilder/SomeflowId');
  });
  test('should show name and link for dataloader flow', () => {
    const props = {
      name: 'SomeName',
      description: 'somedescription',
      flowId: 'SomeflowId',
      integrationId: 'someintegrationId',
      childId: 'someChildId',
      isIntegrationApp: true,
      actionProps: {
        appName: 'someappName',
        sectionId: 'somesectionId',
        flowAttributes: {SomeflowId: {isDataLoader: true}}},
    };

    initNameCell(props);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('SomeName');
    expect(link).toHaveAttribute(
      'href', '/integrationapps/someappName/someintegrationId/child/someChildId/flows/sections/somesectionId/dataLoader/SomeflowId');
  });
  test('should show offline message', () => {
    const props = {
      name: 'SomeName',
      description: 'somedescription',
      flowId: '5ea16c600e2fab71928a6152',
      integrationId: 'someintegrationId',
      childId: 'someChildId',
      isIntegrationApp: true,
      actionProps: {appName: 'someappName', sectionId: 'somesectionId', flowAttributes: []},
    };

    initNameCell(props, initialStore);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('SomeName');
    userEvent.click(screen.getAllByRole('button')[0]);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('bottomDrawer', {defaultTab: 'connections'})
    );
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrationapps/someappName/someintegrationId/child/someChildId/flows/sections/somesectionId/flowBuilder/5ea16c600e2fab71928a6152'
    );
  });
});

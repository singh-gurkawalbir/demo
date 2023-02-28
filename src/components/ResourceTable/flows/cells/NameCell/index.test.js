
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
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

mutateStore(initialStore, draft => {
  draft.data.resources.connections = [{
    _id: '62bd43c87b94d20de64e9ab3',
    offline: true,
    type: 'http',
    name: 'demo',
  }];
  draft.data.resources.flows = [
    {
      _id: '5ea16c600e2fab71928a6152',
      _integrationId: '5e9bf6c9edd8fa3230149fbd',
      pageProcessors: [
        {
          _importId: '5ea16cd30e2fab71928a6166',
        },
      ],
      pageGenerators: [
        {
          _exportId: '5d00b9f0bcd64414811b2396',
        },
      ],
    },
  ];

  draft.data.resources.imports = [
    {
      _id: '5ea16cd30e2fab71928a6166',
      lastModified: '2022-06-12T06:54:25.628Z',
      name: 'Rest import',
      _connectionId: '62bd43c87b94d20de64e9ab3',
      adaptorType: 'HTTPImport',
    },
  ];
});

function initNameCell(props = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <NameCell
        {...props}
    />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
  const link = screen.getByRole('link');

  return link;
}

describe('name Cell of Flow Table UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
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

    const link = initNameCell(props);

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

    const link = initNameCell(props);

    expect(link.textContent).toBe('SomeName');
    expect(link).toHaveAttribute(
      'href', '/integrationapps/someappName/someintegrationId/child/someChildId/flows/sections/somesectionId/dataLoader/SomeflowId');
  });
  test('should show offline message', async () => {
    const props = {
      name: 'SomeName',
      description: 'somedescription',
      flowId: '5ea16c600e2fab71928a6152',
      integrationId: 'someintegrationId',
      childId: 'someChildId',
      isIntegrationApp: true,
      actionProps: {appName: 'someappName', sectionId: 'somesectionId', flowAttributes: []},
    };

    const link = initNameCell(props, initialStore);

    expect(link.textContent).toBe('SomeName');
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.patchFilter('bottomDrawer', {defaultTab: 'connections'})
    );
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrationapps/someappName/someintegrationId/child/someChildId/flows/sections/somesectionId/flowBuilder/5ea16c600e2fab71928a6152'
    );
  });
});

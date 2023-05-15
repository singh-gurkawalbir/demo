
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import AliasDrawerWrapper from '.';

const props = {
  resourceId: '_resourceId',
  resourceType: 'integrations',
};
const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

async function initAliasDrawerWrapper({props = {}, manage = true, status = 'save'}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.aliases = {
      _integrationId: {
        aliases: [
          {alias: '_aliasId', _connectionId: '_connId', description: 'some description'},
        ],
      },
      _flowId1: {
        status,
        aliases: [
          {alias: '_aliasId2', _connectionId: '_connId'},
        ],
      },
    };
    draft.data.resources = {
      integrations: [
        {
          _id: '_integrationId',
          name: 'mockIntegration',
          aliases: [{alias: '_aliasId', _connectionId: '_connId', description: 'some description'}],
        },
        {
          _id: '_integrationId2',
          name: 'mockIntegration',
        },
      ],
      connections: [{
        _id: '_connId',
        name: '_mockConnection',
      }],
      flows: [
        {
          _id: '_flowId1',
          name: 'mockFlow1',
          _integrationId: '_integrationId',
          aliases: [
            {alias: '_aliasId2', _connectionId: '_connId'},
          ],
        },
      ],
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: manage ? '/parentURL/aliases/manage' : '/parentURL/aliases/view'}]}>
      <Route path="/parentURL">
        <AliasDrawerWrapper {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: ({children}) => children,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
    location: {pathname: '/'},
  }),
}));
describe('AliasDrawerWrapper tests', () => {
  afterEach(() => {
    mockHistoryGoBack.mockClear();
    mockHistoryPush.mockClear();
  });
  test('Should able to test the alias drawer with Manage alias', async () => {
    await initAliasDrawerWrapper({props});
    expect(screen.getByText('Manage aliases')).toBeInTheDocument();
    const infoText = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'openPageInfo');

    await userEvent.click(infoText);
    expect(screen.getByRole('link', {name: 'Learn more about aliases'})).toBeInTheDocument();
    const createAlias = screen.getByRole('button', {name: 'Create alias'});

    expect(createAlias).toBeInTheDocument();
    await userEvent.click(createAlias);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentURL/aliases/manage/add');
    expect(screen.getByRole('button', {name: 'Aliases'})).toBeInTheDocument();
    expect(screen.getByText('You don’t have any custom aliases.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Inherited aliases'})).toBeInTheDocument();
    expect(screen.getByText('You don’t have any inherited aliases.')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'closeLogs'));
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });

  test('Should able to test the alias drawer with View alias without any alias', async () => {
    await initAliasDrawerWrapper({props, manage: false});
    expect(screen.getByText('View aliases')).toBeInTheDocument();
    const infoText = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'openPageInfo');

    await userEvent.click(infoText);
    expect(screen.getByText('View the list of aliases defined for your resources (flows, connections, export, and imports).')).toBeInTheDocument();
    expect(screen.getByText('You don’t have any aliases.')).toBeInTheDocument();
  });
  test('Should able to test the alias drawer with View alias with one alias', async () => {
    await initAliasDrawerWrapper({props: {...props, resourceId: '_integrationId'}, manage: false});
    expect(screen.queryByText('You don’t have any aliases.')).not.toBeInTheDocument();
    expect(screen.getByText('Alias ID')).toBeInTheDocument();
    expect(screen.getByText('Resource name')).toBeInTheDocument();
    expect(screen.getByText('Resource type')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
  test('Should able to test the alias drawer with Manage alias For flows action save', async () => {
    await initAliasDrawerWrapper({props: {resourceType: 'flows', resourceId: '_flowId1'}});
    expect(screen.getByText('You’ve successfully created an alias.')).toBeInTheDocument();
  });

  test('Should able to test the alias drawer with Manage alias For flows action delete', async () => {
    await initAliasDrawerWrapper({props: {resourceType: 'flows', resourceId: '_flowId1'}, manage: true, status: 'delete'});
    expect(screen.getByText('You’ve successfully deleted your alias.')).toBeInTheDocument();
  });
});


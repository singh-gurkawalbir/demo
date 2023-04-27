
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import ViewAliasDetailsDrawer from './ViewAliasesDetails';

const props = {
  resourceId: '_integrationId',
  resourceType: 'integrations',
};
const mockHistoryGoBack = jest.fn();

async function initViewAliasDetailsDrawer({props = {}, path = 'viewdetails/_aliasId'}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      integrations: [
        {
          _id: '_integrationId',
          name: 'mockIntegration',
          aliases: [{alias: '_aliasId', _connectionId: '_connId', description: 'some description'}],
        }],
      connections: [{
        _id: '_connId',
        name: '_mockConnection',
      }],

      flows: [
        {
          _id: '_flowId1',
          name: 'mockFlow1',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: path}]}>
      <ViewAliasDetailsDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));
describe('ViewAliasDetailsDrawer tests', () => {
  afterEach(() => {
    mockHistoryGoBack.mockClear();
  });
  test('Should able to test the viewAlias details drawer directly', async () => {
    await initViewAliasDetailsDrawer({props});
    expect(screen.getByRole('heading', {name: 'View details'})).toBeInTheDocument();
    expect(screen.getByText('Alias ID:')).toBeInTheDocument();
    expect(screen.getByText('_aliasId')).toBeInTheDocument();
    expect(screen.getByText('Alias description:')).toBeInTheDocument();
    expect(screen.getByText('some description')).toBeInTheDocument();
    expect(screen.getByText('Resource type:')).toBeInTheDocument();
    expect(screen.getByText('Connection')).toBeInTheDocument();
    expect(screen.getByText('Resource name:')).toBeInTheDocument();
    expect(screen.getByText('Resource ID:')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const pageInfo = buttons.find(b => b.getAttribute('data-test') === 'openPageInfo');
    const closeLogs = buttons.find(b => b.getAttribute('data-test') === 'closeLogs');

    await userEvent.click(pageInfo);
    expect(screen.getByText('View information about the alias and the resource it references')).toBeInTheDocument();
    await userEvent.click(closeLogs);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
  test('Should able to test the viewAlias details drawer from manage alias i.e inherited from parent', async () => {
    await initViewAliasDetailsDrawer({props, path: 'viewdetails/_aliasId/inherited/_integrationId'});
    expect(screen.getByRole('heading', {name: 'View details'})).toBeInTheDocument();
    expect(screen.getByText('Alias ID:')).toBeInTheDocument();
    expect(screen.getByText('Parent resource:')).toBeInTheDocument();
    expect(screen.getByText('mockIntegration')).toBeInTheDocument();
  });
  test('Should able to test the viewAlias details drawer with wrong aliasId', async () => {
    await initViewAliasDetailsDrawer({props, path: 'viewdetails/_alia'});
    expect(screen.getByRole('heading', {name: 'View details'})).toBeInTheDocument();
    expect(screen.queryByText('Alias ID:')).not.toBeInTheDocument();
  });
});


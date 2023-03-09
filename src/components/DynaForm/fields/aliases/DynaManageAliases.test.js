
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route} from 'react-router-dom';
import DynaManageAliases from './DynaManageAliases';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaAliasId(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.asyncTask = {'integration-alias': props.status};
    draft.data.resources = {
      integrations: [
        {
          _id: '63368c92bb74b66e32ab05ee',
          aliases: [
            {
              alias: 'test',
              _connectionId: '63368ce9bb74b66e32ab060c',
            },
          ],
        },
      ],
    };
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/63368c92bb74b66e32ab05ee'}]}
    >
      <Route
        path="/integrations/:integrationId"
        params={{integrationId: '63368c92bb74b66e32ab05ee'}}
        >
        <DynaManageAliases {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const mockHistorypush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistorypush,
  }),
}));
describe('dynaAliasId UI tests', () => {
  const props = {
    id: 'aliasId',
    required: true,
    resourceContext: {resourceType: 'integrations', resourceId: '63368c92bb74b66e32ab05ee'},
    aliasContextResourceType: 'integrations',
    aliasData: {
      alias: 'test',
      _connectionId: '63368ce9bb74b66e32ab060c',
    },
    formKey: 'integration-alias',
    value: 'test',
  };

  test('should pass the initial render', () => {
    initDynaAliasId(props);
    const ManageButton = screen.getByRole('button', {name: 'Manage'});

    expect(ManageButton).toBeInTheDocument();
  });
  test('should make the respective url redirection when clicked on Manage', async () => {
    initDynaAliasId(props);
    const ManageButton = screen.getByRole('button', {name: 'Manage'});

    expect(ManageButton).toBeInTheDocument();
    await userEvent.click(ManageButton);
    await waitFor(() => expect(mockHistorypush).toHaveBeenCalledWith('/integrations/63368c92bb74b66e32ab05ee/aliases/manage'));
  });
});

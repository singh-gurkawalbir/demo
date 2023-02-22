
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

async function renderFuntion(actionProps, data) {
  renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: `/integrations/${data.integrationId}/edit`}]}>
      <Route path="/integrations/:integrationId">
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[data]}
        />
      </Route>
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('uI test cases for edit alias', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should call onclick', async () => {
    await renderFuntion({hasManageAccess: true}, {_id: 'someid',
      alias: 'editalias',
      integrationId: '6366bee72c1bd1023108c05b'});
    const editAliasButton = screen.getByText('Edit alias');

    await userEvent.click(editAliasButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6366bee72c1bd1023108c05b/edit/editalias');
  });
});

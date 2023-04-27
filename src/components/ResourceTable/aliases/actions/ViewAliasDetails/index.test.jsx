
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

async function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: `/integrations/${data._integrationId}/aliases`}]}>
      <Route path="/integrations/:integrationId/aliases">
        <CeligoTable {...metadata} data={[data]} />
      </Route>
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', { name: /more/i }));
}

describe('uI test cases for view alias details', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const _id = 'someid';
  const alias = '6368de0bec4c35664453023b';
  const status = 'canceled';
  const _parentId = 'someparentId';
  const _integrationId = '5e44efa28015c9464272256f';

  test('should push viewdetails URL onClick without parentId when it is not provided', async () => {
    await renderFuntion({ _id, alias, status, _integrationId });
    const request = screen.getByText('View details');

    await userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/5e44efa28015c9464272256f/aliases/viewdetails/6368de0bec4c35664453023b'
    );
  });
  test('should push viewdetails URL onClick with parentId when it is provided', async () => {
    await renderFuntion({ _id, alias, _parentId, status, _integrationId });
    const request = screen.getByText('View details');

    await userEvent.click(request);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/5e44efa28015c9464272256f/aliases/viewdetails/6368de0bec4c35664453023b/inherited/someparentId'
    );
  });
});

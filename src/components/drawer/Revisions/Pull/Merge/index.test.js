import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../../test/test-utils';
import MergePullDrawer from '.';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initMergePullDrawer(props = {}) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'pull/_revisionId/merge'}]}>
      <MergePullDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('MergePullDrawer tests', () => {
  test('Should able to test the MergePullDrawer initial render', async () => {
    await initMergePullDrawer(props);
    expect(screen.getByText('Merge changes')).toBeInTheDocument();
    const close = screen.getAllByRole('button', {name: 'Close'})[0];

    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/');
  });
});

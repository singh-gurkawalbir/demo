
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../../test/test-utils';
import FinalRevert from '.';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initFinalRevert(props = {}) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'revert/_revisionId/final'}]}>
      <FinalRevert {...props} />
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

describe('FinalRevert tests', () => {
  test('Should able to test the FinalRevert initial render', async () => {
    await initFinalRevert(props);
    expect(screen.getByRole('heading', {name: 'Revert changes'})).toBeInTheDocument();
    const close = screen.getAllByRole('button', {name: 'Close'})[0];

    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/');
  });
});

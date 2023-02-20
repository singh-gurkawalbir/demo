
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import InstallTemplateDrawer from '.';

const mockHistoryReplace = jest.fn();

async function initInstallTemplateDrawer() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/home/installTemplate/preview/_templateId'}]}>
      <Route path="/home">
        <InstallTemplateDrawer />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('InstallTemplateDrawer tests', () => {
  test('Should able to test the initial render with InstallTemplateDrawer without template', async () => {
    await initInstallTemplateDrawer();
    expect(screen.getByText('Install template')).toBeInTheDocument();
    expect(screen.getByText('Loading Template...')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/home');
  });
});

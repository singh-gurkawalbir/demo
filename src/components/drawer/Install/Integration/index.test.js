
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import InstallIntegrationDrawer from '.';

const mockHistoryReplace = jest.fn();
const mockHistoryGoBack = jest.fn();

async function initInstallIntegrationDrawer(path = '') {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/home/installIntegration${path}`}]}>
      <Route path="/home">
        <InstallIntegrationDrawer />
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
    goBack: mockHistoryGoBack,
  }),
}));

describe('InstallIntegrationDrawer tests', () => {
  test('Should able to test the initial render with InstallIntegrationDrawer', async () => {
    await initInstallIntegrationDrawer();
    expect(screen.getByText('Upload integration')).toBeInTheDocument();
    expect(screen.getByText('Browse to Zip file')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/home');
  });

  test('Should able to test the render with Preview', async () => {
    await initInstallIntegrationDrawer('/preview/_someId');
    expect(screen.getByRole('heading', {name: 'Upload integration'})).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => btn.getAttribute('data-test') === 'closeRightDrawer');
    const backbutton = buttons.find(btn => btn.getAttribute('data-test') === 'backRightDrawer');

    expect(closeButton).toBeInTheDocument();
    expect(backbutton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/home');
    await userEvent.click(backbutton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});

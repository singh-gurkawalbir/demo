import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route} from 'react-router-dom';
import UninstallSection from './Uninstall';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import { ConfirmDialogProvider } from '../../../../../../components/ConfirmDialog';

async function initUninstallSection(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: 'Amazon - NetSuite',
      install: [],
      sandbox: false,
      settings: {storeLabel: 'Amazon Account', supportsMultiStore: !!props.supportsMultiStore},
      _connectorId: '58777a2b1008fb325e6c0953',
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }];
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin/readme`}]}>
      <Route path={`/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin/readme`}>
        <ConfirmDialogProvider>
          <UninstallSection {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('UninstallSection UI tests', () => {
  test('should pass the initialRender when integration isParentView is false', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b04'});
    expect(screen.getByText('Once you uninstall this Integration App there is no going back. Please be certain.')).toBeInTheDocument();
    const uninstallButtons = screen.getAllByText('Uninstall');

    expect(uninstallButtons).toHaveLength(2);
  });
  test('should pass the initialRender when integration isParentView is false duplicate', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', supportsMultiStore: true});
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
    expect(screen.getByText('Choose an Amazon account from the account drop-down to uninstall.')).toBeInTheDocument();
  });
  test('should display the confirm dialog box when clicked on uninstall button', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b04'});
    let uninstallButtons = screen.getAllByText('Uninstall');

    await userEvent.click(uninstallButtons[1]);
    expect(screen.getByText('Confirm uninstall')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to uninstall?')).toBeInTheDocument();
    uninstallButtons = screen.getAllByText('Uninstall');
    expect(uninstallButtons).toHaveLength(3);
  });
  test('should make the respective url redirections when clicked on confirm uninstall', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b04'});
    let uninstallButtons = screen.getAllByText('Uninstall');

    await userEvent.click(uninstallButtons[1]);
    uninstallButtons = screen.getAllByText('Uninstall');
    await userEvent.click(uninstallButtons[2]);
    await waitFor(() => expect(mockHistoryPush).toBeCalledWith('/integrationapps/AmazonNetSuite/5ff579d745ceef7dcd797c15/uninstall'));
  });
  test('should make the respective url redirection when the integration supportsMultiStore', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b04', supportsMultiStore: true});
    let uninstallButtons = screen.getAllByText('Uninstall');

    await userEvent.click(uninstallButtons[1]);
    uninstallButtons = screen.getAllByText('Uninstall');
    await userEvent.click(uninstallButtons[2]);
    await waitFor(() => expect(mockHistoryPush).toBeCalledWith('/integrationapps/AmazonNetSuite/5ff579d745ceef7dcd797c15/uninstall/child/5ff579d745ceef7dcd797b04'));
  });
});

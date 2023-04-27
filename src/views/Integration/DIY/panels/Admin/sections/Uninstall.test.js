
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route} from 'react-router-dom';
import UninstallSection from './Uninstall';
import {mutateStore, reduxStore, renderWithProviders} from '../../../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../../../../components/ConfirmDialog';

const initialStore = reduxStore;

async function initUninstallSection(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      settings: props.settings,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: props.steps,
      // uninstallSteps: [{name: 'uninstallStep1'}, {name: 'uninstallStep2'}, {name: 'uninstallStep3'}],
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
const demoSteps = [{name: 'installStep1'}, {name: 'installStep2'}, {name: 'installStep3'}];

describe('UninstallSection UI tests', () => {
  test('should pass the initial render', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', steps: demoSteps});
    expect(screen.getByText('Use this page to uninstall this instance (i.e. this tile) of the Integration App. Uninstalling an Integration App will remove all components, including the integration tile, from your integrator.io account. After uninstalling you can re-install from the marketplace as long as you have a valid subscription. Please be very certain that you want to uninstall as this action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Once you uninstall this Integration App there is no going back. Please be certain.')).toBeInTheDocument();
    const buttons = screen.getAllByText('Uninstall');

    expect(buttons).toHaveLength(2);
  });
  test('should display the confirm dialogue when clicked on uninstall button', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15', steps: demoSteps});
    const buttons = screen.getAllByText('Uninstall');

    await userEvent.click(buttons[1]);
    expect(screen.getByText('Confirm uninstall')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to uninstall?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should make the respective url redirection when integration is of "Framework 2"', async () => {
    await initUninstallSection({integrationId: '5ff579d745ceef7dcd797c15'});
    let buttons = screen.getAllByText('Uninstall');

    await userEvent.click(buttons[1]);
    buttons = screen.getAllByText('Uninstall');
    await userEvent.click(buttons[2]);
    await waitFor(() => expect(mockHistoryPush).toBeCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall'));
  });
  test('should make the respective url redirection when url contains childId', async () => {
    const props = {integrationId: '5ff579d745ceef7dcd797c15', steps: demoSteps, child: 'child'};

    await initUninstallSection(props);
    let buttons = screen.getAllByText('Uninstall');

    await userEvent.click(buttons[1]);
    buttons = screen.getAllByText('Uninstall');
    await userEvent.click(buttons[2]);
    expect(mockHistoryPush).toBeCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall/child/admin');
  });
  test('should make the respective url redirection when integration is not of "framework 2"', async () => {
    const props = {integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b26', child: 'child', settings: {supportsMultiStore: true}};

    await initUninstallSection(props);
    let buttons = screen.getAllByText('Uninstall');

    await userEvent.click(buttons[1]);
    buttons = screen.getAllByText('Uninstall');
    await userEvent.click(buttons[2]);
    expect(mockHistoryPush).toBeCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall/child/5ff579d745ceef7dcd797b26');
  });
  test('should make the respective url redirection when the integration is not of "framework 2" and does not contain integration settings', async () => {
    const props = {integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797b26', child: 'child'};

    await initUninstallSection(props);
    let buttons = screen.getAllByText('Uninstall');

    await userEvent.click(buttons[1]);
    buttons = screen.getAllByText('Uninstall');
    await userEvent.click(buttons[2]);
    expect(mockHistoryPush).toBeCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall');
  });
});

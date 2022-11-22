/* global describe, test, expect,afterEach, jest */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mockPatchRequestOnce } from '../../../test/test-utils';
import ConfigConnectionDebugger from '.';
import { DrawerProvider } from '../Right/DrawerContext/index';
import { runServer } from '../../../test/api/server';

const mockHistoryGoBack = jest.fn();
let initialStore;

async function initConfigConnectionDebugger({debugTime = 0}) {
  initialStore = reduxStore;
  let mockDate;

  if (debugTime > 0) {
    mockDate = new Date(new Date().getTime() + debugTime * 60 * 1000);
  }

  initialStore.getState().data.resources = {
    connections: [
      {
        _id: '_connectionId',
        debugDate: mockDate,
        debugUntil: mockDate,
      },
    ],
  };
  initialStore.getState().session = {
    form: {
      'config-conn-debug':
      {
        isValid: true,
        value: {
          debugDate: 0,
        },
        fields: {
          debugDate: {
            id: 'debugDate',
            touched: true},
        },
        tempField: { touched: true },
        lastFieldUpdated: 'debugDate',
      },
    },
    asyncTask: {
      'config-conn-debug': {
        status: 'complete',
      },
    },
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/connections/configDebugger/_connectionId'}]}>
      <Route
        path="/connections/configDebugger/:connectionId"
        params={{connectionId: '_connectionId'}}>
        <DrawerProvider>
          <ConfigConnectionDebugger />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../Right', () => ({
  __esModule: true,
  ...jest.requireActual('../Right'),
  default: ({children}) => children,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('ConfigConnectionDebugger tests', () => {
  runServer();
  afterEach(() => {
    mockHistoryGoBack.mockClear();
  });

  test('Should able to test the ConfigConnectionDebugger drawer When debugger is Default Off', async () => {
    await initConfigConnectionDebugger({});
    expect(screen.queryByText(/Debug connection/i)).toBeInTheDocument();
    const titleButtons = screen.getAllByRole('button');
    const helpButton = titleButtons.find(el => el.getAttribute('class').includes('helpTextButton'));
    const closeIcon = titleButtons.find(btn => btn.getAttribute('data-test') === 'closeRightDrawer');
    const closeButton = titleButtons.find(btn => btn.getAttribute('data-test') === 'cancel');

    expect(helpButton).toBeInTheDocument();
    expect(closeIcon).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
    userEvent.click(helpButton);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    expect(screen.queryByText('_helpTitle')).not.toBeInTheDocument();
    expect(screen.queryByText(/Debug duration/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: /Off/i})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: /Next 15 mins/i})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: /Next 30 mins/i})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: /Next 45 mins/i})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: /Next 60 mins/i})).toBeInTheDocument();

    userEvent.click(closeButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    userEvent.click(closeIcon);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });

  test('Should able to test the ConfigConnectionDebugger drawer When debugger is Turned On', async () => {
    await initConfigConnectionDebugger({});
    const save = screen.getByRole('button', {name: 'Save'});

    expect(save).not.toBeEnabled();
    userEvent.click(screen.getByRole('radio', {name: 'Next 15 mins'}));
    userEvent.click(save);
    await mockPatchRequestOnce('api/connections/_connectionId', []);
    await waitFor(() => expect(screen.queryByText(/Debug mode is enabled for the next 14 minutes./i)).toBeInTheDocument());
  });

  test('Should able to test the ConfigConnectionDebugger drawer When debugger is Turned Off', async () => {
    await initConfigConnectionDebugger({debugTime: 45});
    expect(screen.queryByText(/Debug mode is enabled for the next 44 minutes./i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('radio', {name: /Off/i}));
    const saveAndClose = screen.getByRole('button', {name: 'Save & close'});

    expect(saveAndClose).toBeEnabled();
    userEvent.click(saveAndClose);
    await mockPatchRequestOnce('api/connections/_connectionId', []);
    await waitFor(() => expect(screen.queryByText(/Debug mode is enabled for the next 44 minutes./i)).not.toBeInTheDocument());
  });
});

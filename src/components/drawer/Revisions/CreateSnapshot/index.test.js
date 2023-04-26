
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import CreateSnapshotDrawer from '.';
import { DrawerProvider } from '../../Right/DrawerContext/index';

const mockHistoryGoBack = jest.fn();
const mockHistoryReplace = jest.fn();

async function initCreateSnapshotDrawer(status = 'created') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      revision: {
        _integrationId: {
          _revId: {status},
        },
      },
    };
    draft.session.form = {
    };
    draft.session.resource = {
      _revId: status === 'created' ? {} : undefined,
    };
  });

  const props = {integrationId: '_integrationId'};
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/_integrationId/revisions/snapshot/_revId/open'}]}>
      <Route
        path="/integrations/_integrationId/revisions/snapshot/:revId/open"
        params={{revId: '_revId'}}>
        <DrawerProvider>
          <CreateSnapshotDrawer {...props} />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../Right'),
  default: ({children}) => children,
}));
jest.mock('../../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../DynaForm/DynaSubmit'),
  default: props => (<><button type="button" data-test="create" disabled={props.disabled} onClick={props.onClick}> Click</button>{props.children}</>),
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    replace: mockHistoryReplace,
  }),
}));

describe('CreateSnapshotDrawer tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  const initialStore = reduxStore;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    mockHistoryGoBack.mockClear();
    mockHistoryReplace.mockClear();
    useDispatchSpy.mockClear();
  });

  test('Should able to test the intitial render for CreateSnapshotDrawer', async () => {
    await initCreateSnapshotDrawer();
    expect(screen.getByRole('heading', {name: 'Create snapshot'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'revisions guide'})).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const close = buttons.find(btn => btn.getAttribute('data-test') === 'closeRightDrawer');
    const cancelSnapshot = buttons.find(btn => btn.getAttribute('data-test') === 'cancelSnapshot');
    const create = buttons.find(btn => btn.getAttribute('data-test') === 'create');

    expect(create).toBeEnabled();
    expect(cancelSnapshot).toBeEnabled();
    expect(close).toBeEnabled();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/_integrationId/revisions/snapshot/_revId/open');
  });
  test('Should able to test the CreateSnapshotDrawer\'s infoText and description helpText', async () => {
    await initCreateSnapshotDrawer();
    const buttons = screen.getAllByRole('button');
    const info = buttons.find(btn => btn.getAttribute('data-test') === 'openPageInfo');
    const descriptionHelpText = buttons.find(btn => !btn.hasAttribute('data-test') && btn.querySelector('svg[viewBox="0 0 24 24"]'));

    expect(info).toBeEnabled();
    await userEvent.click(info);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('A snapshot is a saved capture of your integration that you can use to revert your integration at any point.')).toBeInTheDocument();
    await userEvent.click(descriptionHelpText);
    expect(screen.getByRole('heading', {name: 'Description'})).toBeInTheDocument();
    expect(screen.getByText('Describe your snapshot so you can quickly identify the revision and any important details.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
  });
  test('Should able to test the CreateSnapshotDrawer when SnapshotCreationInProgress', async () => {
    await initCreateSnapshotDrawer('creating');
    expect(screen.getByText('Creating')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to test the CreateSnapshotDrawer when createdSnapshotId successfully', async () => {
    await initCreateSnapshotDrawer('created');
    expect(screen.getByText('You\'ve successfully created a snapshot.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const createBtn = buttons.find(btn => btn.getAttribute('data-test') === 'create');

    await userEvent.click(createBtn);
    expect(mockDispatchFn).toHaveBeenCalled();
  });
});


import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import moment from 'moment';
import { renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import StartDebug from '.';
import actions from '../../actions';

const initialStore = reduxStore;

function initDebug(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [{
      _id: '5f084bff6da99c0abdacb731',
      createdAt: '2020-07-10T11:07:43.161Z',
      lastModified: '2020-12-14T05:24:10.236Z',
      type: 'ftp',
      name: 'FTP-Test',
      offline: true,
      debugDate: '2022-06-28T08:22:50.781Z',
      debugUntil: '2022-06-28T06:48:13.930Z',
      sandbox: false,
      ftp: {
        type: 'sftp',
        hostURI: 'celigo.brickftp.com',
        username: 'kalyan.chakravarthi@celigo.com',
        password: '******',
        port: 22,
        usePassiveMode: true,
        userDirectoryIsRoot: false,
        useImplicitFtps: false,
        requireSocketReUse: false,
      },
      queueSize: 0,
    }];
    draft.data.resources.scripts = [{
      _id: '5f06cc4cd665e84937f94837',
      lastModified: '2020-07-09T07:50:36.209Z',
      createdAt: '2020-07-09T07:50:36.209Z',
      name: 'BigCommerce IA Cloning',
      debugUntil: '2023-06-28T09:56:31.079Z',
    }];
  });

  const ui = (<div>ScreenSpace<MemoryRouter><StartDebug {...props} /></MemoryRouter></div>);

  return renderWithProviders(ui, {initialStore});
}

describe('startDebug UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'CONNECTIONS_LOGS_START_DEBUG':
          mutateStore(initialStore, draft => {
            draft.data.resources.connections[0].debugDate = moment().add(action.value, 'm').toISOString();
          });
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should pass the initial render', async () => {
    initDebug({resourceType: 'connections', resourceId: '5f084bff6da99c0abdacb731', disabled: false});
    await userEvent.click(screen.getByText(/Start Debug/i));
    expect(screen.getByText(/Start debug log level/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/ScreenSpace/i));
    await waitFor(() => expect(screen.queryByText(/Start debug log level/i)).not.toBeInTheDocument());
  });
  test('should render the popover when clicked on Start debug button', async () => {
    initDebug({resourceType: 'connections', resourceId: '5f084bff6da99c0abdacb731', disabled: false});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Start debug log level for/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByRole('button', {name: 'Apply'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });
  test('should select the particular option from popover when clicked on it', async () => {
    initDebug({resourceType: 'connections', resourceId: '5f084bff6da99c0abdacb731', disabled: false});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Start debug log level for/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 mins'});

    await userEvent.click(option);
    await waitFor(() => expect(screen.getByText(/Next 30 mins/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByText(/Next 45 mins/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Next 60 mins/i, {exact: false})).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', {name: 'Next 30 mins'}));
    await waitFor(() => expect(screen.getByText(/Next 30 mins/i, {exact: false})).toBeInTheDocument());
  });
  test('should make the respective dispatch call when clicked on apply button', async () => {
    initDebug({resourceType: 'connections', resourceId: '5f084bff6da99c0abdacb731', disabled: false});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Start debug log level for/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 mins'});

    await userEvent.click(option);
    await userEvent.click(screen.getByRole('option', {name: 'Next 45 mins'}));
    const applyButton = screen.getByRole('button', {name: 'Apply'});

    await userEvent.click(applyButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.connections.startDebug('5f084bff6da99c0abdacb731', '45')));
    await waitFor(() => expect(screen.queryByText(/Next 30 mins/i, {exact: false})).toBeNull());
    expect(screen.queryByText(/Next 45 mins/i, {exact: false})).toBeNull();
    expect(screen.queryByText(/Next 60 mins/i, {exact: false})).toBeNull();
    await waitFor(() => expect(screen.getByText(/45m remaining/i)).toBeInTheDocument());
  });
  test('should return to initial render when clicked on cancel button', async () => {
    initDebug({resourceType: 'connections', resourceId: '5f084bff6da99c0abdacb731', disabled: false});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Start debug log level for/i, {exact: false})).toBeInTheDocument());
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    await userEvent.click(cancelButton);
    await waitFor(() => expect(screen.getByText(/Start Debug/i)).toBeInTheDocument());
  });
});


/* global describe, test, expect ,jest, */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../test/test-utils';
import StartDebugEnhanced from '.';

const mockStartHandler = jest.fn();
const mockStopHandler = jest.fn();

function DebugEnhanced(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.connections = [{
    _id: '5f084bff6da99c0abdacb731',
    createdAt: '2020-07-10T11:07:43.161Z',
    lastModified: '2020-12-14T05:24:10.236Z',
    type: 'ftp',
    name: 'FTP-Test',
    offline: true,
    debugDate: '2022-06-28T06:48:13.930Z',
    debugUntil: props.date,
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
  initialStore.getState().data.resources.scripts = [{
    _id: '5f06cc4cd665e84937f94837',
    lastModified: '2020-07-09T07:50:36.209Z',
    createdAt: '2020-07-09T07:50:36.209Z',
    name: 'BigCommerce IA Cloning',
    debugUntil: '2023-06-28T09:56:31.079Z',
  }];
  const ui = (<div> ScreenSpace<MemoryRouter><StartDebugEnhanced {...props} /></MemoryRouter></div>);

  return renderWithProviders(ui, {initialStore});
}

describe('StartDebugEnhanced UI tests', () => {
  test('initial render', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByText(/Start Debug/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/Start Debug/i));
    const screenspace = screen.getByText(/ScreenSpace/i);

    userEvent.click(screenspace);
    expect(screen.queryByText(/Last Debug/i)).not.toBeInTheDocument();
    screen.debug();
  });
  test('checking the render of the popover', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    await waitFor(() => expect(screen.getByText(/Start Debug/i)).toBeInTheDocument());
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Last debug/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Apply'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
  });
  test('checking the contents of popover menu', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    userEvent.click(option);
    waitFor(() => expect(screen.getByText(/Next 30 minutes/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByText(/Next 45 minutes/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Next 60 minutes/i, {exact: false})).toBeInTheDocument();
  });
  test('checking the functionality of the apply button', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    userEvent.click(option);
    userEvent.click(screen.getByRole('option', {name: 'Next 30 minutes'}));
    userEvent.click(screen.getByRole('button', {name: 'Apply'}));
    expect(mockStartHandler).toBeCalledTimes(1);
    expect(mockStartHandler).toHaveBeenCalledWith('30');
  });
  test('checking the functionality of the cancel button', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByRole('button', {name: 'Next 15 minutes'})).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(screen.getByText(/Start Debug/i)).toBeInTheDocument();
  });
});
describe('Use cases where debug date is after current moment', () => {
  test('initial render and functionality of buttons', () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2023-06-28T08:22:50.781Z',
    });
    waitFor(() => expect(screen.getByText(/Stop Debug/i)).toBeInTheDocument());
    waitFor(() => userEvent.click(screen.getByText(/Stop Debug/i)));
    waitFor(() => expect(mockStartHandler).toBeCalledTimes(1));
  });
  test('Blank Render', () => {
    const props = {
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
    };

    DebugEnhanced(props);
    screen.debug();
    expect(screen.getByText(/Start Debug/i)).toBeInTheDocument();
  });
  test('Blank Render', () => {
    const props = {
      resourceId: '5f084bff6da99c0abdmnb731',
      resourceType: 'connections',
      disabled: true,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
    };

    DebugEnhanced(props);
    expect(screen.queryByRole('button', {name: 'Start Debug'})).toBeNull();
  });
  test('covering formatter function statements', async () => {
    jest.mock('../Buttons/index', () => ({
      __esModule: true,
      ...jest.requireActual('../Buttons/index'),
      default: props => (
        // eslint-disable-next-line react/button-has-type
        <button onClick={props.onClick()}>Apply</button>
      ),
    }));
    const props = {
      resourceId: '5f084bff6da99c0abdmnb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
    };

    renderWithProviders(<MemoryRouter><StartDebugEnhanced {...props} /></MemoryRouter>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    userEvent.click(option);
    userEvent.click(screen.getByRole('option', {name: 'Next 30 minutes'}));
    userEvent.click(screen.getByRole('button', {name: 'Apply'}));
  });
});


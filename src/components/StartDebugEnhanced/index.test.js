
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import StartDebugEnhanced from '.';

const mockStartHandler = jest.fn();
const mockStopHandler = jest.fn();

function DebugEnhanced(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.connections = [{
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
    draft.data.resources.scripts = [{
      _id: '5f06cc4cd665e84937f94837',
      lastModified: '2020-07-09T07:50:36.209Z',
      createdAt: '2020-07-09T07:50:36.209Z',
      name: 'BigCommerce IA Cloning',
      debugUntil: '2023-06-28T09:56:31.079Z',
    }];
  });

  const ui = (<div> ScreenSpace<MemoryRouter><StartDebugEnhanced {...props} /></MemoryRouter></div>);

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../Buttons/index', () => ({
  __esModule: true,
  ...jest.requireActual('../Buttons/index'),
  default: props => (
    // eslint-disable-next-line react/button-has-type
    <button onClick={props.onClick()}>Apply</button>
  ),
}));

describe('startDebugEnhanced UI tests', () => {
  test('should pass the initial render', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByText(/Start Debug/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Start Debug/i));
    const screenspace = screen.getByText(/ScreenSpace/i);

    await userEvent.click(screenspace);
    await waitFor(() => expect(screen.queryByText(/Last Debug/i)).not.toBeInTheDocument());
  });
  test('should render the popover when clicked on Start Debug button', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    await waitFor(() => expect(screen.getByText(/Start Debug/i)).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Last debug/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Apply'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
  });
  test('should display the contents of popover menu correctly', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    await userEvent.click(option);
    waitFor(() => expect(screen.getByText(/Next 30 minutes/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByText(/Next 45 minutes/i, {exact: false})).toBeInTheDocument();
    expect(screen.getByText(/Next 60 minutes/i, {exact: false})).toBeInTheDocument();
  });
  test('should call the respective callback functions when clicked on apply button', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    await userEvent.click(option);
    await userEvent.click(screen.getByRole('option', {name: 'Next 30 minutes'}));
    await userEvent.click(screen.getByRole('button', {name: 'Apply'}));
    expect(mockStartHandler).toHaveBeenCalledTimes(1);
    expect(mockStartHandler).toHaveBeenCalledWith('30');
  });
  test('should close the popover when clicked on close button', async () => {
    DebugEnhanced({
      resourceId: '5f084bff6da99c0abdacb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
      date: '2022-06-28T08:22:50.781Z',
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    expect(screen.getByRole('button', {name: 'Next 15 minutes'})).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(screen.getByText(/Start Debug/i)).toBeInTheDocument();
  });
});
describe('use cases where debug date is after current moment', () => {
  test('should call the respective callback function when clicked on Stop Debug button', () => {
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
    waitFor(() => expect(mockStartHandler).toHaveBeenCalledTimes(1));
  });
  test('should hide the other options when clicked on an option and theen on apply button', async () => {
    const props = {
      resourceId: '5f084bff6da99c0abdmnb731',
      resourceType: 'connections',
      disabled: false,
      startDebugHandler: mockStartHandler,
      stopDebugHandler: mockStopHandler,
    };

    renderWithProviders(<MemoryRouter><StartDebugEnhanced {...props} /></MemoryRouter>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText(/Capture debug logs/i, {exact: false})).toBeInTheDocument());
    const option = screen.getByRole('button', {name: 'Next 15 minutes'});

    await userEvent.click(option);
    await userEvent.click(screen.getByRole('option', {name: 'Next 30 minutes'}));
    await userEvent.click(screen.getByRole('button', {name: 'Apply'}));
    expect(screen.queryByText('Next 15 minutes')).toBeNull();
  });
});


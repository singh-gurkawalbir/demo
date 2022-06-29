/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore} from '../../test/test-utils';
import RegisterConnections from './index';

async function customFunc(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources.connections = [{
    _id: '5f084bff6da99c0abdacb731',
    createdAt: '2020-07-10T11:07:43.161Z',
    lastModified: '2020-12-14T05:24:10.236Z',
    type: 'ftp',
    name: 'FTP-Test',
    offline: true,
    debugDate: '2020-09-18T12:04:31.079Z',
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
  initialStore.getState().data.resources.integrations = [{
    _id: '5f5f09aded5b6f5f6c851f23',
    lastModified: '2020-09-18T10:41:09.051Z',
    name: 'Marketo Flows',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5f5f08e6ed5b6f5f6c851ef8',
      '5f084bff6da99c0abdacb731',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2020-09-14T06:11:57.537Z',
  }];

  const ui = (
    <MemoryRouter>
      <RegisterConnections {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockHandleChange = jest.fn().mockReturnValue({
  connections: {
    '62543ffed68e2457e3b35315': true,
    '5dcd2e3d3791751318970ef9': true,
  },
});

jest.mock('../LoadResources', () => ({              // LoadResources Mock//
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props =>
    (
      <>
        <div>
          {props.children}
        </div>
      </>
    )
  ,
}));
jest.mock('../CeligoTable', () => ({      // CeligoTable Mock//
  __esModule: true,
  ...jest.requireActual('../CeligoTable'),
  default: props => {
    const handleSelectChange = () => {
      const { connections } = mockHandleChange();

      props.onSelectChange(connections);
    };

    return (
      <>
        <button type="button" onClick={handleSelectChange} data-testid="text_button_1">
          mockedRegister
        </button>
      </>
    );
  },
}));

const mockHandleSubmit = jest.fn().mockReturnValue({
  selected: {
    '62543ffed68e2457e3b35315': true,
    '5dcd2e3d3791751318970ef9': true,
  },
});

jest.mock('../Buttons/OutlinedButton', () => ({         // OutlinedButton Mock//
  __esModule: true,
  ...jest.requireActual('../Buttons/OutlinedButton'),
  default: props => {
    const handleRegisterClick = () => {
      const { selected } = mockHandleSubmit();

      props.onClick(selected);
    };

    return (
      <>
        <button type="button" onClick={handleRegisterClick} data-testid="text_button_1">
          RegisterButton
        </button>
      </>
    );
  },
}));

describe('Register Connections UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('Initial render', async () => {
    const mockOnClose = jest.fn();

    await customFunc({onClose: mockOnClose, integrationId: '5f5f09aded5b6f5f6c851f23'});
    expect(screen.getByText(/Register Connections/i)).toBeInTheDocument();
    expect(screen.getByText(/RegisterButton/i)).toBeInTheDocument();
  });
  test('Checking the functioning of Register Button', async () => {
    const mockOnClose = jest.fn();

    await customFunc({onClose: mockOnClose, integrationId: '5f5f09aded5b6f5f6c851f23'});
    const buton = screen.getByText(/RegisterButton/i);

    userEvent.click(buton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
    expect(mockOnClose).toBeCalledTimes(1);
    screen.debug();
  });
  test('Checking the functioning of handle select change option', async () => {
    const mockOnClose = jest.fn();

    await customFunc({onClose: mockOnClose, integrationId: '5f5f09aded5b6f5f6c851f23'});
    const buton = screen.getByText(/Register Connections/i);

    userEvent.click(buton);
    const button = screen.getByText(/mockedRegister/i); // Register button is rendered by mocked component//

    userEvent.click(button);
    userEvent.click(screen.getByText(/RegisterButton/i));
    screen.debug();
  });
});


import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import { message } from '../../utils/messageStore';
import NetSuiteMappingAssistant from '.';
import actions from '../../actions';

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (<div>Spinner</div>),
}));

jest.mock('../../utils/mapping/application/netsuite', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/mapping/application/netsuite'),
  default: {
    isNSMappingAssistantSupported: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
  },
}));

async function initNetSuiteMappingAssistant(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <NetSuiteMappingAssistant {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for NetSuiteMappingAssistant', () => {
  let useDispatchSpy;
  let mockDispatchFn;

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
    mockDispatchFn.mockClear();
  });

  test('should show error details when connection is not configured', async () => {
    await initNetSuiteMappingAssistant();
    expect(screen.getByText('Missing connection configuration.')).toBeInTheDocument();
  });

  test('should display spinner if netSuiteRecordMetadata is not found', async () => {
    const initialStore = getCreatedStore();
    const netSuiteConnectionId = '173uww';

    mutateStore(initialStore, draft => {
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
    });

    await initNetSuiteMappingAssistant({netSuiteConnectionId}, initialStore);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  test('should display the steps to login and launch NetSuite Mapping Assistant', async () => {
    const netSuiteConnectionId = '173uww';
    const netSuiteRecordType = 'componentinventorydetail';
    const path = `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[netSuiteConnectionId] = {};
      draft.session.metadata.application[netSuiteConnectionId][path] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: 'inventorydetail',
          url: 'https:://sampleURL.com',
        }],
      };
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
    });
    const connection = initialStore.getState().data.resources.connections[0].netsuite;

    await initNetSuiteMappingAssistant({netSuiteConnectionId, netSuiteRecordType}, initialStore);
    const launchButton = screen.getByRole('button', {name: 'Launch NetSuite assistant'});

    expect(launchButton).toBeEnabled();

    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');

    expect(items).toHaveLength(3);
    const launchSteps = items.map(item => item.textContent);

    expect(launchSteps).toEqual([
      'Please make sure that you have "Celigo integrator.io" bundle (ID: 20038) version 1.7.4.5 or higher.',
      `Please click here to login to your NetSuite account ${connection.account}.`,
      'After login, please click the "Launch NetSuite assistant" button.',
    ]);

    const loginLink = screen.getByRole('link', {name: 'here'});

    expect(loginLink).toHaveAttribute('href', `${connection.dataCenterURLs.systemDomain}/app/login/secure/enterpriselogin.nl?c=${connection.account}&whence=`);
    expect(loginLink).toHaveAttribute('target', 'blank');
  });

  test('should enqueue error snackbar if unable to launch assistant', async () => {
    const initialStore = getCreatedStore();
    const netSuiteConnectionId = '173uww';
    const netSuiteRecordType = 'manualrecordtype';
    const path = `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`;

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[netSuiteConnectionId] = {};
      draft.session.metadata.application[netSuiteConnectionId][path] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: netSuiteRecordType,
          url: 'https:://sampleURL.com',
        }],
      };
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
    });
    await initNetSuiteMappingAssistant({netSuiteConnectionId, netSuiteRecordType}, initialStore);
    const launchButton = screen.getByRole('button', {name: 'Launch NetSuite assistant'});

    expect(launchButton).toBeEnabled();
    await userEvent.click(launchButton);
    const snackBar = screen.getByRole('alert');

    expect(snackBar.textContent).toEqual(message.NETSUITE_ASSISTANT_LAUNCH_ERROR);
  });

  test('should be able to successfully launch assistant', async () => {
    const initialStore = getCreatedStore();
    const netSuiteConnectionId = '173uww';
    const netSuiteRecordType = 'manualrecordtype';
    const path = `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`;

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[netSuiteConnectionId] = {};
      draft.session.metadata.application[netSuiteConnectionId][path] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: netSuiteRecordType,
          url: 'https:://sampleURL.com',
        }],
      };
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
    });
    await initNetSuiteMappingAssistant({netSuiteConnectionId, netSuiteRecordType}, initialStore);

    const launchButton = screen.getByRole('button', {name: 'Launch NetSuite assistant'});

    expect(launchButton).toBeEnabled();
    await userEvent.click(launchButton);
    const nsMapAsst = screen.getByTitle('NetSuite Mapping Assistant');

    expect(nsMapAsst).toBeInTheDocument();
  });

  test('should unset isNSAssistantFormLoaded on unmounting', async () => {
    const initialStore = getCreatedStore();
    const netSuiteConnectionId = '173uww';
    const netSuiteRecordType = 'manualrecordtype';
    const path = `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`;

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[netSuiteConnectionId] = {};
      draft.session.metadata.application[netSuiteConnectionId][path] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: netSuiteRecordType,
          url: 'https:://sampleURL.com',
        }],
      };
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
      draft.session.mapping.mapping = { isNSAssistantFormLoaded: true };
    });
    const { utils: {unmount}} = await initNetSuiteMappingAssistant({netSuiteConnectionId, netSuiteRecordType}, initialStore);

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.setNSAssistantFormLoaded(false));
  });

  test('should throw error if data is provided but isNSAssistantFormLoaded is true', async () => {
    const data = {
      data: {
        returnedObjects: {
          jsObjects: {
            data: [{
              data: 'manualData',
            }],
          },
        },
      },
    };
    const initialStore = getCreatedStore();
    const netSuiteConnectionId = '173uww';
    const netSuiteRecordType = 'manualrecordtype';
    const path = `netsuite/metadata/suitescript/connections/${netSuiteConnectionId}/recordTypes`;

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[netSuiteConnectionId] = {};
      draft.session.metadata.application[netSuiteConnectionId][path] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: netSuiteRecordType,
          url: 'https:://sampleURL.com',
        }],
      };
      draft.data.resources.connections = [{
        _id: netSuiteConnectionId,
        netsuite: {
          account: 'ASDFGH123',
          dataCenterURLs: {
            systemDomain: 'https://asdfgh123.app.netsuite.com',
          },
        },
      }];
      draft.session.mapping.mapping = { isNSAssistantFormLoaded: true };
    });
    try {
      await initNetSuiteMappingAssistant({netSuiteConnectionId, netSuiteRecordType, data}, initialStore);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e).toEqual(expect.any(TypeError));
    }
  });
});
